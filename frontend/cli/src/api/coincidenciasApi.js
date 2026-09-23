import axiosClient from './axiosClient';

/**
 * Solicita al backend la búsqueda de candidatos compatibles (T - 5.1.3 / T - 5.1.4)
 * @param {Object} params - { publicacionId: number, radioKm: number }
 * @returns {Promise<{ publicacionOrigenId: number, totalCandidatos: number, candidatos: Array }>}
 */
export const solicitarCoincidencias = async ({ publicacionId, radioKm = 5.0 }) => {
  const response = await axiosClient.post('/api/coincidencias/solicitar', {
    publicacionId,
    radioKm
  });
  // Desempaqueta el wrapper Response(status, message, data) de Spring Boot
  return response.data?.data ? response.data.data : response.data;
};