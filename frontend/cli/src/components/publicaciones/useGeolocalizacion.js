import { useState, useCallback } from 'react';

export const useGeolocalizacion = () => {
  const [coordenadas, setCoordenadas] = useState(null); // { latitud, longitud }
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerUbicacion = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada por tu navegador.');
      return Promise.reject('No soportado');
    }

    setCargando(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          const coords = {
            latitud: posicion.coords.latitude,
            longitud: posicion.coords.longitude
          };
          setCoordenadas(coords);
          setCargando(false);
          resolve(coords);
        },
        (err) => {
          setCargando(false);
          let mensaje = 'No se pudo obtener tu ubicación actual.';
          if (err.code === 1) mensaje = 'Permiso de ubicación denegado por el usuario.';
          setError(mensaje);
          reject(mensaje);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  const limpiarUbicacion = useCallback(() => {
    setCoordenadas(null);
    setError(null);
  }, []);

  return {
    coordenadas,
    cargando,
    error,
    obtenerUbicacion,
    limpiarUbicacion
  };
};