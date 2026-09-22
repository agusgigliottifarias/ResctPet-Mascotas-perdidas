import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Corregir íconos de marcador de Leaflet en Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Captura los clics del usuario en el mapa para mover el pin
function LocationMarker({ position, setPosition, setDireccion, setCargandoDireccion }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      obtenerDireccion(lat, lng, setDireccion, setCargandoDireccion);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Obtener nombre de la calle/zona mediante OpenStreetMap Nominatim
const obtenerDireccion = async (lat, lng, setDireccion, setCargandoDireccion) => {
  if (setCargandoDireccion) setCargandoDireccion(true);
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await res.json();
    if (data && data.display_name) {
      const addr = data.address || {};
      const calle = addr.road || addr.pedestrian || addr.suburb || '';
      const numero = addr.house_number ? ` ${addr.house_number}` : '';
      const barrio = addr.neighbourhood || addr.suburb || addr.city_district || '';
      const ciudad = addr.city || addr.town || addr.village || '';

      let resumen = [calle + numero, barrio, ciudad].filter(Boolean).join(', ');
      if (!resumen) resumen = data.display_name.split(',').slice(0, 3).join(',');
      
      setDireccion(resumen);
    }
  } catch (err) {
    console.error('Error al obtener dirección:', err);
  } finally {
    if (setCargandoDireccion) setCargandoDireccion(false);
  }
};

export default function MapPickerModal({ isOpen, onClose, onConfirm, initialCoords }) {
  const defaultLat = initialCoords?.lat || -42.7692;
  const defaultLng = initialCoords?.lng || -65.0385;

  const [position, setPosition] = useState(
    initialCoords?.lat && initialCoords?.lng ? [initialCoords.lat, initialCoords.lng] : [defaultLat, defaultLng]
  );
  const [direccion, setDireccion] = useState('');
  const [cargandoDireccion, setCargandoDireccion] = useState(false);
  const [cargandoGPS, setCargandoGPS] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialCoords?.lat && initialCoords?.lng) {
        setPosition([initialCoords.lat, initialCoords.lng]);
        obtenerDireccion(initialCoords.lat, initialCoords.lng, setDireccion, setCargandoDireccion);
      } else {
        setPosition([defaultLat, defaultLng]);
        obtenerDireccion(defaultLat, defaultLng, setDireccion, setCargandoDireccion);
      }
    }
  }, [isOpen, initialCoords]);

  const handleUsarUbicacionActual = () => {
    if (!navigator.geolocation) return;
    setCargandoGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        obtenerDireccion(lat, lng, setDireccion, setCargandoDireccion);
        setCargandoGPS(false);
      },
      () => setCargandoGPS(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleConfirmar = () => {
    if (!position) return;
    onConfirm({
      latitud: position[0],
      longitud: position[1],
      direccion: direccion || `Lat: ${position[0].toFixed(4)}, Lng: ${position[1].toFixed(4)}`
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A202C]/50 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-[700px] rounded-[32px] bg-white p-6 shadow-2xl border border-white/80"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-heading text-xl font-black text-[#2D3748]">
                📍 Seleccionar Ubicación en el Mapa
              </h3>
              <p className="text-xs text-[#718096]">
                Haz clic en el mapa para marcar el punto exacto de la mascota.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              type="button"
              onClick={handleUsarUbicacionActual}
              disabled={cargandoGPS}
              className="flex items-center gap-1.5 rounded-xl bg-[#2EC4B6]/10 border border-[#2EC4B6]/30 px-3 py-1.5 text-xs font-bold text-[#2EC4B6] hover:bg-[#2EC4B6]/20 transition-all disabled:opacity-50"
            >
              🧭 {cargandoGPS ? 'Obteniendo mi GPS...' : 'Usar mi ubicación actual'}
            </button>

            {cargandoDireccion && (
              <span className="text-xs text-[#718096] animate-pulse">
                Buscando dirección...
              </span>
            )}
          </div>

          <div className="h-[320px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative z-0">
            <MapContainer
              center={position}
              zoom={14}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker
                position={position}
                setPosition={setPosition}
                setDireccion={setDireccion}
                setCargandoDireccion={setCargandoDireccion}
              />
            </MapContainer>
          </div>

          {direccion && (
            <div className="mt-3 rounded-xl bg-gray-50 p-2.5 text-xs text-[#2D3748] border border-gray-200 font-medium">
              <span className="font-bold text-[#4A5568]">Zona detectada: </span>
              {direccion}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-[#718096] hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmar}
              className="rounded-xl bg-[#2EC4B6] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#28b3a6] active:scale-95 transition-all"
            >
              Confirmar esta ubicación
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}