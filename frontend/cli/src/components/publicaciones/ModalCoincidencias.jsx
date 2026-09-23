import React, { useState } from 'react';
import { solicitarCoincidencias } from '../../api/coincidenciasApi';

export default function ModalCoincidencias({
  isOpen = false,
  publicacionOrigen,
  onClose,
  onIrABusquedaManual,
  onSelectCandidato
}) {
  const [solicitando, setSolicitando] = useState(false);
  const [coincidencias, setCoincidencias] = useState(null); // null: sin solicitar, []: sin resultados, [...]: candidatos
  const [errorVisual, setErrorVisual] = useState(null);

  if (!isOpen || !publicacionOrigen) return null;

  // Criterio 2: Validación de datos mínimos necesarios (coordenadas)
  const tieneCoordenadas = Boolean(publicacionOrigen.latitud && publicacionOrigen.longitud);
  const tipoOpuesto = (publicacionOrigen.tipoPublicacion || '').includes('PERDID') ? 'ENCONTRADA' : 'PERDIDA';
  const radioKm = 5.0;

  // Integración real con Spring Boot: POST /api/coincidencias/solicitar
  const handleSolicitarBusqueda = async () => {
    if (!tieneCoordenadas) return;

    setSolicitando(true);
    setErrorVisual(null);

    try {
      const res = await solicitarCoincidencias({
        publicacionId: publicacionOrigen.id,
        radioKm
      });

      // El backend devuelve { publicacionOrigenId, totalCandidatos, candidatos }
      const listaCandidatos = res?.candidatos || (Array.isArray(res) ? res : []);
      setCoincidencias(listaCandidatos);
    } catch (err) {
      console.error('Error al solicitar búsqueda de coincidencias:', err);

      // Criterio 7: Si el servicio visual falla o no hay suficientes características
      const mensajeBackend = err.response?.data?.message || '';
      if (
        mensajeBackend.toLowerCase().includes('fotografía') ||
        mensajeBackend.toLowerCase().includes('visual') ||
        err.response?.status === 503
      ) {
        setErrorVisual(mensajeBackend || 'El servicio de análisis visual no está disponible en este momento.');
      } else {
        setErrorVisual(mensajeBackend || 'No se pudo procesar la solicitud con el servidor.');
      }
    } finally {
      setSolicitando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-[#F7F4EE] rounded-[32px] border border-white/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 1. Header */}
        <div className="p-5 bg-white border-b border-[#E2ECE4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎯</span>
            <div>
              <h2 className="text-base font-extrabold text-[#2D3748]">
                Búsqueda Inteligente de Coincidencias
              </h2>
              <p className="text-[11px] text-gray-500">
                Comparando casos compatibles en un radio de {radioKm} km
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 2. Resumen de la Publicación Base */}
        <div className="p-4 bg-white/70 border-b border-[#E2ECE4]">
          <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#E2ECE4]">
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden shrink-0 text-2xl">
              {publicacionOrigen.fotografia || publicacionOrigen.imagenUrl ? (
                <img
                  src={
                    (publicacionOrigen.fotografia || publicacionOrigen.imagenUrl).startsWith('data:') ||
                    (publicacionOrigen.fotografia || publicacionOrigen.imagenUrl).startsWith('http')
                      ? publicacionOrigen.fotografia || publicacionOrigen.imagenUrl
                      : `data:image/jpeg;base64,${publicacionOrigen.fotografia || publicacionOrigen.imagenUrl}`
                  }
                  alt="Origen"
                  className="w-full h-full object-cover"
                />
              ) : (
                '🐾'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FF7A59]/15 text-[#FF7A59] uppercase">
                  Caso Base: {publicacionOrigen.tipoPublicacion || 'PERDIDO'}
                </span>
                <span className="text-[11px] font-bold text-gray-600">
                  {publicacionOrigen.especie} • {publicacionOrigen.raza || 'Mestizo'}
                </span>
              </div>
              <h4 className="font-extrabold text-[#2D3748] text-xs truncate">
                {publicacionOrigen.nombre || 'Mascota sin nombre'}
              </h4>
              <p className="text-[10px] text-gray-400">
                Buscando candidatos de tipo: <strong className="text-[#2EC4B6]">{tipoOpuesto}</strong>
              </p>
            </div>
          </div>

          {/* Criterio 2: Validación de datos mínimos */}
          {!tieneCoordenadas && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>Esta publicación no cuenta con ubicación geográfica suficiente para calcular la proximidad.</span>
            </div>
          )}
        </div>

        {/* 3. Cuerpo de Estados */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Estado inicial previo a la solicitud (Criterio 5) */}
          {coincidencias === null && !solicitando && !errorVisual && (
            <div className="text-center py-10">
              <span className="text-4xl block mb-3">📡</span>
              <h3 className="text-sm font-bold text-[#2D3748] mb-1">
                ¿Deseas buscar casos compatibles cercanos?
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                El sistema cruzará la especie, el tipo opuesto y la proximidad geográfica en un radio de {radioKm} km para encontrar posibles coincidencias.
              </p>
              <button
                disabled={!tieneCoordenadas}
                onClick={handleSolicitarBusqueda}
                className="px-6 py-3 rounded-2xl bg-[#FF7A59] text-white text-xs font-bold shadow-md hover:bg-[#ff6842] active:scale-95 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Solicitar Búsqueda de Coincidencias
              </button>
            </div>
          )}

          {/* Estado de Carga / Escaneo */}
          {solicitando && (
            <div className="text-center py-14">
              <div className="w-10 h-10 border-4 border-[#2EC4B6] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <h4 className="text-xs font-bold text-[#2D3748]">Consultando servidor de coincidencias...</h4>
              <p className="text-[11px] text-gray-400 mt-1">Filtrando por especie y radio de {radioKm} km en Spring Boot</p>
            </div>
          )}

          {/* Criterio 7: Fallo visual o servicio no disponible */}
          {errorVisual && (
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
              <span className="text-3xl block mb-2">📷</span>
              <h4 className="text-xs font-bold text-orange-900 mb-1">Análisis visual no disponible</h4>
              <p className="text-[11px] text-orange-700 mb-4">{errorVisual}</p>
              <button
                onClick={onIrABusquedaManual}
                className="px-4 py-2 rounded-xl bg-white border border-orange-300 text-orange-900 text-xs font-bold hover:bg-orange-100 transition cursor-pointer"
              >
                Continuar con Búsqueda Manual
              </button>
            </div>
          )}

          {/* Criterio 6: Sin candidatos dentro del radio */}
          {coincidencias && coincidencias.length === 0 && !solicitando && (
            <div className="text-center py-10">
              <span className="text-4xl block mb-3">🔍</span>
              <h3 className="text-sm font-bold text-[#2D3748] mb-1">
                No se encontraron posibles coincidencias
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
                No existen publicaciones de tipo {tipoOpuesto.toLowerCase()} compatibles dentro del radio de {radioKm} km.
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={onIrABusquedaManual}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  Probar Búsqueda Manual
                </button>
                <button
                  onClick={() => setCoincidencias(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}

          {/* Lista de candidatos compatibles encontrados */}
          {coincidencias && coincidencias.length > 0 && !solicitando && (
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-[#2D3748] mb-2">
                Se encontraron {coincidencias.length} publicaciones compatibles:
              </p>
              {coincidencias.map((candidato) => {
                const fotoCandidato = candidato.fotografia || null;
                return (
                  <div
                    key={candidato.id}
                    onClick={() => onSelectCandidato && onSelectCandidato(candidato.id)}
                    className="p-3 bg-white rounded-2xl border border-[#E2ECE4] hover:border-[#2EC4B6] shadow-xs flex items-center justify-between cursor-pointer transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center overflow-hidden shrink-0 text-xl border border-black/5">
                        {fotoCandidato ? (
                          <img
                            src={
                              fotoCandidato.startsWith('data:') || fotoCandidato.startsWith('http')
                                ? fotoCandidato
                                : `data:image/jpeg;base64,${fotoCandidato}`
                            }
                            alt="Candidato"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          '🐾'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-teal-100 text-[#2EC4B6] uppercase">
                            {candidato.tipoPublicacion || 'ENCONTRADO'}
                          </span>
                          <h4 className="text-xs font-bold text-[#2D3748] group-hover:text-[#2EC4B6] transition">
                            {candidato.nombre || 'Mascota'}
                          </h4>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {candidato.especie} • {candidato.raza || 'Mestizo'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2EC4B6] group-hover:translate-x-1 transition-transform">
                      Ver ficha →
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Footer (Criterio 8) */}
        <div className="p-3 bg-white border-t border-[#E2ECE4] text-center">
          <p className="text-[10px] text-gray-400">
            * La solicitud de búsqueda no modifica automáticamente el estado de la publicación.
          </p>
        </div>

      </div>
    </div>
  );
}