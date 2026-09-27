import { useState, useEffect, useCallback } from 'react';
import { buscarPublicaciones } from '../../api/publicacionesApi';

export const useBusquedaPublicaciones = ({ refrescoKey = 0 } = {}) => {
  // Filtros de texto, especie, tipo y raza
  const [termino, setTermino] = useState('');
  const [tipo, setTipo] = useState(''); // '' (todos), 'PERDIDA', 'ENCONTRADA'
  const [especie, setEspecie] = useState(''); // '' (todas), 'PERRO', 'GATO'
  const [raza, setRaza] = useState('');

  // Filtro de Cercanía Geográfica (5 km)
  const [cercaniaActiva, setCercaniaActiva] = useState(false);
  const [coordsUsuario, setCoordsUsuario] = useState(null); // { latitud, longitud }
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const radioKm = 5.0;

  // Datos y Estados
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Paginación en bloques de 5 para el Bento Grid
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  const ejecutarBusqueda = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const params = {};
      if (tipo) params.tipoPublicacion = tipo;
      if (especie) params.especie = especie;
      if (raza) params.raza = raza;
      if (termino.trim()) params.caracteristicas = termino.trim();

      if (cercaniaActiva && coordsUsuario) {
        params.latitud = coordsUsuario.latitud;
        params.longitud = coordsUsuario.longitud;
        params.radioKm = radioKm;
      }

      let listaApi = [];
      try {
        const res = await buscarPublicaciones(params);
        listaApi = Array.isArray(res) ? res : (res?.contenido || res?.data || []);
      } catch (e) {
        console.warn('Backend no disponible, usando publicaciones locales:', e);
      }

      // Leemos publicaciones guardadas localmente para ver lo que se publica en vivo
      const locales = JSON.parse(localStorage.getItem('resctpet_publicaciones') || '[]');

      // Filtrado local
      let filtradasLocales = locales;
      if (tipo) filtradasLocales = filtradasLocales.filter(p => (p.tipoPublicacion === tipo || p.tipo === tipo));
      if (especie) filtradasLocales = filtradasLocales.filter(p => p.especie === especie);
      if (raza) filtradasLocales = filtradasLocales.filter(p => p.raza === raza);
      if (termino.trim()) {
        const t = termino.toLowerCase();
        filtradasLocales = filtradasLocales.filter(p =>
          (p.nombre || p.nombreMascota || '').toLowerCase().includes(t) ||
          (p.caracteristicas || '').toLowerCase().includes(t) ||
          (p.barrio || '').toLowerCase().includes(t)
        );
      }

      const combinadas = [...filtradasLocales, ...listaApi.filter(p => !locales.some(l => l.id === p.id))];
      setPublicaciones(combinadas);
      setPaginaActual(1);
    } catch (err) {
      console.error('Error al consultar:', err);
      setPublicaciones([]);
    } finally {
      setCargando(false);
    }
  }, [tipo, especie, raza, termino, cercaniaActiva, coordsUsuario]);

  const toggleCercania = useCallback(() => {
    if (cercaniaActiva) {
      setCercaniaActiva(false);
      setCoordsUsuario(null);
      setErrorUbicacion(null);
      return;
    }

    if (!navigator.geolocation) {
      setErrorUbicacion('Geolocalización no soportada por tu navegador.');
      return;
    }

    setCargandoUbicacion(true);
    setErrorUbicacion(null);

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        const coords = {
          latitud: posicion.coords.latitude,
          longitud: posicion.coords.longitude
        };
        setCoordsUsuario(coords);
        setCercaniaActiva(true);
        setCargandoUbicacion(false);
      },
      (err) => {
        setCargandoUbicacion(false);
        setCercaniaActiva(false);
        setErrorUbicacion('Permiso de ubicación denegado o no disponible.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [cercaniaActiva]);

  useEffect(() => {
    ejecutarBusqueda();
  }, [tipo, especie, raza, cercaniaActiva, coordsUsuario, refrescoKey, ejecutarBusqueda]);

  const totalPaginas = Math.ceil(publicaciones.length / itemsPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const publicacionesVisibles = publicaciones.slice(indexInicio, indexInicio + itemsPorPagina);

  return {
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
    publicaciones: publicacionesVisibles,
    totalResultados: publicaciones.length,
    cargando,
    error,
    ejecutarBusqueda,
    paginaActual,
    totalPaginas,
    setPaginaActual
  };
};