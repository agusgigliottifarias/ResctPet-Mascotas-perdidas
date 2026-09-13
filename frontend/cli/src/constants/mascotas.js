/**
 * Constantes y Enumeraciones para el módulo de Mascotas / Publicaciones
 */

export const TIPO_PUBLICACION = Object.freeze({
  PERDIDA: 'PERDIDA',
  ENCONTRADA: 'ENCONTRADA'
});

export const ESPECIE = Object.freeze({
  PERRO: 'PERRO',
  GATO: 'GATO'
});

export const SEXO = Object.freeze({
  MACHO: 'MACHO',
  HEMBRA: 'HEMBRA',
  DESCONOCIDO: 'DESCONOCIDO'
});

export const TAMANO = Object.freeze({
  PEQUENO: 'PEQUENO',
  MEDIANO: 'MEDIANO',
  GRANDE: 'GRANDE'
});

export const EDAD = Object.freeze({
  DESCONOCIDA: 'DESCONOCIDA',
  CACHORRO: 'CACHORRO',
  JOVEN: 'JOVEN',
  ADULTO: 'ADULTO',
  SENIOR: 'SENIOR'
});

export const RAZAS_PERRO = Object.freeze([
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
]);

export const RAZAS_GATO = Object.freeze([
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
]);

/**
 * Función helper para obtener la lista de razas según la especie seleccionada
 */
export const getRazasPorEspecie = (especie) => {
  return especie === ESPECIE.PERRO ? RAZAS_PERRO : RAZAS_GATO;
};