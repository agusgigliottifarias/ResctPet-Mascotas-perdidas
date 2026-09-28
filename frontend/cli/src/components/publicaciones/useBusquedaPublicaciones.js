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
  const [coordsUsuario, setCoordsUsuario] = useState(null);
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

      // Filtros seleccionados
      if (tipo) params.tipoPublicacion = tipo;
      if (especie) params.especie = especie;
      if (raza) params.raza = raza;

      // El término libre se utiliza para buscar en características
      if (termino.trim()) {
        params.caracteristicas = termino.trim();
      }

      // Filtro de cercanía
      if (cercaniaActiva && coordsUsuario) {
        params.latitud = coordsUsuario.latitud;
        params.longitud = coordsUsuario.longitud;
        params.radioKm = radioKm;
      }

      let listaApi = [];

      try {
        const res = await buscarPublicaciones(params);
        listaApi = Array.isArray(res)
          ? res
          : (res?.contenido || res?.data || []);
      } catch (e) {
        console.warn(
          'Backend no disponible, usando publicaciones locales:',
          e
        );
      }

      // Publicaciones guardadas localmente
      const locales = JSON.parse(
        localStorage.getItem('resctpet_publicaciones') || '[]'
      );

      // -----------------------------
      // FILTRADO LOCAL
      // -----------------------------
      let filtradasLocales = locales;

      // Tipo
      if (tipo) {
        filtradasLocales = filtradasLocales.filter(
          p => (p.tipoPublicacion || p.tipo) === tipo
        );
      }

      // Especie
      if (especie) {
        filtradasLocales = filtradasLocales.filter(
          p => p.especie === especie
        );
      }

      // Raza
      if (raza) {
        filtradasLocales = filtradasLocales.filter(
          p => (p.raza || '').toLowerCase() === raza.toLowerCase()
        );
      }

      // Búsqueda libre de la lupita
      if (termino.trim()) {
        const t = termino.trim().toLowerCase();

        filtradasLocales = filtradasLocales.filter(p => {
          const tipoPublicacion = (
            p.tipoPublicacion ||
            p.tipo ||
            ''
          ).toString().toLowerCase();

          const especiePublicacion = (
            p.especie ||
            ''
          ).toString().toLowerCase();

          const razaPublicacion = (
            p.raza ||
            ''
          ).toString().toLowerCase();

          const caracteristicas = (
            p.caracteristicas ||
            ''
          ).toString().toLowerCase();

          const nombre = (
            p.nombre ||
            p.nombreMascota ||
            ''
          ).toString().toLowerCase();

          const barrio = (
            p.barrio ||
            ''
          ).toString().toLowerCase();

          return (
            tipoPublicacion.includes(t) ||
            especiePublicacion.includes(t) ||
            razaPublicacion.includes(t) ||
            caracteristicas.includes(t) ||
            nombre.includes(t) ||
            barrio.includes(t)
          );
        });
      }

      // Combinar publicaciones locales + backend
      const combinadas = [
        ...filtradasLocales,
        ...listaApi.filter(
          p => !locales.some(l => l.id === p.id)
        )
      ];

      setPublicaciones(combinadas);
      setPaginaActual(1);

    } catch (err) {
      console.error('Error al consultar:', err);
      setPublicaciones([]);
      setError('No se pudieron cargar las publicaciones.');
    } finally {
      setCargando(false);
    }
  }, [
    tipo,
    especie,
    raza,
    termino,
    cercaniaActiva,
    coordsUsuario
  ]);

  // -----------------------------
  // CERCANÍA GEOGRÁFICA
  // -----------------------------
  const toggleCercania = useCallback(() => {
    if (cercaniaActiva) {
      setCercaniaActiva(false);
      setCoordsUsuario(null);
      setErrorUbicacion(null);
      return;
    }

    if (!navigator.geolocation) {
      setErrorUbicacion(
        'Geolocalización no soportada por tu navegador.'
      );
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
      () => {
        setCargandoUbicacion(false);
        setCercaniaActiva(false);
        setErrorUbicacion(
          'Permiso de ubicación denegado o no disponible.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  }, [cercaniaActiva]);

  // -----------------------------
  // BÚSQUEDA AUTOMÁTICA DE FILTROS
  // -----------------------------
  useEffect(() => {
  ejecutarBusqueda();
}, [termino, tipo, especie, raza, cercaniaActiva, coordsUsuario, refrescoKey]);

  // -----------------------------
  // PAGINACIÓN
  // -----------------------------
  const totalPaginas =
    Math.ceil(publicaciones.length / itemsPorPagina) || 1;

  const indexInicio =
    (paginaActual - 1) * itemsPorPagina;

  const publicacionesVisibles =
    publicaciones.slice(
      indexInicio,
      indexInicio + itemsPorPagina
    );

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