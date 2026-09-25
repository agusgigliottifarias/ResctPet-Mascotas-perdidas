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
  latitud: null,
  longitud: null,
  caracteristicas: '',
  nombreFoto: '',
  fotoBase64: null
};

// Geocodificación directa: busca lat/lng a partir del texto ingresado si no abrió el mapa
const buscarCoordenadasPorTexto = async (textoUbicacion) => {
  try {
    const texto = textoUbicacion.trim();

    if (!texto) {
      return null;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        texto
      )}&limit=1&addressdetails=1`
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return null;
    }

    const resultado = data[0];

    if (!resultado.lat || !resultado.lon) {
      return null;
    }

    return {
      latitud: parseFloat(resultado.lat),
      longitud: parseFloat(resultado.lon),
      nombreEncontrado: resultado.display_name
    };
  } catch (err) {
    console.error('Error al geocodificar dirección:', err);
    return null;
  }
};

export const usePublicacionForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => {
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
    setFormData((prev) => ({ ...prev, fotoBase64: null, nombreFoto: '' }));
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fotoBase64) {
  setError('La fotografía de la mascota es obligatoria.');
  return;
}

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

      let latitudFinal = formData.latitud;
let longitudFinal = formData.longitud;

if (formData.ubicacion.trim()) {
  const coords = await buscarCoordenadasPorTexto(
    formData.ubicacion.trim()
  );

  if (coords) {
    latitudFinal = coords.latitud;
    longitudFinal = coords.longitud;
  } else {
    setError(
      'La ubicación ingresada no es válida. Por favor, ingresá una calle, ciudad o ubicación válida.'
    );
    setLoading(false);
    return;
  }
}

if (latitudFinal === null || longitudFinal === null) {
  setError(
    'Por favor, seleccioná una ubicación válida en el mapa o ingresá una dirección válida.'
  );
  setLoading(false);
  return;
}

      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : 1;

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

      const fechaAutomatica = new Date().toISOString().slice(0, 10);

      const payload = {
        tipoPublicacion: formData.tipo,
        especie: formData.especie,
        raza: formData.raza || 'MESTIZO',
        edad: formData.edad || 'DESCONOCIDA',
        fecha: fechaAutomatica,
        caracteristicas: textoCaracteristicas || 'Mascota reportada',
        fotografia: formData.fotoBase64,
        latitud: latitudFinal,
        longitud: longitudFinal,
        usuarioId: userId
      };

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