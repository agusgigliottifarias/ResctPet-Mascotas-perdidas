import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buscarPublicaciones } from '../../api/publicacionesApi';
import { TIPO_PUBLICACION, ESPECIE } from '../../constants/mascotas';

// Coordenadas oficiales de Puerto Madryn
const PUERTO_MADRYN = [-42.7692, -65.0385];

// Pines circulares temáticos de Figma con tipografía Outfit
const crearPinMascota = (tipo, especie) => {
  const esPerdida = tipo === TIPO_PUBLICACION.PERDIDA;
  const colorFondo = esPerdida ? '#FF7A59' : '#2EC4B6';
  const emoji = especie === ESPECIE.GATO ? '🐱' : '🐶';

  return L.divIcon({
    className: 'bg-transparent',
    html: `
      <div style="
        width: 42px;
        height: 42px;
        background-color: ${colorFondo};
        border: 3.5px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 10px 22px rgba(0,0,0,0.22);
        cursor: pointer;
        transition: transform 0.15s ease-out;
      "
      onmouseover="this.style.transform='scale(1.2) translateY(-4px)'"
      onmouseout="this.style.transform='scale(1)'"
      >
        ${emoji}
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -24]
  });
};

// 1. SOLUCIÓN AL ESPACIO GRIS: Detecta cambios de tamaño al instante y rellena todo el mapa
function ControladorTamanoMapa() {
  const map = useMap();

  useEffect(() => {
    // Redimensionar al montar
    map.invalidateSize();
    const timer = setTimeout(() => map.invalidateSize(), 200);

    const container = map.getContainer();
    if (!container) return;

    // Observador continuo de tamaño (cuando se abre/cierra la búsqueda o se redimensiona la ventana)
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

// 2. Centrado automático en GPS o Madryn
function CentradorAutomatico({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length === 2) {
      map.setView(coords, 14, { animate: true });
    }
  }, [coords, map]);
  return null;
}

export default function MapaPrincipal({
  refrescoKey = 0,
  onSelectPublicacion
}) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [centroActual, setCentroActual] = useState(PUERTO_MADRYN);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCentroActual([pos.coords.latitude, pos.coords.longitude]),
        () => setCentroActual(PUERTO_MADRYN),
        { timeout: 5000 }
      );
    }
  }, []);

  useEffect(() => {
    const cargarMarcadores = async () => {
      try {
        setCargando(true);
        const data = await buscarPublicaciones();
        const lista = Array.isArray(data) ? data : data?.content || [];
        
        const conCoordenadas = lista.filter(
          (p) => p.latitud !== null && p.longitud !== null && !isNaN(p.latitud) && !isNaN(p.longitud)
        );

        if (conCoordenadas.length === 0) {
          setPublicaciones([
            {
              id: 'madryn-1',
              tipoPublicacion: TIPO_PUBLICACION.PERDIDA,
              especie: ESPECIE.PERRO,
              raza: 'Golden Retriever',
              nombre: 'Rocco',
              barrio: 'Costanera / Muelle Luis Piedrabuena',
              caracteristicas: 'Visto por última vez cerca del muelle con collar rojo.',
              latitud: -42.7635,
              longitud: -65.0320
            },
            {
              id: 'madryn-2',
              tipoPublicacion: TIPO_PUBLICACION.ENCONTRADA,
              especie: ESPECIE.GATO,
              raza: 'Siamés',
              nombre: 'Mimi',
              barrio: 'Plaza San Martín (Centro)',
              caracteristicas: 'Encontrada jugando cerca de los bancos de la plaza.',
              latitud: -42.7675,
              longitud: -65.0375
            },
            {
              id: 'madryn-3',
              tipoPublicacion: TIPO_PUBLICACION.PERDIDA,
              especie: ESPECIE.PERRO,
              raza: 'Bulldog Francés',
              nombre: 'Thor',
              barrio: 'Punta Cuevas / Playa Kaiser',
              caracteristicas: 'Perdido en la zona del monumento Tehuelche.',
              latitud: -42.7850,
              longitud: -65.0110
            },
            {
              id: 'madryn-4',
              tipoPublicacion: TIPO_PUBLICACION.ENCONTRADA,
              especie: ESPECIE.PERRO,
              raza: 'Mestizo',
              nombre: 'Luna',
              barrio: 'Barrio Sur',
              caracteristicas: 'Perrita tranquila con pechera verde.',
              latitud: -42.7750,
              longitud: -65.0420
            }
          ]);
        } else {
          setPublicaciones(conCoordenadas);
        }
      } catch (err) {
        console.warn("Aviso: backend no disponible, usando pines locales de Madryn", err);
      } finally {
        setCargando(false);
      }
    };

    cargarMarcadores();
  }, [refrescoKey]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-[#F7F4EE] [&_.leaflet-tile]:sepia-[0.22] [&_.leaflet-tile]:saturate-[0.62] [&_.leaflet-tile]:contrast-[0.92] [&_.leaflet-tile]:brightness-[1.03]">
      
      {/* Forzar tipografía de tu página (Outfit & Inter) y fondo beige en Leaflet */}
      <style>{`
        .leaflet-container {
          background-color: #F7F4EE !important;
          font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 20px !important;
          font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif !important;
          box-shadow: 0 16px 36px rgba(45, 55, 72, 0.16) !important;
        }
        .leaflet-popup-content {
          margin: 14px 16px !important;
          line-height: 1.4 !important;
        }
      `}</style>

      <MapContainer
        center={centroActual}
        zoom={14}
        zoomControl={false}
        className="w-full h-full"
      >
        {/* Controlador que elimina los espacios grises y auto-redimensiona */}
        <ControladorTamanoMapa />
        <CentradorAutomatico coords={centroActual} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          keepBuffer={8}
          updateWhenZooming={false}
          updateWhenIdle={true}
        />

        {publicaciones.map((pub) => {
          const esPerdida = pub.tipoPublicacion === TIPO_PUBLICACION.PERDIDA;
          const colorHex = esPerdida ? '#FF7A59' : '#2EC4B6';
          const label = esPerdida ? 'Perdida' : 'Encontrada';

          return (
            <Marker
              key={pub.id}
              position={[pub.latitud, pub.longitud]}
              icon={crearPinMascota(pub.tipoPublicacion, pub.especie)}
            >
              <Popup>
                <div className="space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px] font-black uppercase text-white px-2.5 py-0.5 rounded-full tracking-wider"
                      style={{ backgroundColor: colorHex }}
                    >
                      {label}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">
                      {pub.especie === ESPECIE.GATO ? 'Gato' : 'Perro'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-[#2D3748] m-0 leading-tight">
                      {pub.nombre || pub.nombreMascota || 'Mascota reportada'}
                    </h4>
                    <p className="text-xs text-gray-500 m-0 mt-0.5 font-medium">
                      {pub.raza || 'Raza no especificada'} {pub.barrio ? `• ${pub.barrio}` : ''}
                    </p>
                    {pub.caracteristicas && (
                      <p className="text-[11px] text-gray-600 mt-1 line-clamp-2 italic bg-[#F7F4EE]/80 p-1.5 rounded-lg">
                        "{pub.caracteristicas}"
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPublicacion && onSelectPublicacion(pub.id)}
                    className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer hover:opacity-90 transition active:scale-95 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: colorHex }}
                  >
                    <span>Ver Detalle Completo</span>
                    <span>→</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}