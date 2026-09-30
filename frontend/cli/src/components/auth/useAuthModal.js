import { useState, useCallback } from 'react';
import { registrarUsuario, loginUsuario } from '../../api/authApi';

const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const useAuthModal = ({ onSuccess, onClose }) => {
  const [tabActual, setTabActual] = useState('registro'); // 'registro' | 'login'
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const cambiarTab = (nuevoTab) => {
    setTabActual(nuevoTab);
    setErrors({});
    setGeneralError(null);
  };

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setGeneralError(null);
  }, []);

  // Validaciones de cliente
  const validar = () => {
    const nuevosErrores = {};

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!EMAIL_REGEX.test(formData.email.trim().toLowerCase())) {
      nuevosErrores.email = 'El formato del correo es inválido.';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    // Validaciones exclusivas de la pestaña Registro
    if (tabActual === 'registro') {
      if (!formData.nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es obligatorio.';
      }
      if (!formData.apellido.trim()) {
        nuevosErrores.apellido = 'El apellido es obligatorio.';
      }
      if (!formData.confirmPassword) {
        nuevosErrores.confirmPassword = 'Por favor, confirmá tu contraseña.';
      } else if (formData.password !== formData.confirmPassword) {
        nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';
      }
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validar()) {
      setGeneralError('Por favor, revisá los campos obligatorios marcados en rojo.');
      return;
    }

    try {
      setLoading(true);

      if (tabActual === 'registro') {
        // 1. REGISTRO EN BACKEND
        const res = await registrarUsuario({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password
        });

        const usuarioCreado = res.data || res;
        // Se guarda en sesión de navegador
        localStorage.setItem('user', JSON.stringify(usuarioCreado));

        if (onSuccess) onSuccess(usuarioCreado, '¡Registro exitoso! Ya podés usar tu cuenta.');
        if (onClose) onClose();

      } else {
        // 2. INICIO DE SESIÓN
        const usuarioLogueado = await loginUsuario({
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem('user', JSON.stringify(usuarioLogueado));

        if (onSuccess) onSuccess(usuarioLogueado, `¡Hola de nuevo, ${usuarioLogueado.nombre}!`);
        if (onClose) onClose();
      }

    } catch (err) {
      // Captura el mensaje del backend (ej: "El correo electrónico ya se encuentra registrado")
      const msg = err.response?.data?.message || err.message || 'Error al procesar la solicitud.';
      setGeneralError(msg);

      if (msg.toLowerCase().includes('correo') || msg.toLowerCase().includes('email')) {
        setErrors((prev) => ({ ...prev, email: msg }));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    tabActual,
    cambiarTab,
    formData,
    errors,
    generalError,
    loading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit
  };
};