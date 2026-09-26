import React, { useState, useEffect } from 'react';
import { getPublicacionPorId } from '../../api/publicacionesApi';
import ModalCoincidencias from './ModalCoincidencias';

export default function DetallePublicacion({
  publicacionId,
  publicacion: publicacionProp,
  onClose,
  onNotificarAvistamiento,
  onContactar,
  onIrABusquedaManual,
  onSelectCandidato
}) {
  const [data, setData] = useState(publicacionProp || null);
  const [cargando, setCargando] = useState(Boolean(publicacionId && !publicacionProp));
  const [error, setError] = useState(null);
  
  // Estado para el modal de coincidencias
  const [isCoincidenciasOpen, setIsCoincidenciasOpen] = useState(false);

  useEffect(() => {
    if (!publicacionId) {
      if (publicacionProp) setData(publicacionProp);
      return;
    }

    let isMounted = true;
    const fetchPublicacion = async () => {
      setCargando(true);
      setError(null);
      try {
        const res = await getPublicacionPorId(publicacionId);
        if (isMounted) {
          setData(res);
        }
      } catch (err) {
        console.error('Error al obtener la publicación del backend:', err);
        if (isMounted) {
          setError('No se pudo cargar la información de la publicación.');
        }
      } finally {
        if (isMounted) setCargando(false);
      }
    };

    fetchPublicacion();

    return () => {
      isMounted = false;
    };
  }, [publicacionId, publicacionProp]);

  if (cargando) {
    return (
      <aside className="w-full sm:w-[450px] h-full bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(45,55,72,0.2)] rounded-[32px] p-6 flex flex-col items-center justify-center z-40">
        <div className="w-10 h-10 border-4 border-[#FF7A59] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-[#2D3748]">Consultando publicación...</p>
      </aside>
    );
  }

  if (error || !data) {
    return (
      <aside className="w-full sm:w-[450px] h-full bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(45,55,72,0.2)] rounded-[32px] p-6 flex flex-col items-center justify-center text-center z-40">
        <span className="text-4xl mb-3">⚠️</span>
        <h3 className="text-base font-bold text-[#2D3748] mb-1">Publicación no disponible</h3>
        <p className="text-xs text-gray-500 mb-6">{error || 'No se encontraron datos para este ID.'}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#2D3748] text-xs font-bold transition cursor-pointer"
          >
            Cerrar
          </button>
        )}
      </aside>
    );
  }

  const tipo = (data.tipoPublicacion || data.tipo || 'PERDIDA').toUpperCase();
  const esPerdido = tipo.includes('PERDID');
  const foto = data.fotografia || data.imagenUrl || null;
  const descripcion = data.caracteristicas || data.descripcion || 'Sin descripción adicional.';
  const fechaTexto = data.fecha || (data.fechaCreacion ? new Date(data.fechaCreacion).toLocaleDateString() : 'Reciente');

  return (
    <>
      <aside className="w-full sm:w-[450px] h-full bg-white/95 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_-15px_rgba(45,55,72,0.2)] rounded-[32px] p-6 flex flex-col justify-between overflow-y-auto z-40 transition-all duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-black tracking-wider uppercase border shadow-xs ${
                esPerdido
                  ? 'bg-[#FF7A59]/15 text-[#FF7A59] border-[#FF7A59]/30'
                  : 'bg-[#2EC4B6]/15 text-[#2EC4B6] border-[#2EC4B6]/30'
              }`}
            >
              {esPerdido ? 'PERDIDO' : 'ENCONTRADO'}
            </span>

            {onClose && (
              <button
                onClick={onClose}
                aria-label="Cerrar detalle"
                className="w-8 h-8 rounded-full bg-[#F7F4EE] hover:bg-gray-200 text-[#718096] hover:text-[#2D3748] flex items-center justify-center transition-colors cursor-pointer text-sm font-bold shadow-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Foto */}
          <div
            className={`relative w-full h-52 rounded-2xl flex items-center justify-center overflow-hidden border border-black/5 shadow-inner mb-4 transition-colors ${
              esPerdido ? 'bg-[#FFF2ED]' : 'bg-[#EBF9F8]'
            }`}
          >
            {foto ? (
              <img
                src={foto.startsWith('data:') || foto.startsWith('http') ? foto : `data:image/jpeg;base64,${foto}`}
                alt={data.nombre || 'Mascota'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-7xl select-none filter drop-shadow-sm opacity-80 transition-transform duration-300 hover:scale-110">
                  🐾
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-3.5 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#2D3748] shadow-sm border border-black/5">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  esPerdido ? 'bg-[#FF7A59]' : 'bg-[#2EC4B6]'
                }`}
              ></span>
              <span>{fechaTexto}</span>
            </div>
          </div>

          {/* Título */}
          <div className="mb-4">
            <h2 className="text-2xl font-black text-[#2D3748] tracking-tight leading-none mb-1">
              {data.nombre || (esPerdido ? 'Mascota perdida' : 'Mascota encontrada')}
            </h2>
            <p className="text-xs font-bold text-[#718096]">
              {data.especie || 'Mascota'} • {data.raza || 'Mestizo'}
            </p>
          </div>

          {/* Grid de Atributos */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-xl bg-[#F7F4EE]/90 p-2.5 border border-black/5 text-center">
              <span className="block text-[9px] font-black tracking-wider text-[#A0AEC0] uppercase mb-0.5">
                ESPECIE
              </span>
              <span className="text-xs font-black text-[#2D3748]">
                {data.especie || 'Desconocida'}
              </span>
            </div>

            <div className="rounded-xl bg-[#F7F4EE]/90 p-2.5 border border-black/5 text-center">
              <span className="block text-[9px] font-black tracking-wider text-[#A0AEC0] uppercase mb-0.5">
                EDAD
              </span>
              <span className="text-xs font-black text-[#2D3748]">
                {data.edad || 'Aproximada'}
              </span>
            </div>

            <div className="rounded-xl bg-[#F7F4EE]/90 p-2.5 border border-black/5 text-center">
              <span className="block text-[9px] font-black tracking-wider text-[#A0AEC0] uppercase mb-0.5">
                REPORTE
              </span>
              <span className="text-xs font-black text-[#2D3748]">
                #{data.id || '1'}
              </span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="mb-4">
            <span className="block text-[10px] font-black tracking-wider text-[#718096] uppercase mb-1.5">
              UBICACIÓN APROXIMADA
            </span>
            <div className="rounded-xl bg-[#F7F4EE]/90 p-3 border border-black/5 flex items-start gap-3 shadow-xs">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  esPerdido ? 'bg-[#FF7A59]/15 text-[#FF7A59]' : 'bg-[#2EC4B6]/15 text-[#2EC4B6]'
                }`}
              >
                📍
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#2D3748] leading-tight">
                  {data.caracteristicas?.match(/\[Zona:\s*([^\]]+)\]/)?.[1] ||
                   data.ubicacion ||
                   'Ubicación registrada en mapa'}
                </h3>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="mb-4">
            <span className="block text-xs font-bold text-[#2D3748] mb-1">
              Características
            </span>
            <p className="text-xs text-[#718096] leading-relaxed font-medium">
              {descripcion}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2 pt-2">
          {/* Criterio 1 y 5: Botón para solicitar coincidencias a demanda */}
          <button
            onClick={() => setIsCoincidenciasOpen(true)}
            className="w-full py-3 rounded-xl bg-white border-2 border-[#FF7A59] text-[#FF7A59] text-xs font-bold hover:bg-[#FF7A59]/10 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
          >
            <span>🎯</span>
            <span>Buscar Coincidencias</span>
          </button>

          <button
            onClick={() => onNotificarAvistamiento && onNotificarAvistamiento(data)}
            className="w-full py-3 rounded-xl bg-[#FF7A59] text-white text-xs font-bold shadow-[0_6px_18px_rgba(255,122,89,0.3)] hover:bg-[#ff6842] active:scale-[0.98] transition cursor-pointer"
          >
            Notificar Avistamiento
          </button>
          <button
            onClick={() => onContactar && onContactar(data)}
            className="w-full py-3 rounded-xl bg-white border border-[#2EC4B6] text-[#2EC4B6] text-xs font-bold hover:bg-[#2EC4B6]/10 active:scale-[0.98] transition cursor-pointer shadow-xs"
          >
            Contactar
          </button>
        </div>
      </aside>

      {/* Modal de Coincidencias integrado */}
      <ModalCoincidencias
        isOpen={isCoincidenciasOpen}
        publicacionOrigen={data}
        onClose={() => setIsCoincidenciasOpen(false)}
        onIrABusquedaManual={() => {
          setIsCoincidenciasOpen(false);
          if (onIrABusquedaManual) onIrABusquedaManual();
        }}
        onSelectCandidato={(candidatoId) => {
          setIsCoincidenciasOpen(false);
          if (onSelectCandidato) onSelectCandidato(candidatoId);
        }}
      />
    </>
  );
}