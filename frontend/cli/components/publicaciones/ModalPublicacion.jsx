import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  usePublicacionForm,
  TIPO_PUBLICACION,
  ESPECIE,
  SEXO,
  TAMANO
} from './usePublicacionForm';

export default function ModalPublicacion({ isOpen, onClose, onSuccess, onOpenMapPicker }) {
  const fileInputRef = useRef(null);

  const {
    formData,
    previewUrl,
    loading,
    error,
    handleChange,
    handleFileChange,
    handleRemovePhoto,
    handleSubmit
  } = usePublicacionForm({ onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop con Blur y Oscurecimiento */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A202C]/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[620px] max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl border border-[#EFE9E1]"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-[#2D3748] tracking-tight">Publicar Nueva Alerta</h2>
              <p className="text-xs text-[#718096] mt-1">Completá los datos para que la comunidad pueda ayudarte en la búsqueda.</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F4EE] text-[#718096] hover:bg-[#EFE9E1] transition-colors"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Toggle Tipo Alerta */}
            <div className="flex rounded-2xl bg-[#FDFBF7] p-1 border border-[#EFE9E1]">
              <button
                type="button"
                onClick={() => handleChange('tipo', TIPO_PUBLICACION.PERDIDA)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  formData.tipo === TIPO_PUBLICACION.PERDIDA
                    ? 'bg-[#FF7A59] text-white shadow-sm'
                    : 'text-[#718096] hover:text-[#2D3748]'
                }`}
              >
                Perdí mi Mascota
              </button>
              <button
                type="button"
                onClick={() => handleChange('tipo', TIPO_PUBLICACION.ENCONTRADA)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  formData.tipo === TIPO_PUBLICACION.ENCONTRADA
                    ? 'bg-[#FF7A59] text-white shadow-sm'
                    : 'text-[#718096] hover:text-[#2D3748]'
                }`}
              >
                Encontré una Mascota
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#FFC5B5] bg-[#FFFBF9] p-4 cursor-pointer hover:bg-[#FFF5F2] transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />

              {previewUrl ? (
                <div className="relative h-28 w-full">
                  <img src={previewUrl} alt="Preview" className="h-full w-full rounded-xl object-contain" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePhoto();
                    }}
                    className="absolute top-1 right-1 rounded-full bg-red-500 text-white text-xs px-2 py-1 shadow"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFE8E0] text-[#FF7A59] mb-2 group-hover:scale-105 transition-transform">
                    📸
                  </div>
                  <p className="text-xs font-bold text-[#2D3748]">Subí una foto clara de la mascota</p>
                  <p className="text-[11px] text-[#A0AEC0] mt-0.5">Hacé clic o arrastrá el archivo acá (JPG o PNG hasta 5MB)</p>
                </>
              )}
            </div>

            {/* Fila 1: Nombre y Especie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Nombre o Apodo de la mascota</label>
                <input
                  type="text"
                  placeholder="Ej: Toby"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#2D3748] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Especie</label>
                <select
                  value={formData.especie}
                  onChange={(e) => handleChange('especie', e.target.value)}
                  className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#2D3748] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
                >
                  <option value={ESPECIE.PERRO}>Perro</option>
                  <option value={ESPECIE.GATO}>Gato</option>
                </select>
              </div>
            </div>

            {/* Fila 2: Sexo y Tamaño */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Sexo</label>
                <select
                  value={formData.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                  className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#2D3748] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
                >
                  <option value={SEXO.MACHO}>Macho</option>
                  <option value={SEXO.HEMBRA}>Hembra</option>
                  <option value={SEXO.DESCONOCIDO}>Desconocido</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A5568] mb-1">Tamaño aproximado</label>
                <select
                  value={formData.tamano}
                  onChange={(e) => handleChange('tamano', e.target.value)}
                  className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] px-3.5 py-2.5 text-sm text-[#2D3748] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
                >
                  <option value={TAMANO.PEQUENO}>Pequeño (0 a 10 kg)</option>
                  <option value={TAMANO.MEDIANO}>Mediano (10 a 20 kg)</option>
                  <option value={TAMANO.GRANDE}>Grande (+20 kg)</option>
                </select>
              </div>
            </div>

            {/* Fila 3: Ubicación con Botón de Fijar en Mapa */}
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Última zona o calle vista</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ej: Plaza X, Av. 1234, Barrio Y"
                  value={formData.ubicacion}
                  onChange={(e) => handleChange('ubicacion', e.target.value)}
                  className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] pl-3.5 pr-36 py-2.5 text-sm text-[#2D3748] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
                />
                <button
                  type="button"
                  onClick={onOpenMapPicker}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-[#E2ECE4] px-2.5 py-1.5 text-xs font-bold text-[#2EC4B6] hover:bg-[#D5E4D8] transition-colors"
                >
                  📍 Fijar en el mapa
                </button>
              </div>
            </div>

            {/* Fila 4: Detalles de la Mascota */}
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1">Detalles de la Mascota</label>
              <textarea
                rows={3}
                placeholder="Color de pelaje, color del collar, manchas..."
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] p-3 text-sm text-[#2D3748] outline-none resize-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
              />
            </div>

            {/* Acciones del Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFE9E1]">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-32 rounded-xl border border-[#E2E8F0] py-2.5 text-sm font-bold text-[#718096] hover:bg-[#FDFBF7] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-initial sm:w-64 rounded-xl bg-[#FF7A59] py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#ff6842] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Publicando...' : 'Publicar Alerta Inmediata'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}