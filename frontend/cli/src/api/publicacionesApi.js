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