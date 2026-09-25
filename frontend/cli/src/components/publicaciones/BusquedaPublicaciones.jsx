import React from 'react';
import { useBusquedaPublicaciones } from './useBusquedaPublicaciones';
import FiltroEspecie from './FiltroEspecie';
import FiltroCercania from './FiltroCercania';
import { TIPO_PUBLICACION, ESPECIE, RAZAS_PERRO, RAZAS_GATO } from '../../constants/mascotas';

// Cálculo Haversine de distancia entre dos coordenadas en km
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
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function BusquedaPublicaciones({
  isOpen = true,
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
    radioKm,
    toggleCercania,
    cargandoUbicacion,
    errorUbicacion,
    publicaciones,
    totalResultados,
    cargando,
    error,
    ejecutarBusqueda,
    paginaActual,
    totalPaginas,
    setPaginaActual
  } = useBusquedaPublicaciones();

  if (!isOpen) return null;

  const opcionesRazas =
    especie === ESPECIE.PERRO
      ? RAZAS_PERRO
      : especie === ESPECIE.GATO
      ? RAZAS_GATO
      : [];

  const publicacionesFiltradas = publicaciones.filter((pub) => {
    if (!especie) return true;
    return pub.especie === especie;
  });

  return (
    <aside className="w-full sm:w-[480px] h-full bg-[#F7F4EE] border-r border-[#E2ECE4] shadow-2xl flex flex-col z-30 transition-all duration-300">
      <div className="p-4 bg-white border-b border-[#E2ECE4] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔍</span>
          <h2 className="text-base font-extrabold text-[#2D3748]">Buscar Mascotas</h2>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {totalResultados}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar panel de búsqueda"
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-4 bg-white/70 backdrop-blur-sm border-b border-[#E2ECE4] space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && ejecutarBusqueda()}
            placeholder="Buscar por color, seña o característica..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF7A59] bg-[#F7F4EE]/60 text-gray-800 placeholder:text-gray-400"
          />
          <button
            onClick={ejecutarBusqueda}
            disabled={cargando}
            className="px-4 py-2 bg-[#FF7A59] text-white rounded-xl text-xs font-bold hover:bg-[#ff6842] active:scale-95 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            Buscar
          </button>
        </div>

        <FiltroCercania
          activo={cercaniaActiva}
          cargando={cargandoUbicacion}
          radioKm={radioKm}
          onToggle={toggleCercania}
          error={errorUbicacion}
        />

        <div>
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
            Especie
          </span>
          <FiltroEspecie
            especieSeleccionada={especie}
            onCambiarEspecie={(nuevaEspecie) => {
              setEspecie(nuevaEspecie);
              setRaza('');
            }}
            disabled={cargando}
          />
        </div>

        <div>
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
            Estado de publicación
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setTipo('')}
              className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                tipo === ''
                  ? 'bg-[#2D3748] text-white shadow-xs'
                  : 'bg-gray-200/80 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() =>
                setTipo(tipo === TIPO_PUBLICACION.PERDIDA ? '' : TIPO_PUBLICACION.PERDIDA)
              }
              className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                tipo === TIPO_PUBLICACION.PERDIDA
                  ? 'bg-[#FF7A59] text-white shadow-xs'
                  : 'bg-orange-100 text-[#FF7A59] hover:bg-orange-200'
              }`}
            >
              🚨 Perdidos
            </button>
            <button
              onClick={() =>
                setTipo(
                  tipo === TIPO_PUBLICACION.ENCONTRADA ? '' : TIPO_PUBLICACION.ENCONTRADA
                )
              }
              className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                tipo === TIPO_PUBLICACION.ENCONTRADA
                  ? 'bg-[#2EC4B6] text-white shadow-xs'
                  : 'bg-teal-100 text-[#2EC4B6] hover:bg-teal-200'
              }`}
            >
              🐾 Encontrados
            </button>
          </div>
        </div>

        {opcionesRazas.length > 0 && (
          <div>
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
              Raza ({especie === ESPECIE.PERRO ? 'Canina' : 'Felina'})
            </span>
            <select
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7A59]"
            >
              <option value="">Todas las razas</option>
              {opcionesRazas.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-8 h-8 border-4 border-[#FF7A59] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-bold text-gray-500">Buscando en el servidor...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-gray-500">
            <span className="text-3xl block mb-2">⚠️</span>
            <p className="text-xs font-semibold text-red-500">{error}</p>
          </div>
        ) : publicacionesFiltradas.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-4xl block mb-2">
              {cercaniaActiva ? '📍' : especie === ESPECIE.GATO ? '🐱' : especie === ESPECIE.PERRO ? '🐶' : '🐾'}
            </span>
            <p className="text-xs font-bold text-gray-600">
              {cercaniaActiva
                ? `No se encontraron publicaciones dentro del radio de ${radioKm} km de tu ubicación`
                : especie
                ? `No se encontraron publicaciones de ${especie.toLowerCase()}s`
                : 'No se encontraron publicaciones'}
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Probá ampliando los filtros o desactivando la cercanía.
            </p>
          </div>
        ) : (
          publicacionesFiltradas.map((pub) => {
            const esPerdido = (pub.tipoPublicacion || '').includes('PERDID');
            const foto = pub.fotografia || null;
            const fechaStr =
              pub.fecha ||
              (pub.fechaCreacion
                ? new Date(pub.fechaCreacion).toLocaleDateString()
                : 'Reciente');

            const distKm =
              cercaniaActiva && coordsUsuario && pub.latitud && pub.longitud
                ? calcularDistanciaKm(
                    coordsUsuario.latitud,
                    coordsUsuario.longitud,
                    pub.latitud,
                    pub.longitud
                  )
                : null;

            return (
              <div
                key={pub.id}
                onClick={() => onSelectPublicacion && onSelectPublicacion(pub.id)}
                className="p-3 bg-white rounded-2xl border border-[#E2ECE4] shadow-xs hover:shadow-md hover:border-[#FF7A59]/40 transition-all cursor-pointer flex gap-3 items-center group"
              >
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-black/5 ${
                    esPerdido ? 'bg-[#FFF2ED]' : 'bg-[#EBF9F8]'
                  }`}
                >
                  {foto && (foto.startsWith('data:') || foto.startsWith('http') || foto.length > 100) ? (
                    <img
                      src={
                        foto.startsWith('data:') || foto.startsWith('http')
                          ? foto
                          : `data:image/jpeg;base64,${foto}`
                      }
                      alt="Mascota"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl select-none opacity-80 group-hover:scale-110 transition-transform">
                      🐾
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        esPerdido
                          ? 'bg-orange-100 text-[#FF7A59]'
                          : 'bg-teal-100 text-[#2EC4B6]'
                      }`}
                    >
                      {esPerdido ? 'PERDIDO' : 'ENCONTRADO'}
                    </span>

                    {distKm !== null && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#2EC4B6]/15 text-[#2EC4B6] border border-[#2EC4B6]/30">
                        📍 {distKm < 1 ? `A ${Math.round(distKm * 1000)} m` : `A ${distKm.toFixed(1)} km`}
                      </span>
                    )}

                    <span className="text-[10px] text-gray-400 truncate">{fechaStr}</span>
                  </div>

                  <h4 className="font-extrabold text-[#2D3748] text-xs truncate group-hover:text-[#FF7A59] transition">
                    {pub.especie || 'Mascota'} • {pub.raza || 'Mestizo'}
                  </h4>

                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {pub.caracteristicas || 'Sin características detalladas'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalResultados > 4 && (
        <div className="p-3 bg-white border-t border-[#E2ECE4] flex items-center justify-between text-xs text-gray-600">
          <span className="font-medium">
            Pág. {paginaActual} de {totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((p) => p - 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition cursor-pointer font-bold"
            >
              Anterior
            </button>
            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((p) => p + 1)}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition cursor-pointer font-bold"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}