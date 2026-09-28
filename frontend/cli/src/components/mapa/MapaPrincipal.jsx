import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { buscarPublicaciones } from '../../api/publicacionesApi';
import { TIPO_PUBLICACION, ESPECIE } from '../../constants/mascotas';

const PUERTO_MADRYN = [-42.7692, -65.0385];

// Formatea textos tipo AZUL_RUSO a "Azul Ruso"
const formatearTexto = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/_/g, ' ')
    .split(' ')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};

// Pines circulares con el logo vectorial de Perro o Gato
const crearPinMascota = (tipo, especie) => {
  const esPerdida = String(tipo).toUpperCase().includes('PERDID');
  const colorFondo = esPerdida ? '#FF7A59' : '#2EC4B6';
  const esGato = String(especie || '').toUpperCase().includes('GAT');
  const iconoRuta = esGato ? '/logo-gato.svg' : '/logo-Yira.svg';

  return L.divIcon({
    className: 'bg-transparent',
    html: `
      <div style="
        width: 54px;
        height: 54px;
        background-color: ${colorFondo};
        border: 4px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 12px 28px rgba(0,0,0,0.32);
        cursor: pointer;
        transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
        overflow: hidden;
      "
      onmouseover="this.style.transform='scale(1.26) translateY(-6px)'; this.style.boxShadow='0 18px 36px rgba(0,0,0,0.42)'"
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 12px 28px rgba(0,0,0,0.32)'"
      >
        <img 
          src="${iconoRuta}" 
          alt="${esGato ? 'Gato' : 'Perro'}" 
          style="
            width: 38px;
            height: 38px;
            object-fit: contain;
            pointer-events: none;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.22));
          " 
        />
      </div>
    `,
    iconSize: [54, 54],
    iconAnchor: [27, 27]
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

function CapaMarcadores({ publicaciones, onSelectPublicacion }) {
  const map = useMap();

  return (
    <>
      {publicaciones.map((pub) => {
        const tipoFinal = pub.tipoPublicacion || pub.tipo;
        const esPerdida = String(tipoFinal).toUpperCase().includes('PERDID');
        const colorHex = esPerdida ? '#FF7A59' : '#2EC4B6';
        const label = esPerdida ? 'Perdida' : 'Encontrada';
        const razaFormateada = formatearTexto(pub.raza) || 'Raza no especificada';

        return (
          <Marker
            key={pub.id}
            position={[pub.latitud, pub.longitud]}
            icon={crearPinMascota(tipoFinal, pub.especie)}
            eventHandlers={{
              click: () => {
                map.flyTo([pub.latitud, pub.longitud], 16, {
                  duration: 0.9,
                  easeLinearity: 0.28
                });
                if (onSelectPublicacion) onSelectPublicacion(pub.id);
              }
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -28]}
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
                  {razaFormateada}
                  {pub.barrio ? ` • ${pub.barrio}` : ''}
                </p>

                <div className="mt-2 text-[10px] font-bold text-gray-400 border-t border-gray-100 pt-1.5 text-center">
                  <span>Click para ver en detalle</span>
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
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

      const locales = JSON.parse(localStorage.getItem('resctpet_publicaciones') || '[]');
      const combinadas = [...locales, ...listaApi.filter(p => !locales.some(l => String(l.id) === String(p.id)))];

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

        <CapaMarcadores
          publicaciones={publicaciones}
          onSelectPublicacion={onSelectPublicacion}
        />
      </MapContainer>
    </div>
  );
}