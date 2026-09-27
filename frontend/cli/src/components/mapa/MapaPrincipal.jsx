import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buscarPublicaciones } from '../../api/publicacionesApi';
import { TIPO_PUBLICACION, ESPECIE } from '../../constants/mascotas';

const PUERTO_MADRYN = [-42.7692, -65.0385];

// Pines circulares con colores de Figma y animación hover
const crearPinMascota = (tipo, especie) => {
  const esPerdida = String(tipo).toUpperCase().includes('PERDID');
  const colorFondo = esPerdida ? '#FF7A59' : '#2EC4B6';
  
  // Icono SVG vectorial de huellita
  const svgHuella = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
      <path d="M12 14c-1.66 0-3 1.34-3 3 0 1.3.84 2.4 2 2.82V21a1 1 0 1 0 2 0v-1.18c1.16-.42 2-1.52 2-2.82 0-1.66-1.34-3-3-3zm-5.5-2c1.38 0 2.5-1.12 2.5-2.5S7.88 7 6.5 7 4 8.12 4 9.5 5.12 12 6.5 12zm11 0c1.38 0 2.5-1.12 2.5-2.5S18.88 7 17.5 7 15 8.12 15 9.5s1.12 2.5 2.5 2.5zM12 10.5c1.38 0 2.5-1.12 2.5-2.5S13.38 5.5 12 5.5s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    className: 'bg-transparent',
    html: `
      <div style="
        width: 44px;
        height: 44px;
        background-color: ${colorFondo};
        border: 3.5px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 24px rgba(0,0,0,0.28);
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      "
      onmouseover="this.style.transform='scale(1.22) translateY(-4px)'"
      onmouseout="this.style.transform='scale(1)'"
      >
        ${svgHuella}
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
};

function ControladorTamanoMapa() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => map.invalidateSize(), 200);

    const container = map.getContainer();
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

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
      let listaApi = [];
      try {
        const data = await buscarPublicaciones();
        listaApi = Array.isArray(data) ? data : data?.content || [];
      } catch (err) {
        console.warn("Aviso backend al cargar mapa:", err);
      }

      // Leemos publicaciones guardadas localmente
      const locales = JSON.parse(localStorage.getItem('resctpet_publicaciones') || '[]');
      
      // Combinamos locales primero y sumamos las del backend sin duplicar IDs
      const combinadas = [...locales, ...listaApi.filter(p => !locales.some(l => String(l.id) === String(p.id)))];

      // Aseguramos coordenadas numéricas para cada publicación
      const conCoordenadas = combinadas.map((p, idx) => {
        let lat = Number(p.latitud);
        let lng = Number(p.longitud);

        if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
          lat = PUERTO_MADRYN[0] + (idx * 0.003 - 0.006);
          lng = PUERTO_MADRYN[1] + (idx * 0.003 - 0.006);
        }

        return { ...p, latitud: lat, longitud: lng };
      });

      setPublicaciones(conCoordenadas);
    };

    cargarMarcadores();
  }, [refrescoKey]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 bg-[#F7F4EE] [&_.leaflet-tile]:sepia-[0.22] [&_.leaflet-tile]:saturate-[0.62] [&_.leaflet-tile]:contrast-[0.92] [&_.leaflet-tile]:brightness-[1.03]">
      <style>{`
        .leaflet-container {
          background-color: #F7F4EE !important;
          font-family: 'Outfit', 'Inter', system-ui, -apple-system, sans-serif !important;
        }
        /* Elimina el recuadro blanco por defecto de Leaflet para usar nuestra tarjeta limpia */
        .leaflet-tooltip.custom-pet-tooltip {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-tooltip-top:before,
        .leaflet-tooltip-bottom:before,
        .leaflet-tooltip-left:before,
        .leaflet-tooltip-right:before {
          display: none !important;
        }
      `}</style>

      <MapContainer
        center={centroActual}
        zoom={14}
        zoomControl={false}
        className="w-full h-full"
      >
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
          const tipoFinal = pub.tipoPublicacion || pub.tipo;
          const esPerdida = String(tipoFinal).toUpperCase().includes('PERDID');
          const colorHex = esPerdida ? '#FF7A59' : '#2EC4B6';
          const label = esPerdida ? 'Perdida' : 'Encontrada';

          return (
            <Marker
              key={pub.id}
              position={[pub.latitud, pub.longitud]}
              icon={crearPinMascota(tipoFinal, pub.especie)}
              eventHandlers={{
                // Al hacer clic se despliega el lateral con la información completa
                click: () => {
                  if (onSelectPublicacion) onSelectPublicacion(pub.id);
                }
              }}
            >
              {/* Tooltip: solo aparece mientras el cursor esté posado sobre el pin */}
              <Tooltip
                direction="top"
                offset={[0, -24]}
                opacity={1}
                className="custom-pet-tooltip"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] border border-white/80 min-w-[200px] pointer-events-none select-none animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <span 
                      className="text-[9px] font-black uppercase text-white px-2 py-0.5 rounded-full tracking-wider shadow-xs"
                      style={{ backgroundColor: colorHex }}
                    >
                      {label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {pub.especie === ESPECIE.GATO ? 'Gato' : 'Perro'}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#2D3748] m-0 leading-tight">
                    {pub.nombre || pub.nombreMascota || 'Mascota reportada'}
                  </h4>
                  <p className="text-[11px] text-gray-500 m-0 mt-0.5 font-medium leading-snug">
                    {pub.raza || 'Raza no especificada'}
                    {pub.barrio ? ` • ${pub.barrio}` : ''}
                  </p>

                  <div className="mt-2 text-[10px] font-bold text-gray-400 flex items-center justify-between border-t border-gray-100 pt-1.5">
                    <span>Click para abrir detalle</span>
                    <span style={{ color: colorHex }}>→</span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}