import axiosClient from './axiosClient';

/**
 * Registra una publicación en Spring Boot
 * @param {Object} publicacionRequest DTO esperado por el backend
 */
export const crearPublicacion = async (publicacionRequest) => {
  const response = await axiosClient.post('/publicaciones', publicacionRequest);
  return response.data;
};


// Obtiene el listado de publicaciones
export const getPublicaciones = async () => {
  const response = await axiosClient.get('/publicaciones');
  return response.data;
};