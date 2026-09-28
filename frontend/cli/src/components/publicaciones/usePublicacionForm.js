import { useState, useCallback } from 'react';
import {
  crearPublicacionPerdida,
  crearPublicacionEncontrada
} from '../../api/publicacionesApi';

import {
  TIPO_PUBLICACION,
  ESPECIE,
  SEXO,
  TAMANO,
  EDAD
} from '../../constants/mascotas';

const PUERTO_MADRYN = {
  lat: -42.7692,
  lng: -65.0385
};

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

// Geocodificación a partir de texto
const buscarCoordenadasPorTexto = async (textoUbicacion) => {
  try {
    const texto = textoUbicacion.trim();

    if (!texto) return null;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        texto + ', Puerto Madryn, Chubut'
      )}&limit=1`
    );

    if (!res.ok) return null;

    const data = await res.json();

    if (!data || data.length === 0) return null;

    return {
      latitud: parseFloat(data[0].lat),
      longitud: parseFloat(data[0].lon)
    };
  } catch (err) {
    console.warn(
      'No se pudo geocodificar por texto:',
      err
    );

    return null;
  }
};

export const usePublicacionForm = ({
  onSuccess,
  onClose
}) => {
  const [formData, setFormData] =
    useState(INITIAL_STATE);

  const [previewUrl, setPreviewUrl] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const handleChange = useCallback(
    (field, value) => {
      setFormData((prev) => {

        if (field === 'especie') {
          return {
            ...prev,
            especie: value,
            raza: 'MESTIZO'
          };
        }

        if (field === 'tipo') {
          return {
            ...prev,
            tipo: value,
            sexo:
              value === TIPO_PUBLICACION.PERDIDA &&
              prev.sexo === SEXO.DESCONOCIDO
                ? SEXO.MACHO
                : prev.sexo
          };
        }

        return {
          ...prev,
          [field]: value
        };
      });
    },
    []
  );

  const handleFileChange = useCallback(
    (file) => {
      if (!file) return;

      if (
        !['image/jpeg', 'image/png'].includes(
          file.type
        )
      ) {
        setError(
          'Formato inválido. Solo se admiten archivos PNG o JPG.'
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(
          'La foto no puede superar los 5MB.'
        );
        return;
      }

      setError(null);

      setPreviewUrl(
        URL.createObjectURL(file)
      );

      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          nombreFoto:
            file.name || 'mascota.jpg',
          fotoBase64: reader.result
        }));
      };

      reader.readAsDataURL(file);
    },
    []
  );

  const handleRemovePhoto = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);

    setFormData((prev) => ({
      ...prev,
      fotoBase64: null,
      nombreFoto: ''
    }));
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.fotoBase64) {
      setError(
        'La fotografía de la mascota es obligatoria.'
      );
      return;
    }

    if (
      formData.tipo === TIPO_PUBLICACION.PERDIDA &&
      !formData.nombre.trim()
    ) {
      setError(
        'Por favor, ingresá el nombre de la mascota.'
      );
      return;
    }

    // Las características son obligatorias
    const caracteristicas =
      formData.caracteristicas.trim();

    if (!caracteristicas) {
      setError(
        'Las características de la mascota son obligatorias.'
      );
      return;
    }

    if (
      !/[aeiouáéíóúü]/i.test(caracteristicas) ||
      !/\s/.test(caracteristicas)
    ) {
      setError(
        'Ingresá características válidas de la mascota.'
      );
      return;
    }

    // La ubicación es obligatoria
    if (!formData.ubicacion.trim()) {
      setError(
        'La ubicación de la mascota es obligatoria.'
      );
      return;
    }

    try {
      setLoading(true);

      // Determinación de coordenadas
      let latitudFinal = formData.latitud;
      let longitudFinal = formData.longitud;

      // Si no hay coordenadas pero hay una ubicación escrita,
      // intentamos encontrarla mediante Nominatim.
      if (
        (latitudFinal === null ||
          latitudFinal === undefined ||
          longitudFinal === null ||
          longitudFinal === undefined) &&
        formData.ubicacion.trim()
      ) {
        const coords =
          await buscarCoordenadasPorTexto(
            formData.ubicacion.trim()
          );

        if (coords) {
          latitudFinal = coords.latitud;
          longitudFinal = coords.longitud;
        }
      }

      // Si no se pudieron obtener coordenadas válidas,
      // NO se crea la publicación.
      if (
        latitudFinal === null ||
        latitudFinal === undefined ||
        longitudFinal === null ||
        longitudFinal === undefined ||
        Number.isNaN(Number(latitudFinal)) ||
        Number.isNaN(Number(longitudFinal))
      ) {
        setError(
          'No se pudo identificar la ubicación. Seleccioná una ubicación válida en el mapa.'
        );
        return;
      }

      const storedUser =
        localStorage.getItem('user');

      const userId = storedUser
        ? JSON.parse(storedUser).id
        : 1;

      let textoCaracteristicas =
        caracteristicas;

      if (formData.nombre.trim()) {
        textoCaracteristicas =
          `Nombre: ${formData.nombre.trim()}. ${textoCaracteristicas}`;
      }

      if (formData.ubicacion.trim()) {
        textoCaracteristicas =
          `${textoCaracteristicas} [Zona: ${formData.ubicacion.trim()}]`;
      }

      if (formData.estadoRetencion.trim()) {
        textoCaracteristicas =
          `${textoCaracteristicas} [Retención: ${formData.estadoRetencion.trim()}]`;
      }

      if (textoCaracteristicas.length > 500) {
        textoCaracteristicas =
          textoCaracteristicas.substring(0, 500);
      }

      const fechaAutomatica =
        new Date()
          .toISOString()
          .slice(0, 10);

      const payload = {
        tipoPublicacion: formData.tipo,
        tipo: formData.tipo,
        especie: formData.especie,
        raza: formData.raza || 'MESTIZO',
        edad:
          formData.edad || 'DESCONOCIDA',
        fecha: fechaAutomatica,
        caracteristicas: textoCaracteristicas,
        fotografia: formData.fotoBase64,
        latitud: latitudFinal,
        longitud: longitudFinal,
        usuarioId: userId
      };

      let respuestaBackend = null;

      try {
        if (
          formData.tipo ===
          TIPO_PUBLICACION.ENCONTRADA
        ) {
          respuestaBackend =
            await crearPublicacionEncontrada(
              payload
            );
        } else {
          respuestaBackend =
            await crearPublicacionPerdida(
              payload
            );
        }
      } catch (apiErr) {
        console.warn(
          'Aviso API Backend (se guardará localmente):',
          apiErr
        );
      }

      const idFinal =
        respuestaBackend?.data?.id ||
        respuestaBackend?.id ||
        `pub_${Date.now()}`;

      const publicacionLocal = {
        ...payload,
        id: idFinal,
        nombre:
          formData.nombre ||
          (
            formData.tipo ===
            TIPO_PUBLICACION.PERDIDA
              ? 'Perrito'
              : 'Mascota'
          ),
        nombreMascota:
          formData.nombre,
        barrio:
          formData.ubicacion ||
          'Puerto Madryn',
        ubicacion:
          formData.ubicacion ||
          'Puerto Madryn',
        latitud: latitudFinal,
        longitud: longitudFinal,
        fechaCreacion:
          new Date().toISOString()
      };

      const localesActuales =
        JSON.parse(
          localStorage.getItem(
            'resctpet_publicaciones'
          ) || '[]'
        );

      const actualizadas = [
        publicacionLocal,
        ...localesActuales.filter(
          (p) =>
            String(p.id) !==
            String(idFinal)
        )
      ];

      localStorage.setItem(
        'resctpet_publicaciones',
        JSON.stringify(actualizadas)
      );

      setFormData(INITIAL_STATE);

      handleRemovePhoto();

      if (onSuccess) onSuccess();
      if (onClose) onClose();

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Error al procesar la publicación.'
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