import { useState, useEffect, useCallback } from 'react';
import { buscarPublicaciones } from '../../api/publicacionesApi';

export const useBusquedaPublicaciones = () => {
  // Filtros de texto, especie, tipo y raza
  const [termino, setTermino] = useState('');
  const [tipo, setTipo] = useState(''); // '' (todos), 'PERDIDA', 'ENCONTRADA'
  const [especie, setEspecie] = useState(''); // '' (todas), 'PERRO', 'GATO'
  const [raza, setRaza] = useState('');

  // Filtro de Cercanía Geográfica (Requisitos: 5 km inicial)
  const [cercaniaActiva, setCercaniaActiva] = useState(false);
  const [coordsUsuario, setCoordsUsuario] = useState(null); // { latitud, longitud }
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState(null);
  const radioKm = 5.0;

  // Datos y Estados del backend
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Paginación en bloques de 4 tarjetas
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 4;

  // Consulta combinada a Spring Boot: GET /api/publicaciones/buscar
  const ejecutarBusqueda = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const params = {};
      if (tipo) params.tipoPublicacion = tipo;
      if (especie) params.especie = especie;
      if (raza) params.raza = raza;
      if (termino.trim()) params.caracteristicas = termino.trim();

      // Integración geográfica: envía coordenadas y radio al backend si está activo
      if (cercaniaActiva && coordsUsuario) {
        params.latitud = coordsUsuario.latitud;
        params.longitud = coordsUsuario.longitud;
        params.radioKm = radioKm;
      }

            const res = await buscarPublicaciones(params);
      // Extrae la lista desde res.contenido (paginado de Spring Boot) o res.data
      const lista = Array.isArray(res) ? res : (res?.contenido || res?.data || []);
      setPublicaciones(lista);
      setPublicaciones(lista);
      setPaginaActual(1);
    } catch (err) {
      console.error('Error al consultar el backend:', err);
      setError('No se pudo conectar con el servidor.');
      setPublicaciones([]);
    } finally {
      setCargando(false);
    }
  }, [tipo, especie, raza, termino, cercaniaActiva, coordsUsuario]);

  // Disparador de geolocalización del navegador
  const toggleCercania = useCallback(() => {
    if (cercaniaActiva) {
      // Si ya estaba activo, lo desactivamos y limpiamos coordenadas
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
        let mensaje = 'No se pudo obtener tu ubicación actual.';
        if (err.code === 1) mensaje = 'Permiso de ubicación denegado por el navegador.';
        setErrorUbicacion(mensaje);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [cercaniaActiva]);

  // Se ejecuta automáticamente al cambiar cualquier filtro reactivo
  useEffect(() => {
    ejecutarBusqueda();
  }, [tipo, especie, raza, cercaniaActiva, coordsUsuario]);

  // Paginación
  const totalPaginas = Math.ceil(publicaciones.length / itemsPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const publicacionesVisibles = publicaciones.slice(indexInicio, indexInicio + itemsPorPagina);

  return {
    // Filtros generales
    termino,
    setTermino,
    tipo,
    setTipo,
    especie,
    setEspecie,
    raza,
    setRaza,
    // Filtro de cercanía geográfica
    cercaniaActiva,
    radioKm,
    toggleCercania,
    cargandoUbicacion,
    errorUbicacion,
    // Resultados y estados
    publicaciones: publicacionesVisibles,
    totalResultados: publicaciones.length,
    cargando,
    error,
    ejecutarBusqueda,
    // Paginación
    paginaActual,
    totalPaginas,
    setPaginaActual
  };
};