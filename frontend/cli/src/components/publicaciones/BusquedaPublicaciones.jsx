import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../ui/CustomSelect';
import { useBusquedaPublicaciones } from './useBusquedaPublicaciones';
import { TIPO_PUBLICACION, ESPECIE, RAZAS_PERRO, RAZAS_GATO } from '../../constants/mascotas';

const calcularDistanciaKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export default function BusquedaPublicaciones({
  isOpen = true,
  mostrarEnInicio = false,
  refrescoKey = 0,
  onClose,
  onSelectPublicacion
}) {
  const {
    termino,
    setTermino,
    tipo,
    setTipo,
    especie,
    setEspecie,
    raza,
    setRaza,
    cercaniaActiva,
    coordsUsuario,
    toggleCercania,
    cargandoUbicacion,
    publicaciones,
    totalResultados,
    cargando,
    error,
    ejecutarBusqueda,
    paginaActual,
    totalPaginas,
    setPaginaActual
  } = useBusquedaPublicaciones({ refrescoKey });

  const [menuFiltroAbierto, setMenuFiltroAbierto] = useState(false);
  const filtroRef = useRef(null);

  useEffect(() => {
    function handleClickAfuera(e) {
      if (filtroRef.current && !filtroRef.current.contains(e.target)) {
        setMenuFiltroAbierto(false);
      }
    }
    document.addEventListener('mousedown', handleClickAfuera);
    return () => document.removeEventListener('mousedown', handleClickAfuera);
  }, []);

  if (!isOpen && !mostrarEnInicio) return null;

  const listaRazas = [
    { value: '', label: 'Todas las razas' },
    ...(especie === ESPECIE.PERRO
      ? RAZAS_PERRO
      : especie === ESPECIE.GATO
      ? RAZAS_GATO
      : [])
  ];

  const hayCriterioActivo = Boolean(
    termino.trim() !== '' ||
    especie !== '' ||
    tipo !== '' ||
    raza !== '' ||
    cercaniaActiva
  );

  const hayFiltrosAvanzados = Boolean(especie || tipo || raza);
  const debeMostrarPanel = mostrarEnInicio || hayCriterioActivo;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. ISLA FLOTANTE COMPACTA DE BÚSQUEDA (Solo visible en la pestaña Buscar) */}
      {/* ========================================================================= */}
      {isOpen && (
        <aside className="fixed left-28 top-6 z-30 w-[380px] bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white/90 shadow-[0_20px_50px_-10px_rgba(45,55,72,0.18)] p-4 space-y-3 transition-all duration-300 ease-out animate-in fade-in slide-in-from-left-4">
          
          {/* Cabecera */}
          <div className="flex items-center justify-between pb-1 border-b border-gray-100">
            <h2 className="text-sm font-black text-[#2D3748]">
              Búsqueda
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar búsqueda"
                className="w-7 h-7 rounded-full bg-white/60 hover:bg-white text-gray-500 flex items-center justify-center text-xs font-bold transition shadow-xs cursor-pointer border border-white/80"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILA PRINCIPAL: [ Píldora ] [ Botón 5 km ] [ Botón Filtros ] */}
          <div className="flex items-center gap-2">
            
            {/* Píldora de búsqueda con botón de lupa */}
            <div className="relative flex-1">
              <input
                type="text"
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ejecutarBusqueda()}
                placeholder="Buscar..."
                className="w-full pl-4 pr-10 py-2.5 text-xs font-semibold rounded-full border border-gray-200 bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF7A59] focus:border-transparent transition-all placeholder:text-gray-400 text-gray-800"
              />
              <button
                type="button"
                onClick={ejecutarBusqueda}
                title="Buscar"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FF7A59] hover:bg-[#ff6842] active:scale-95 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            {/* Botón Radio 5 km */}
            <button
              type="button"
              onClick={toggleCercania}
              disabled={cargandoUbicacion}
              title={cercaniaActiva ? "Radio de 5 km activado" : "Activar radio de 5 km"}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-2 flex-shrink-0 active:scale-95 ${
                cercaniaActiva
                  ? 'bg-[#2EC4B6] text-white border-[#2EC4B6] shadow-[0_4px_16px_rgba(46,196,182,0.45)] scale-105'
                  : 'bg-teal-50/90 text-[#2EC4B6] border-[#2EC4B6]/40 hover:bg-teal-100 hover:border-[#2EC4B6]'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Botón Filtros (Sliders SVG) */}
            <div className="relative" ref={filtroRef}>
              <button
                type="button"
                onClick={() => setMenuFiltroAbierto((prev) => !prev)}
                title="Filtros"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-2 flex-shrink-0 active:scale-95 ${
                  hayFiltrosAvanzados || menuFiltroAbierto
                    ? 'bg-[#FF7A59] text-white border-[#FF7A59] shadow-[0_4px_16px_rgba(255,122,89,0.45)] scale-105'
                    : 'bg-orange-50/90 text-[#FF7A59] border-[#FF7A59]/40 hover:bg-orange-100 hover:border-[#FF7A59]'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 320 320" fill="none">
                  <path d="M60 98H260" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
                  <circle cx="208" cy="98" r="30" fill="currentColor" />
                  <path d="M60 160H260" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
                  <circle cx="114" cy="160" r="30" fill="currentColor" />
                  <path d="M60 226H260" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
                  <circle cx="235" cy="226" r="30" fill="currentColor" />
                </svg>
              </button>

              {/* RECUADRO FLOTANTE CON FILTROS */}
              <AnimatePresence>
                {menuFiltroAbierto && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-[0_24px_50px_-12px_rgba(45,55,72,0.22)] border border-white/90 ring-1 ring-black/5 p-4 z-50 space-y-3.5"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                      <span className="text-xs font-black text-[#2D3748]">Filtros</span>
                      {hayFiltrosAvanzados && (
                        <button
                          type="button"
                          onClick={() => {
                            setEspecie('');
                            setRaza('');
                            setTipo('');
                            ejecutarBusqueda();
                          }}
                          className="text-[10px] font-bold text-[#FF7A59] hover:underline cursor-pointer"
                        >
                          Restablecer
                        </button>
                      )}
                    </div>

                    {/* 1. Especies */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1.5">
                        Especie
                      </label>
                      <div className="flex rounded-2xl bg-[#F7F4EE]/80 backdrop-blur-md p-1 border border-white/80 shadow-inner gap-1">
                        <button
                          type="button"
                          onClick={() => { setEspecie(''); setRaza(''); }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            especie === ''
                              ? 'bg-white text-[#FF7A59] shadow-sm scale-[1.02] border border-black/5'
                              : 'text-[#718096] hover:text-[#2D3748]'
                          }`}
                        >
                          Todas
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEspecie(ESPECIE.PERRO); setRaza(''); }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            especie === ESPECIE.PERRO
                              ? 'bg-white text-[#FF7A59] shadow-sm scale-[1.02] border border-black/5'
                              : 'text-[#718096] hover:text-[#2D3748]'
                          }`}
                        >
                          Perros
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEspecie(ESPECIE.GATO); setRaza(''); }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            especie === ESPECIE.GATO
                              ? 'bg-white text-[#FF7A59] shadow-sm scale-[1.02] border border-black/5'
                              : 'text-[#718096] hover:text-[#2D3748]'
                          }`}
                        >
                          Gatos
                        </button>
                      </div>
                    </div>

                    {/* 2. Raza con CustomSelect */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-[#4A5568]">
                          Raza {especie ? `(${especie === ESPECIE.PERRO ? 'Perro' : 'Gato'})` : ''}
                        </label>
                        {raza && (
                          <button
                            type="button"
                            onClick={() => setRaza('')}
                            className="text-[10px] font-bold text-[#FF7A59] hover:underline cursor-pointer"
                          >
                            Quitar
                          </button>
                        )}
                      </div>
                      
                      <CustomSelect
                        value={raza}
                        onChange={(val) => setRaza(val)}
                        options={listaRazas}
                        disabled={!especie}
                        placeholder={!especie ? "Seleccioná especie primero" : "Todas las razas"}
                        activeColor="#FF7A59"
                        searchable={true}
                      />
                    </div>

                    {/* 3. Estado */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1.5">
                        Estado
                      </label>
                      <div className="flex rounded-2xl bg-[#F7F4EE]/80 backdrop-blur-md p-1 border border-white/80 shadow-inner gap-1">
                        <button
                          type="button"
                          onClick={() => setTipo('')}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            tipo === ''
                              ? 'bg-white text-[#2D3748] shadow-sm scale-[1.02] border border-black/5'
                              : 'text-[#718096] hover:text-[#2D3748]'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          type="button"
                          onClick={() => setTipo(tipo === TIPO_PUBLICACION.PERDIDA ? '' : TIPO_PUBLICACION.PERDIDA)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            tipo === TIPO_PUBLICACION.PERDIDA
                              ? 'bg-[#FF7A59] text-white shadow-sm scale-[1.02]'
                              : 'text-[#718096] hover:text-[#FF7A59]'
                          }`}
                        >
                          Perdidos
                        </button>
                        <button
                          type="button"
                          onClick={() => setTipo(tipo === TIPO_PUBLICACION.ENCONTRADA ? '' : TIPO_PUBLICACION.ENCONTRADA)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                            tipo === TIPO_PUBLICACION.ENCONTRADA
                              ? 'bg-[#2EC4B6] text-white shadow-sm scale-[1.02]'
                              : 'text-[#718096] hover:text-[#2EC4B6]'
                          }`}
                        >
                          Encontrados
                        </button>
                      </div>
                    </div>

                    {/* Botón Aplicar */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setMenuFiltroAbierto(false);
                        ejecutarBusqueda();
                      }}
                      className="w-full py-2.5 bg-[#FF7A59] text-white rounded-2xl text-xs font-bold shadow-md hover:bg-[#ff6842] transition-colors cursor-pointer mt-1"
                    >
                      Aplicar Filtros
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chips de filtros activos */}
          {(cercaniaActiva || especie || tipo || raza) && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {cercaniaActiva && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2EC4B6]/15 text-[#2EC4B6] border border-[#2EC4B6]/30">
                  <span>Radio 5 km</span>
                  <button type="button" onClick={toggleCercania} className="ml-0.5 cursor-pointer">✕</button>
                </span>
              )}
              {especie && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF7A59]/15 text-[#FF7A59] border border-[#FF7A59]/30">
                  <span>{especie === ESPECIE.PERRO ? 'Perros' : 'Gatos'}</span>
                  <button type="button" onClick={() => { setEspecie(''); setRaza(''); }} className="ml-0.5 cursor-pointer">✕</button>
                </span>
              )}
              {raza && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF7A59]">
                  <span>{raza}</span>
                  <button type="button" onClick={() => setRaza('')} className="ml-0.5 cursor-pointer">✕</button>
                </span>
              )}
              {tipo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
                  <span>{tipo === TIPO_PUBLICACION.PERDIDA ? 'Perdidos' : 'Encontrados'}</span>
                  <button type="button" onClick={() => setTipo('')} className="ml-0.5 cursor-pointer">✕</button>
                </span>
              )}
            </div>
          )}

          {/* Footer del buscador */}
          <div className="pt-2 border-t border-gray-100 text-[11px] font-bold text-gray-400">
            {totalResultados} {totalResultados === 1 ? 'resultado' : 'resultados'}
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 2. RECUADRO DERECHO: LISTA VERTICAL ORDENADA DE 5 PUBLICACIONES */}
      {/* ========================================================================= */}
      {debeMostrarPanel && (
        <section className="fixed right-6 top-6 bottom-6 w-[440px] z-30 bg-white/95 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-[0_20px_50px_-10px_rgba(45,55,72,0.18)] p-5 flex flex-col justify-between transition-all duration-300 ease-out animate-in fade-in slide-in-from-right-8">
          
          {/* Cabecera */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#2D3748]">
                {mostrarEnInicio
                  ? 'Mascotas Recientes'
                  : cercaniaActiva
                  ? 'Mascotas en el Radar (5 km)'
                  : 'Resultados de Búsqueda'}
              </h3>
              <p className="text-[11px] text-gray-400 font-semibold">
                {totalResultados} {totalResultados === 1 ? 'publicación' : 'publicaciones'}
              </p>
            </div>
            {totalResultados > 0 && (
              <div className="flex items-center gap-1.5 bg-[#F7F4EE] px-3 py-1 rounded-full text-xs font-black text-[#2D3748] border border-black/5">
                <span>Página {paginaActual} de {totalPaginas}</span>
              </div>
            )}
          </div>

          {/* Lista Vertical de 5 publicaciones del mismo tamaño */}
          <div className="flex-1 my-3 overflow-y-auto space-y-2.5 pr-1">
            {cargando ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                <div className="w-7 h-7 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold">Cargando publicaciones...</p>
              </div>
            ) : error ? (
              <div className="h-full flex items-center justify-center p-4">
                <p className="text-xs font-bold text-red-500 text-center">{error}</p>
              </div>
            ) : publicaciones.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-[#F7F4EE]/60 rounded-3xl border border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center text-gray-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#2D3748]">No hay coincidencias</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
                    No se encontraron mascotas con los filtros seleccionados.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {publicaciones.map((pub) => {
                  const dist = cercaniaActiva && coordsUsuario && pub.coordenadas
                    ? calcularDistanciaKm(coordsUsuario.latitud, coordsUsuario.longitud, pub.coordenadas.lat, pub.coordenadas.lng)
                    : null;

                  const tipoFinal = pub.tipoPublicacion || pub.tipo;
                  const esPerdida = String(tipoFinal).toUpperCase().includes('PERDID');
                  const fotoFinal = pub.fotografia || pub.imagenUrl;

                  return (
                    <div
                      key={pub.id}
                      onClick={() => onSelectPublicacion && onSelectPublicacion(pub.id)}
                      className="w-full bg-white hover:bg-[#FFF9F6] rounded-2xl p-3 border border-gray-200/80 hover:border-[#FF7A59]/40 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center gap-3.5 group"
                    >
                      {/* Miniatura cuadrada uniforme */}
                      <div className="w-14 h-14 rounded-2xl bg-[#F7F4EE] flex-shrink-0 overflow-hidden flex items-center justify-center border border-black/5 group-hover:scale-105 transition-transform duration-200">
                        {fotoFinal ? (
                          <img
                            src={fotoFinal.startsWith('data:') || fotoFinal.startsWith('http') ? fotoFinal : `data:image/jpeg;base64,${fotoFinal}`}
                            alt={pub.nombre || pub.nombreMascota || 'Mascota'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-300">
                            <svg className="w-7 h-7 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Información central estructurada */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                              esPerdida
                                ? 'bg-[#FF7A59]/15 text-[#FF7A59]'
                                : 'bg-[#2EC4B6]/15 text-[#2EC4B6]'
                            }`}
                          >
                            {esPerdida ? 'PERDIDO' : 'ENCONTRADO'}
                          </span>

                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                            {dist !== null && (
                              <span className="text-[#FF7A59] font-black">a {dist.toFixed(1)} km</span>
                            )}
                            <span>{pub.especie === ESPECIE.GATO ? 'Gato' : 'Perro'}</span>
                          </div>
                        </div>

                        <h4 className="text-sm font-extrabold text-[#2D3748] truncate group-hover:text-[#FF7A59] transition-colors leading-tight">
                          {pub.nombre || pub.nombreMascota || 'Mascota sin nombre'}
                        </h4>

                        <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                          {pub.raza || 'Mestizo'} {pub.barrio ? `• ${pub.barrio}` : ''}
                        </p>
                      </div>

                      {/* Indicador sutil de selección */}
                      <div className="text-gray-300 group-hover:text-[#FF7A59] group-hover:translate-x-0.5 transition-all text-sm font-bold pl-1">
                        →
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer de Paginación */}
          {totalPaginas > 1 && publicaciones.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <button
                type="button"
                disabled={paginaActual <= 1}
                onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 bg-[#F7F4EE] hover:bg-gray-200 rounded-xl text-xs font-bold text-[#2D3748] disabled:opacity-40 transition cursor-pointer"
              >
                ← Anteriores
              </button>

              <span className="text-[11px] font-extrabold text-gray-400 tracking-wider">
                {paginaActual} de {totalPaginas}
              </span>

              <button
                type="button"
                disabled={paginaActual >= totalPaginas}
                onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                className="px-3.5 py-1.5 bg-[#FF7A59] hover:bg-[#ff6842] text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-40 transition cursor-pointer"
              >
                Siguientes →
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}