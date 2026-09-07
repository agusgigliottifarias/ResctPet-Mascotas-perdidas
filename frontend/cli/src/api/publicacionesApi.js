import axiosClient from './axiosClient';

/**
 * Crea una nueva publicación de mascota en el backend.
 * @param {Object} publicacionData
 * @returns {Promise<Object>}
 */
export const crearPublicacion = async (publicacionData) => {
  const response = await axiosClient.post('/publicaciones', publicacionData);
  return response.data;
};