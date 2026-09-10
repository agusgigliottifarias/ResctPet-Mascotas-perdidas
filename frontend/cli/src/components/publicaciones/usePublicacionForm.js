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

export const EDAD = {
  DESCONOCIDA: 'DESCONOCIDA',
  CACHORRO: 'CACHORRO',
  JOVEN: 'JOVEN',
  ADULTO: 'ADULTO',
  SENIOR: 'SENIOR'
};

export const RAZAS_PERRO = [
  { value: 'MESTIZO', label: 'Mestizo' },
  { value: 'AKITA_INU', label: 'Akita Inu' },
  { value: 'BASSET_HOUND', label: 'Basset Hound' },
  { value: 'BEAGLE', label: 'Beagle' },
  { value: 'BICHON_FRISE', label: 'Bichón Frisé' },
  { value: 'BORDER_COLLIE', label: 'Border Collie' },
  { value: 'BOXER', label: 'Bóxer' },
  { value: 'BULL_TERRIER', label: 'Bull Terrier' },
  { value: 'BULLDOG_FRANCES', label: 'Bulldog Francés' },
  { value: 'BULLDOG_INGLES', label: 'Bulldog Inglés' },
  { value: 'CANICHE', label: 'Caniche' },
  { value: 'CHIHUAHUA', label: 'Chihuahua' },
  { value: 'CHOW_CHOW', label: 'Chow Chow' },
  { value: 'COCKER_SPANIEL', label: 'Cocker Spaniel' },
  { value: 'DALMATA', label: 'Dálmata' },
  { value: 'DOBERMAN', label: 'Dóberman' },
  { value: 'DOGO_ARGENTINO', label: 'Dogo Argentino' },
  { value: 'FOX_TERRIER', label: 'Fox Terrier' },
  { value: 'GOLDEN_RETRIEVER', label: 'Golden Retriever' },
  { value: 'GRAN_DANES', label: 'Gran Danés' },
  { value: 'HUSKY_SIBERIANO', label: 'Husky Siberiano' },
  { value: 'JACK_RUSSELL', label: 'Jack Russell Terrier' },
  { value: 'LABRADOR_RETRIEVER', label: 'Labrador Retriever' },
  { value: 'MALINOIS', label: 'Pastor Belga Malinois' },
  { value: 'OVEJERO_ALEMAN', label: 'Ovejero Alemán' },
  { value: 'PASTOR_AUSTRALIANO', label: 'Pastor Australiano' },
  { value: 'PEKINES', label: 'Pekinés' },
  { value: 'PITBULL', label: 'Pitbull' },
  { value: 'POINTER', label: 'Pointer' },
  { value: 'PUG', label: 'Pug' },
  { value: 'ROTTWEILER', label: 'Rottweiler' },
  { value: 'SALCHICHA', label: 'Salchicha' },
  { value: 'SAMOYEDO', label: 'Samoyedo' },
  { value: 'SAN_BERNARDO', label: 'San Bernardo' },
  { value: 'SCHNAUZER', label: 'Schnauzer' },
  { value: 'SETTER_IRLANDES', label: 'Setter Irlandés' },
  { value: 'SHAR_PEI', label: 'Shar Pei' },
  { value: 'SHIH_TZU', label: 'Shih Tzu' },
  { value: 'TERRANOVA', label: 'Terranova' },
  { value: 'WEIMARANER', label: 'Weimaraner' },
  { value: 'YORKSHIRE_TERRIER', label: 'Yorkshire Terrier' },
  { value: 'OTRA', label: 'Otra raza' }
];

export const RAZAS_GATO = [
  { value: 'MESTIZO', label: 'Mestizo / Común Europeo' },
  { value: 'ABISINIO', label: 'Abisinio' },
  { value: 'AMERICAN_SHORTHAIR', label: 'American Shorthair' },
  { value: 'ANGORA_TURCO', label: 'Angora Turco' },
  { value: 'AZUL_RUSO', label: 'Azul Ruso' },
  { value: 'BENGALI', label: 'Bengalí' },
  { value: 'BOSQUE_DE_NORUEGA', label: 'Bosque de Noruega' },
  { value: 'BRITISH_SHORTHAIR', label: 'British Shorthair' },
  { value: 'BURMES', label: 'Burmés' },
  { value: 'CORNISH_REX', label: 'Cornish Rex' },
  { value: 'EGIPCIO', label: 'Gato Egipcio / Sin pelo' },
  { value: 'HIMALAYO', label: 'Himalayo' },
  { value: 'MAINE_COON', label: 'Maine Coon' },
  { value: 'MANX', label: 'Manx' },
  { value: 'MUNCHKIN', label: 'Munchkin' },
  { value: 'PERSA', label: 'Persa' },
  { value: 'RAGDOLL', label: 'Ragdoll' },
  { value: 'SAGRADO_DE_BIRMANIA', label: 'Sagrado de Birmania' },
  { value: 'SCOTTISH_FOLD', label: 'Scottish Fold' },
  { value: 'SIAMES', label: 'Siamés' },
  { value: 'SOMALI', label: 'Somalí' },
  { value: 'VAN_TURCO', label: 'Van Turco' },
  { value: 'OTRA', label: 'Otra raza' }
];

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
  fotoBase64: null
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

    // Validación según tipo
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

      // Obtener el ID del usuario en sesión
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : 1;

      // Titulo representativo
      const tituloFinal = formData.tipo === TIPO_PUBLICACION.PERDIDA
        ? `Perdido: ${formData.nombre.trim()}`
        : formData.nombre.trim()
        ? `Encontrado: ${formData.nombre.trim()}`
        : `Mascota Encontrada (${formData.especie === ESPECIE.PERRO ? 'Perro' : 'Gato'})`;

      // Armado de metadatos dentro de la descripción para el backend
      const detallesArray = [
        `Raza: ${formData.raza}`,
        `Sexo: ${formData.sexo}`,
        `Tamaño: ${formData.tamano}`
      ];

      if (formData.edad !== EDAD.DESCONOCIDA) {
        detallesArray.push(`Edad: ${formData.edad}`);
      }

      if (formData.tipo === TIPO_PUBLICACION.ENCONTRADA && formData.estadoRetencion.trim()) {
        detallesArray.unshift(`Ubicación actual: ${formData.estadoRetencion.trim()}`);
      }

      const metadataString = `[${detallesArray.join(' | ')}]`;
      const descripcionFinal = formData.caracteristicas.trim()
        ? `${formData.caracteristicas.trim()}\n\n${metadataString}`
        : metadataString;

      // DTO PublicacionRequest exacto de Spring Boot
      const payload = {
        titulo: tituloFinal,
        descripcion: descripcionFinal,
        especie: formData.especie,
        raza: formData.raza,
        edad: formData.edad,
        sexo: formData.sexo,
        tamano: formData.tamano,
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