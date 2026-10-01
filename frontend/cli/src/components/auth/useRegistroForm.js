import { useState, useCallback } from 'react';
import { registrarUsuario } from '../../api/authApi';

// Expresión regular compatible con UsuarioService.java del backend
const EMAIL_REGEX = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const INITIAL_STATE = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const useRegistroForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setGeneralError(null);
  }, []);

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.';
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio.';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.';
    } else if (!EMAIL_REGEX.test(formData.email.trim().toLowerCase())) {
      nuevosErrores.email = 'El formato del correo electrónico es inválido.';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (!formData.confirmPassword) {
      nuevosErrores.confirmPassword = 'Por favor, confirmá tu contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    // 1. Validaciones en cliente
    if (!validarFormulario()) {
      setGeneralError('Por favor, corregí los campos marcados en rojo.');
      return;
    }

    try {
      setLoading(true);

      // 2. Envío al endpoint real de Spring Boot
      const respuesta = await registrarUsuario({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password
      });

      // El backend devuelve { status: 201, message: "...", data: { id, nombre, apellido, email } }
      const usuarioCreado = respuesta.data || respuesta;

      // 3. Inicio de sesión automático guardando en localStorage
      localStorage.setItem('user', JSON.stringify(usuarioCreado));

      setFormData(INITIAL_STATE);
      setErrors({});

      if (onSuccess) {
        onSuccess(usuarioCreado);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      // 4. Captura del mensaje exacto del backend (ej: "El correo electrónico ya se encuentra registrado")
      const mensajeBackend =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Ocurrió un error al procesar el registro. Intentalo nuevamente.';

      setGeneralError(mensajeBackend);

      if (mensajeBackend.toLowerCase().includes('correo') || mensajeBackend.toLowerCase().includes('email')) {
        setErrors((prev) => ({
          ...prev,
          email: mensajeBackend
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    generalError,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleChange,
    handleSubmit
  };
};