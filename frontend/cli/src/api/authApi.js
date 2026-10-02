import axiosClient from './axiosClient';

/**
 * 1. REGISTRO EN SPRING BOOT (Tarea 1.1)
 * Endpoint: POST /api/usuarios/registro
 */
export const registrarUsuario = async (usuarioData) => {
  const payload = {
    nombre: usuarioData.nombre.trim(),
    apellido: usuarioData.apellido.trim(),
    email: usuarioData.email.trim().toLowerCase(),
    password: usuarioData.password
  };

  const response = await axiosClient.post('/api/usuarios/registro', payload);
  return response.data;
};

/**
 * 2. INICIO DE SESIÓN EN SPRING BOOT (Tarea 1.2.7)
 * Endpoint: POST /api/usuarios/login
 * Payload: { email, password }
 * Retorna: { id, nombre, apellido, email, token }
 */
export const loginUsuario = async ({ email, password }) => {
  const payload = {
    email: email.trim().toLowerCase(),
    password: password
  };

  const response = await axiosClient.post('/api/usuarios/login', payload);
  // El backend responde { status: 200, message: "Autenticación exitosa", data: { id, nombre, apellido, email, token } }
  return response.data?.data || response.data;
};

export default {
  registrarUsuario,
  loginUsuario
};