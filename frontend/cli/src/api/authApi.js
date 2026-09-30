import axiosClient from './axiosClient';

/**
 * 1. REGISTRO EN SPRING BOOT
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

  // Guardamos una copia local para permitir inicio de sesión inmediato
  const usuarioCreado = response.data?.data || response.data;
  const usuariosGuardados = JSON.parse(localStorage.getItem('resctpet_usuarios_cache') || '[]');
  localStorage.setItem(
    'resctpet_usuarios_cache',
    JSON.stringify([...usuariosGuardados.filter(u => u.email !== payload.email), { ...usuarioCreado, password: payload.password }])
  );

  return response.data;
};

/**
 * 2. LOGIN (Tarjeta 1.2.1)
 * Intenta conectar con /api/usuarios/login; si no existe en el backend, valida contra la cuenta registrada
 */
export const loginUsuario = async ({ email, password }) => {
  const payload = {
    email: email.trim().toLowerCase(),
    password: password
  };

  try {
    const response = await axiosClient.post('/api/usuarios/login', payload);
    return response.data?.data || response.data;
  } catch (error) {
    if (error.response?.status === 404 || !error.response) {
      console.warn('Backend aún no implementó /api/usuarios/login. Usando validación local de respaldo.');

      const usuarios = JSON.parse(localStorage.getItem('resctpet_usuarios_cache') || '[]');
      
      // Permitir también el usuario de prueba creado en AppApplication.java
      if (payload.email === 'test@resctpet.com' && payload.password === '123456') {
        return { id: 1, nombre: 'Usuario', apellido: 'Prueba', email: 'test@resctpet.com' };
      }

      const usuarioEncontrado = usuarios.find(
        (u) => u.email === payload.email && u.password === payload.password
      );

      if (usuarioEncontrado) {
        const { password: _, ...usuarioSinPassword } = usuarioEncontrado;
        return usuarioSinPassword;
      }

      throw new Error('Credenciales inválidas. Verificá tu correo y contraseña.');
    }

    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

export default {
  registrarUsuario,
  loginUsuario
};