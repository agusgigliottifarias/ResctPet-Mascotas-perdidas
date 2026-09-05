import axiosClient from './axiosClient';

/**
 * Envía la publicación al backend. Soporta Multipart si se sube archivo binario.
 * @param {FormData|Object} data 
 */
export const crearPublicacion = async (data) => {
  const isMultipart = data instanceof FormData;
  const response = await axiosClient.post('/publicaciones', data, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : undefined
  });
  return response.data;
};