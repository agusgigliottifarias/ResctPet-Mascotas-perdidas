import { useState, useCallback } from 'react';
import { crearPublicacion } from '../../api/publicacionesApi';

export const TIPO_PUBLICACION = {
  PERDIDA: 'PERDIDA',
  ENCONTRADA: 'ENCONTRADA'
};

export const ESPECIE = {
  PERRO: 'PERRO',
  GATO: 'GATO'
};

export const TAMANO = {
  PEQUENO: 'PEQUENO',
  MEDIANO: 'MEDIANO',
  GRANDE: 'GRANDE'
};

export const SEXO = {
  MACHO: 'MACHO',
  HEMBRA: 'HEMBRA',
  DESCONOCIDO: 'DESCONOCIDO'
};

const INITIAL_STATE = {
  tipo: TIPO_PUBLICACION.PERDIDA,
  nombre: '',
  especie: ESPECIE.PERRO,
  sexo: SEXO.MACHO,
  tamano: TAMANO.MEDIANO,
  ubicacion: '',
  coordenadas: { lat: null, lng: null },
  descripcion: '',
  foto: null
};

export const usePublicacionForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = useCallback((file) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Formato inválido. Solo se admiten JPG o PNG.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La foto no puede superar los 5MB.');
      return;
    }

    setError(null);
    setFormData((prev) => ({ ...prev, foto: file }));
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleRemovePhoto = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, foto: null }));
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación de negocio
    if (formData.tipo === TIPO_PUBLICACION.PERDIDA && !formData.nombre.trim()) {
      setError('El nombre o apodo es requerido para mascotas perdidas.');
      return;
    }
    if (!formData.ubicacion.trim()) {
      setError('Debes especificar la última zona o calle vista.');
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append('tipo', formData.tipo);
      payload.append('nombre', formData.nombre);
      payload.append('especie', formData.especie);
      payload.append('sexo', formData.sexo);
      payload.append('tamano', formData.tamano);
      payload.append('ubicacion', formData.ubicacion);
      payload.append('descripcion', formData.descripcion);
      if (formData.foto) {
        payload.append('foto', formData.foto);
      }
      if (formData.coordenadas.lat && formData.coordenadas.lng) {
        payload.append('lat', formData.coordenadas.lat);
        payload.append('lng', formData.coordenadas.lng);
      }

      await crearPublicacion(payload);

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al procesar la publicación. Intente nuevamente.');
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