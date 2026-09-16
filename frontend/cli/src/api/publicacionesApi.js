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
 */
export const getPublicacionPorId = async (id) => {
  const response = await axiosClient.get(`/api/publicaciones/${id}`);
  return response.data;
};

/**
 * Busca publicaciones por criterios (Tarjeta 4.1.7)
 * @param {Object} params - { especie, tipoPublicacion, fecha, raza, caracteristicas }
 */
export const buscarPublicaciones = async (params = {}) => {
  const response = await axiosClient.get('/api/publicaciones/buscar', { params });
  return response.data;
};

/**
 * Obtiene publicaciones filtradas por especie (Tarjeta 4.2.7)
 * @param {string} especie - PERRO, GATO, etc.
 */
export const getPublicacionesPorEspecie = async (especie) => {
  const response = await axiosClient.get(`/api/publicaciones/especie/${especie}`);
  return response.data;
};