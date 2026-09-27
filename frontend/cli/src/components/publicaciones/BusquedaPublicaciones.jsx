import React, { useState, useRef, useEffect } from 'react';
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

  // Estados locales para los filtros avanzados
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [caracteristicasFiltro, setCaracteristicasFiltro] = useState('');
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

  if (!isOpen) return null;

  const opcionesRazas =
    especie === ESPECIE.PERRO
      ? RAZAS_PERRO
      : especie === ESPECIE.GATO
      ? RAZAS_GATO
      : [];

  const hayFiltrosAvanzados = Boolean(
    especie || tipo || raza || nombreFiltro.trim() || caracteristicasFiltro.trim()
  );

  const aplicarFiltrosAvanzados = () => {
    // Si escribió un nombre o característica en el panel de filtros, lo sumamos al término
    const textoCompleto = [nombreFiltro, caracteristicasFiltro].filter(Boolean).join(' ');
    if (textoCompleto) {
      setTermino(textoCompleto);
    }
    setMenuFiltroAbierto(false);
    ejecutarBusqueda();
  };

  const limpiarTodosLosFiltros = () => {
    setEspecie('');
    setTipo('');
    setRaza('');
    setNombreFiltro('');
    setCaracteristicasFiltro('');
    setTermino('');
    setMenuFiltroAbierto(false);
    ejecutarBusqueda();
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. PANEL IZQUIERDO: BÚSQUEDA Y CONTROLES AL MISMO NIVEL   */}
      {/* ========================================================= */}
      <aside className="w-[360px] my-6 h-[calc(100vh-48px)] bg-white/92 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-2xl flex flex-col justify-between p-5 z-30 transition-all duration-300 ease-out animate-in fade-in slide-in-from-left-6">
        
        <div className="space-y-4">
          {/* Cabecera limpia */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-base font-black text-[#2D3748]">
              Búsqueda
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar búsqueda"
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* FILA PRINCIPAL: [ Píldora con botón ] [ Botón 5 km ] [ Botón Filtros ] */}
          <div className="flex items-center gap-2">
            
            {/* Píldora de búsqueda con botón clickeable integrado */}
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
                title="Ejecutar búsqueda"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#FF7A59] hover:bg-[#ff6842] active:scale-95 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>

            {/* Botón de solo radio 5 km */}
            <button
              type="button"
              onClick={toggleCercania}
              disabled={cargandoUbicacion}
              title={cercaniaActiva ? "Radio de 5 km activado" : "Activar radio de 5 km"}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 border flex-shrink-0 ${
                cercaniaActiva
                  ? 'bg-[#2EC4B6] text-white border-[#2EC4B6] shadow-[0_4px_12px_rgba(46,196,182,0.3)]'
                  : 'bg-gray-100 text-gray-500 border-gray-200/80 hover:bg-gray-200/80'
              }`}
            >
              <span className="text-base select-none">📡</span>
            </button>

            {/* Botón de Filtros generales (Sliders SVG) */}
            <div className="relative" ref={filtroRef}>
              <button
                type="button"
                onClick={() => setMenuFiltroAbierto((prev) => !prev)}
                title="Filtros avanzados"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 border flex-shrink-0 ${
                  hayFiltrosAvanzados || menuFiltroAbierto
                    ? 'bg-[#FF7A59] text-white border-[#FF7A59] shadow-[0_4px_12px_rgba(255,122,89,0.3)]'
                    : 'bg-[#D9D9D9] text-white border-gray-300/70 hover:bg-[#c8c8c8]'
                }`}
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 320 320" fill="none">
                  <path d="M60 98H260" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
                  <circle cx="208" cy="98" r="30" fill="currentColor" />
                  <path d="M60 160H260" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
                  <circle cx="114" cy="160" r="30" fill="currentColor" />
                  <path d="M60 226H260" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
                  <circle cx="235" cy="226" r="30" fill="currentColor" />
                </svg>
              </button>

              {/* RECUADRO FLOTANTE DE FILTROS AVANZADOS */}
              {menuFiltroAbierto && (
                <div className="absolute right-0 top-full mt-2.5 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                    <span className="text-xs font-black text-[#2D3748]">Filtros</span>
                    {hayFiltrosAvanzados && (
                      <button
                        type="button"
                        onClick={limpiarTodosLosFiltros}
                        className="text-[10px] font-bold text-[#FF7A59] hover:underline"
                      >
                        Restablecer
                      </button>
                    )}
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={nombreFiltro}
                      onChange={(e) => setNombreFiltro(e.target.value)}
                      placeholder="Ej. Rocco, Mimi..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF7A59]"
                    />
                  </div>

                  {/* Especie */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Especie
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: '', label: 'Todas', emoji: '🐾' },
                        { id: ESPECIE.PERRO, label: 'Perros', emoji: '🐶' },
                        { id: ESPECIE.GATO, label: 'Gatos', emoji: '🐱' },
                      ].map((opc) => (
                        <button
                          key={opc.id || 'todas'}
                          type="button"
                          onClick={() => {
                            setEspecie(opc.id);
                            setRaza('');
                          }}
                          className={`py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                            especie === opc.id
                              ? 'bg-[#FF7A59] text-white shadow-xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span>{opc.emoji}</span>
                          <span>{opc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Raza */}
                  {opcionesRazas.length > 0 && (
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                        Raza
                      </label>
                      <select
                        value={raza}
                        onChange={(e) => setRaza(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 font-medium"
                      >
                        <option value="">Todas las razas</option>
                        {opcionesRazas.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Características / Color */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Color o Características
                    </label>
                    <input
                      type="text"
                      value={caracteristicasFiltro}
                      onChange={(e) => setCaracteristicasFiltro(e.target.value)}
                      placeholder="Ej. manchas blancas, collar rojo..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF7A59]"
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                      Estado
                    </label>
                    <div className="flex gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setTipo('')}
                        className={`flex-1 py-1 rounded-lg font-bold transition ${
                          tipo === '' ? 'bg-[#2D3748] text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        Todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipo(tipo === TIPO_PUBLICACION.PERDIDA ? '' : TIPO_PUBLICACION.PERDIDA)}
                        className={`flex-1 py-1 rounded-lg font-bold transition ${
                          tipo === TIPO_PUBLICACION.PERDIDA ? 'bg-[#FF7A59] text-white' : 'bg-orange-50 text-[#FF7A59]'
                        }`}
                      >
                        Perdidos
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipo(tipo === TIPO_PUBLICACION.ENCONTRADA ? '' : TIPO_PUBLICACION.ENCONTRADA)}
                        className={`flex-1 py-1 rounded-lg font-bold transition ${
                          tipo === TIPO_PUBLICACION.ENCONTRADA ? 'bg-[#2EC4B6] text-white' : 'bg-teal-50 text-[#2EC4B6]'
                        }`}
                      >
                        Encontrados
                      </button>
                    </div>
                  </div>

                  {/* Botón Aplicar */}
                  <button
                    type="button"
                    onClick={aplicarFiltrosAvanzados}
                    className="w-full py-2 bg-[#FF7A59] text-white rounded-xl text-xs font-bold hover:bg-[#ff6842] transition shadow-xs cursor-pointer mt-1"
                  >
                    Aplicar Filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chips de filtros activos (para verlos y quitarlos rápidamente) */}
          {(cercaniaActiva || especie || tipo || raza) && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {cercaniaActiva && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2EC4B6]/15 text-[#2EC4B6] border border-[#2EC4B6]/30">
                  <span>Radio 5 km</span>
                  <button type="button" onClick={toggleCercania} className="ml-1 cursor-pointer">✕</button>
                </span>
              )}
              {especie && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF7A59]/15 text-[#FF7A59] border border-[#FF7A59]/30">
                  <span>{especie === ESPECIE.PERRO ? '🐶 Perros' : '🐱 Gatos'}</span>
                  <button type="button" onClick={() => setEspecie('')} className="ml-1 cursor-pointer">✕</button>
                </span>
              )}
              {tipo && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-200 text-gray-700">
                  <span>{tipo === TIPO_PUBLICACION.PERDIDA ? 'Perdidos' : 'Encontrados'}</span>
                  <button type="button" onClick={() => setTipo('')} className="ml-1 cursor-pointer">✕</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer limpio: solo "X coincidencias" */}
        <div className="pt-3 border-t border-gray-100 text-xs font-bold text-gray-500">
          {totalResultados} coincidencias
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. RECUADRO DERECHO: BENTO GRID DE RESULTADOS (DE A 5)    */}
      {/* ========================================================= */}
      <section className="fixed right-6 top-6 bottom-6 w-[430px] z-30 bg-white/92 backdrop-blur-2xl rounded-[36px] border border-white/80 shadow-2xl p-5 flex flex-col justify-between transition-all duration-400 ease-out animate-in fade-in slide-in-from-right-8">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-black text-[#2D3748]">
              {cercaniaActiva ? 'Mascotas en el Radar (5 km)' : 'Resultados de Búsqueda'}
            </h3>
            <p className="text-[11px] text-gray-400 font-semibold">
              {totalResultados} coincidencias
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full text-xs font-extrabold text-[#2D3748]">
            <span>Página {paginaActual} de {totalPaginas}</span>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="flex-1 my-3 overflow-hidden">
          {cargando ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
              <div className="w-7 h-7 border-2 border-[#FF7A59] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold">Buscando publicaciones...</p>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center p-4">
              <p className="text-xs font-bold text-red-500 text-center">{error}</p>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
              <span className="text-4xl">🔎</span>
              <p className="text-xs font-bold text-[#2D3748]">No hay mascotas con estos filtros.</p>
              <p className="text-[11px] text-gray-400">Probá ampliando la búsqueda o quitando filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 h-full">
              
              {/* TARJETA 1: HERO */}
              {publicaciones[0] && (() => {
                const p = publicaciones[0];
                const dist = cercaniaActiva && coordsUsuario && p.coordenadas
                  ? calcularDistanciaKm(coordsUsuario.latitud, coordsUsuario.longitud, p.coordenadas.lat, p.coordenadas.lng)
                  : null;

                return (
                  <div
                    onClick={() => onSelectPublicacion && onSelectPublicacion(p.id)}
                    className="col-span-2 bg-gradient-to-br from-orange-50/70 to-white rounded-3xl p-3 border border-[#FF7A59]/25 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-black/5 group-hover:scale-105 transition">
                      {p.imagenUrl ? (
                        <img src={p.imagenUrl} alt={p.nombreMascota || 'Mascota'} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl">{p.especie === ESPECIE.GATO ? '🐱' : '🐶'}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          p.tipo === TIPO_PUBLICACION.PERDIDA ? 'bg-[#FF7A59] text-white' : 'bg-[#2EC4B6] text-white'
                        }`}>
                          {p.tipo === TIPO_PUBLICACION.PERDIDA ? 'Perdida' : 'Encontrada'}
                        </span>
                        {dist !== null && (
                          <span className="text-[10px] font-bold text-[#FF7A59]">a {dist.toFixed(1)} km</span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-[#2D3748] mt-1 truncate">
                        {p.nombreMascota || 'Mascota sin nombre'}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {p.raza || 'Raza no especificada'} • {p.barrio || 'Sin zona'}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* TARJETAS 2, 3, 4 y 5: 2x2 MODULARES */}
              {publicaciones.slice(1, 5).map((pub) => {
                const dist = cercaniaActiva && coordsUsuario && pub.coordenadas
                  ? calcularDistanciaKm(coordsUsuario.latitud, coordsUsuario.longitud, pub.coordenadas.lat, pub.coordenadas.lng)
                  : null;

                const esPerdida = pub.tipo === TIPO_PUBLICACION.PERDIDA;

                return (
                  <div
                    key={pub.id}
                    onClick={() => onSelectPublicacion && onSelectPublicacion(pub.id)}
                    className="bg-white rounded-2xl p-2.5 border border-gray-100 shadow-xs hover:border-[#FF7A59]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                        esPerdida ? 'bg-orange-50 text-[#FF7A59]' : 'bg-teal-50 text-[#2EC4B6]'
                      }`}>
                        {esPerdida ? 'Perdido' : 'Encontrado'}
                      </span>
                      <span className="text-sm">{pub.especie === ESPECIE.GATO ? '🐱' : '🐶'}</span>
                    </div>

                    <div className="my-1.5 min-w-0">
                      <h5 className="text-xs font-black text-[#2D3748] truncate group-hover:text-[#FF7A59] transition">
                        {pub.nombreMascota || 'Sin nombre'}
                      </h5>
                      <p className="text-[10px] text-gray-400 font-medium truncate">
                        {pub.barrio || pub.raza || 'Mascota reportada'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 pt-1 border-t border-gray-50">
                      <span>{pub.especie === ESPECIE.GATO ? 'Gato' : 'Perro'}</span>
                      {dist !== null && (
                        <span className="text-[#FF7A59]">{dist.toFixed(1)} km</span>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* Paginador */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 pt-2.5">
            <button
              type="button"
              disabled={paginaActual <= 1}
              onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 disabled:opacity-40 transition cursor-pointer"
            >
              ← Anteriores 5
            </button>
            <span className="text-[11px] font-extrabold text-gray-400 tracking-wider">
              {paginaActual} de {totalPaginas}
            </span>
            <button
              type="button"
              disabled={paginaActual >= totalPaginas}
              onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
              className="px-3 py-1.5 bg-[#FF7A59] text-white rounded-xl text-xs font-bold hover:bg-[#ff6842] disabled:opacity-40 transition cursor-pointer shadow-xs"
            >
              Siguientes 5 →
            </button>
          </div>
        )}

      </section>
    </>
  );
}