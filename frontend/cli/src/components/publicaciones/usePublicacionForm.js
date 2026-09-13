import { useState, useCallback } from 'react';
import { crearPublicacionPerdida, crearPublicacionEncontrada } from '../../api/publicacionesApi';
import {
  TIPO_PUBLICACION,
  ESPECIE,
  SEXO,
  TAMANO,
  EDAD
} from '../../constants/mascotas';

const INITIAL_STATE = {
  tipo: TIPO_PUBLICACION.PERDIDA,
  nombre: '',
  especie: ESPECIE.PERRO,
  raza: 'MESTIZO',
  edad: EDAD.DESCONOCIDA,
  sexo: SEXO.MACHO,
  tamano: TAMANO.MEDIANO,
  estadoRetencion: '',
  ubicacion: '',
  caracteristicas: '',
  nombreFoto: 'mascota.jpg',
  fotoBase64: null
};

export const usePublicacionForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => {
      // Si cambia especie, resetea la raza a 'MESTIZO'
      if (field === 'especie') {
        return { ...prev, especie: value, raza: 'MESTIZO' };
      }
      if (field === 'tipo') {
        return {
          ...prev,
          tipo: value,
          sexo: value === TIPO_PUBLICACION.PERDIDA && prev.sexo === SEXO.DESCONOCIDO
            ? SEXO.MACHO
            : prev.sexo
        };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleFileChange = useCallback((file) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Formato inválido. Solo se admiten archivos PNG o JPG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La foto no puede superar los 5MB.');
      return;
    }

    setError(null);
    setPreviewUrl(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        nombreFoto: file.name || 'mascota.jpg',
        fotoBase64: reader.result
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, fotoBase64: null, nombreFoto: 'mascota.jpg' }));
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación según tipo
    if (formData.tipo === TIPO_PUBLICACION.PERDIDA && !formData.nombre.trim()) {
      setError('Por favor, ingresá el nombre de la mascota.');
      return;
    }

    if (!formData.caracteristicas.trim() && !formData.ubicacion.trim()) {
      setError('Por favor, ingresá características o la zona de la mascota.');
      return;
    }

    try {
      setLoading(true);

      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : 1;

      // Armado de texto de características (máx 500 caracteres)
      let textoCaracteristicas = formData.caracteristicas.trim();
      if (formData.nombre.trim()) {
        textoCaracteristicas = `Nombre: ${formData.nombre.trim()}. ${textoCaracteristicas}`;
      }
      if (formData.ubicacion.trim()) {
        textoCaracteristicas = `${textoCaracteristicas} [Zona: ${formData.ubicacion.trim()}]`;
      }
      if (formData.estadoRetencion.trim()) {
        textoCaracteristicas = `${textoCaracteristicas} [Retención: ${formData.estadoRetencion.trim()}]`;
      }
      if (textoCaracteristicas.length > 500) {
        textoCaracteristicas = textoCaracteristicas.substring(0, 500);
      }

      // Fecha automática en formato YYYY-MM-DD
      const fechaAutomatica = new Date().toISOString().slice(0, 10);

      // Coordenadas hardcodeadas de referencia
      const latitudHardcodeada = -42.7692;
      const longitudHardcodeada = -65.0385;

      const payload = {
        tipoPublicacion: formData.tipo,
        especie: formData.especie,
        raza: formData.raza || 'MESTIZO',
        edad: formData.edad || 'DESCONOCIDA',
        fecha: fechaAutomatica,
        caracteristicas: textoCaracteristicas || 'Mascota reportada',
        fotografia: formData.nombreFoto || 'mascota.jpg',
        latitud: latitudHardcodeada,
        longitud: longitudHardcodeada,
        usuarioId: userId
      };

      // Despacho al endpoint específico según el formulario activo
      if (formData.tipo === TIPO_PUBLICACION.ENCONTRADA) {
        await crearPublicacionEncontrada(payload);
      } else {
        await crearPublicacionPerdida(payload);
      }

      setFormData(INITIAL_STATE);
      handleRemovePhoto();

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Error al procesar la publicación con el servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    previewUrl,
    loading,
    error,
    handleChange,
    handleFileChange,
    handleRemovePhoto,
    handleSubmit
  };
};