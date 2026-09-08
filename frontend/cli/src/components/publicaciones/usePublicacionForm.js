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

export const SEXO = {
  MACHO: 'MACHO',
  HEMBRA: 'HEMBRA',
  DESCONOCIDO: 'DESCONOCIDO'
};

export const TAMANO = {
  PEQUENO: 'PEQUENO',
  MEDIANO: 'MEDIANO',
  GRANDE: 'GRANDE'
};

const INITIAL_STATE = {
  tipo: TIPO_PUBLICACION.PERDIDA,
  nombre: '',
  especie: ESPECIE.PERRO,
  sexo: SEXO.MACHO,
  tamano: TAMANO.MEDIANO,
  estadoRetencion: '',
  ubicacion: '',
  caracteristicas: '',
  fotoBase64: null
};

export const usePublicacionForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => {
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
      setFormData((prev) => ({ ...prev, fotoBase64: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePhoto = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFormData((prev) => ({ ...prev, fotoBase64: null }));
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.tipo === TIPO_PUBLICACION.PERDIDA && !formData.nombre.trim()) {
      setError('Por favor, ingresá el nombre de la mascota.');
      return;
    }

    if (!formData.ubicacion.trim()) {
      setError('Debes especificar la ubicación.');
      return;
    }

    try {
      setLoading(true);

      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : 1;

      const tituloFinal = formData.tipo === TIPO_PUBLICACION.PERDIDA
        ? `Perdido: ${formData.nombre.trim()}`
        : `Mascota Encontrada (${formData.especie === ESPECIE.PERRO ? 'Perro' : 'Gato'})`;

      const detallesArray = [`Sexo: ${formData.sexo}`, `Tamaño: ${formData.tamano}`];
      if (formData.tipo === TIPO_PUBLICACION.ENCONTRADA && formData.estadoRetencion.trim()) {
        detallesArray.unshift(`Ubicación actual: ${formData.estadoRetencion.trim()}`);
      }

      const metadataString = `[${detallesArray.join(' | ')}]`;
      const descripcionFinal = formData.caracteristicas.trim()
        ? `${formData.caracteristicas.trim()}\n\n${metadataString}`
        : metadataString;

      const payload = {
        titulo: tituloFinal,
        descripcion: descripcionFinal,
        especie: formData.especie,
        tipo: formData.tipo,
        ubicacion: formData.ubicacion.trim(),
        fotoUrl: formData.fotoBase64 || null,
        usuarioId: userId
      };

      await crearPublicacion(payload);

      setFormData(INITIAL_STATE);
      handleRemovePhoto();

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al procesar la publicación.');
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