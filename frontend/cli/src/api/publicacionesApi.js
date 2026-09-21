import axiosClient from './axiosClient';

/**
 * Registra una publicación de Mascota Perdida en Spring Boot
 */
export const crearPublicacionPerdida = async (publicacionRequest) => {
  const response = await axiosClient.post('/api/publicaciones/perdidas', publicacionRequest);
  return response.data;
};

/**
 * Registra una publicación de Mascota Encontrada en Spring Boot
 */
export const crearPublicacionEncontrada = async (publicacionRequest) => {
  const response = await axiosClient.post('/api/publicaciones/encontradas', publicacionRequest);
  return response.data;
};

/**
 * Registra una publicación genérica
 */
export const crearPublicacion = async (publicacionRequest) => {
  const response = await axiosClient.post('/api/publicaciones', publicacionRequest);
  return response.data;
};

/**
 * Consulta una publicación por ID
 * Desenvuelve automáticamente el response de Spring Boot { status, message, data }
 */
export const getPublicacionPorId = async (id) => {
  const response = await axiosClient.get(`/api/publicaciones/${id}`);
  // Si el backend viene envuelto en Response(status, message, data), extraemos data
  return response.data?.data ? response.data.data : response.data;
};

/**
 * Busca publicaciones por criterios (Filtros generales)
 * @param {Object} params - { especie, tipoPublicacion, fecha, raza, caracteristicas }
 */
export const buscarPublicaciones = async (params = {}) => {
  const response = await axiosClient.get('/api/publicaciones/buscar', { params });
  return response.data?.data ? response.data.data : response.data;
};

/**
 * Obtiene publicaciones filtradas por especie
 * @param {string} especie - PERRO, GATO, etc.
 */
export const getPublicacionesPorEspecie = async (especie) => {
  const response = await axiosClient.get(`/api/publicaciones/especie/${especie}`);
  return response.data?.data ? response.data.data : response.data;
};

/**
 * Obtiene publicaciones por cercanía geográfica (para el mapa)
 * @param {Object} coords - { latitud, longitud, radioKm }
 */
export const getPublicacionesPorCercania = async ({ latitud, longitud, radioKm = 5 }) => {
  const response = await axiosClient.get('/api/publicaciones/cercania', {
    params: { latitud, longitud, radioKm }
  });
  return response.data?.data ? response.data.data : response.data;
};