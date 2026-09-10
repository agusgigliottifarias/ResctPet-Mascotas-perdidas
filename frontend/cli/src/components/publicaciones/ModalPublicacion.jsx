import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../ui/CustomSelect';
import {
  usePublicacionForm,
  TIPO_PUBLICACION,
  ESPECIE,
  SEXO,
  TAMANO,
  EDAD,
  RAZAS_PERRO,
  RAZAS_GATO
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

  const esPerdida = formData.tipo === TIPO_PUBLICACION.PERDIDA;
  const activeColor = esPerdida ? '#FF7A59' : '#2EC4B6';

  const especieOptions = [
    { value: ESPECIE.PERRO, label: 'Perro' },
    { value: ESPECIE.GATO, label: 'Gato' }
  ];

  const razaOptions = formData.especie === ESPECIE.PERRO ? RAZAS_PERRO : RAZAS_GATO;

  const edadOptions = [
    { value: EDAD.DESCONOCIDA, label: 'Edad desconocida (Opcional)' },
    { value: EDAD.CACHORRO, label: 'Cachorro (0 a 1 año)' },
    { value: EDAD.JOVEN, label: 'Joven (1 a 3 años)' },
    { value: EDAD.ADULTO, label: 'Adulto (3 a 8 años)' },
    { value: EDAD.SENIOR, label: 'Adulto mayor (+8 años)' }
  ];

  const sexoOptions = esPerdida
    ? [
        { value: SEXO.MACHO, label: 'Macho' },
        { value: SEXO.HEMBRA, label: 'Hembra' }
      ]
    : [
        { value: SEXO.MACHO, label: 'Macho' },
        { value: SEXO.HEMBRA, label: 'Hembra' },
        { value: SEXO.DESCONOCIDO, label: 'Desconocido' }
      ];

  const tamanoOptions = [
    { value: TAMANO.PEQUENO, label: 'Pequeño (0-10kg)' },
    { value: TAMANO.MEDIANO, label: 'Mediano (10-20kg)' },
    { value: TAMANO.GRANDE, label: 'Grande (+20kg)' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A202C]/40 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[800px] rounded-[36px] bg-white/80 backdrop-blur-2xl p-7 sm:p-8 shadow-[0_30px_70px_-15px_rgba(45,55,72,0.18)] border border-white/90 ring-1 ring-black/5"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-heading text-2xl font-black text-[#2D3748] tracking-tight">
                {esPerdida ? 'Publicar Mascota Perdida' : 'Publicar Mascota Encontrada'}
              </h2>
              <p className="text-xs font-semibold text-[#718096] mt-0.5">
                {esPerdida
                  ? 'Completá los datos para que la red de Yirando te ayude a encontrarla.'
                  : 'Brindá detalles para que su familia pueda reconocerla y contactarte.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm text-[#718096] border border-white/80 hover:bg-white hover:text-[#2D3748] transition-all"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-3 rounded-xl bg-red-500/10 backdrop-blur-md p-2.5 text-xs font-bold text-red-600 border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Slider de alternancia */}
            <div className="relative flex rounded-2xl bg-[#F7F4EE]/70 backdrop-blur-md p-1.5 border border-white/80 shadow-inner mb-4 overflow-hidden">
              <motion.div
                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                animate={{
                  x: esPerdida ? '0%' : '100%',
                  backgroundColor: activeColor
                }}
                transition={{
                  x: { type: 'spring', stiffness: 220, damping: 26 },
                  backgroundColor: { duration: 0.45, ease: [0.4, 0, 0.2, 1] }
                }}
              />

              <button
                type="button"
                onClick={() => handleChange('tipo', TIPO_PUBLICACION.PERDIDA)}
                className={`relative z-10 font-heading flex-1 py-2.5 text-xs font-bold transition-colors duration-300 ${
                  esPerdida ? 'text-white' : 'text-[#718096] hover:text-[#2D3748]'
                }`}
              >
                Perdí mi Mascota
              </button>

              <button
                type="button"
                onClick={() => handleChange('tipo', TIPO_PUBLICACION.ENCONTRADA)}
                className={`relative z-10 font-heading flex-1 py-2.5 text-xs font-bold transition-colors duration-300 ${
                  !esPerdida ? 'text-white' : 'text-[#718096] hover:text-[#2D3748]'
                }`}
              >
                Encontré una Mascota
              </button>
            </div>

            <div className="space-y-3">
              {/* Grilla Superior (Campos + Imagen) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                
                {/* Parte 1: Grilla 3x2 de campos compactos */}
                <div className="flex flex-col justify-between h-[230px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1 truncate">
                        {esPerdida ? 'Nombre de la mascota' : 'Nombre (Opcional)'}
                      </label>
                      <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => handleChange('nombre', e.target.value)}
                        placeholder={esPerdida ? "Yira" : "Si lo conocés"}
                        className="w-full rounded-xl bg-white/60 backdrop-blur-md border border-white/80 px-3 py-2 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white/90 focus:border-[#FF7A59]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Especie</label>
                      <CustomSelect
                        value={formData.especie}
                        onChange={(val) => handleChange('especie', val)}
                        options={especieOptions}
                        activeColor={activeColor}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Raza</label>
                      <CustomSelect
                        value={formData.raza}
                        onChange={(val) => handleChange('raza', val)}
                        options={razaOptions}
                        disabled={!formData.especie}
                        activeColor={activeColor}
                        searchable={true}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1 truncate">Edad (Opcional)</label>
                      <CustomSelect
                        value={formData.edad}
                        onChange={(val) => handleChange('edad', val)}
                        options={edadOptions}
                        activeColor={activeColor}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Sexo</label>
                      <CustomSelect
                        value={formData.sexo}
                        onChange={(val) => handleChange('sexo', val)}
                        options={sexoOptions}
                        activeColor={activeColor}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1 truncate">Tamaño aproximado</label>
                      <CustomSelect
                        value={formData.tamano}
                        onChange={(val) => handleChange('tamano', val)}
                        options={tamanoOptions}
                        activeColor={activeColor}
                      />
                    </div>
                  </div>
                </div>

                {/* Parte 2: Subida de imagen con contorno y fondo reactivos */}
                <div className="h-[230px]">
                  <motion.div
                    onClick={() => fileInputRef.current?.click()}
                    animate={{
                      borderColor: esPerdida ? 'rgba(255,122,89,0.45)' : 'rgba(46,196,182,0.45)'
                    }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                    className="group relative flex flex-col items-center justify-center h-full w-full rounded-2xl border-2 border-dashed bg-white/40 backdrop-blur-sm p-3 cursor-pointer hover:bg-white/70 transition-all overflow-hidden"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />
                    {previewUrl ? (
                      <div className="relative h-full w-full flex items-center justify-center">
                        <img src={previewUrl} alt="Preview" className="h-full w-full object-contain rounded-xl drop-shadow-sm" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto();
                          }}
                          className="absolute top-1 right-1 rounded-full bg-red-500/90 text-white text-[10px] px-2 py-0.5 font-bold shadow hover:bg-red-600 transition-colors"
                        >
                          Quitar
                        </button>
                      </div>
                    ) : (
                      <>
                        <motion.div
                          animate={{
                            backgroundColor: esPerdida ? 'rgba(255,232,224,0.85)' : 'rgba(230,249,247,0.85)',
                            color: activeColor
                          }}
                          transition={{ duration: 0.45, ease: 'easeInOut' }}
                          className="flex h-11 w-11 items-center justify-center rounded-full mb-1.5 group-hover:scale-105 transition-transform"
                        >
                          📷
                        </motion.div>
                        <p className="text-xs font-bold text-[#2D3748] text-center">Subí una foto de la mascota</p>
                        <p className="text-[10px] text-[#A0AEC0] mt-0.5 text-center">Solo archivos PNG o JPG (hasta 5MB)</p>
                      </>
                    )}
                  </motion.div>
                </div>

              </div>

              {/* Parte 3: Cuadros anchos */}
              <div className="space-y-2.5 pt-1">
                {esPerdida ? (
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                      Última zona o calle vista
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={formData.ubicacion}
                        onChange={(e) => handleChange('ubicacion', e.target.value)}
                        placeholder="Plaza X, Calle 1234, Barrio Y"
                        className="w-full rounded-xl bg-white/60 backdrop-blur-md border border-white/80 pl-3 pr-28 py-2 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white/90 focus:border-[#FF7A59]"
                      />
                      <button
                        type="button"
                        onClick={onOpenMapPicker}
                        className="font-heading absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-[#2EC4B6]/15 border border-[#2EC4B6]/30 px-2.5 py-1 text-[11px] font-bold text-[#2EC4B6] hover:bg-[#2EC4B6]/25 transition-all"
                      >
                        📍 Mapa
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                        Lugar donde fue encontrado
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.ubicacion}
                          onChange={(e) => handleChange('ubicacion', e.target.value)}
                          placeholder="Plaza X, Calle 1234, Barrio Y"
                          className="w-full rounded-xl bg-white/60 backdrop-blur-md border border-white/80 pl-3 pr-24 py-2 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white/90 focus:border-[#2EC4B6]"
                        />
                        <button
                          type="button"
                          onClick={onOpenMapPicker}
                          className="font-heading absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg bg-[#2EC4B6]/15 border border-[#2EC4B6]/30 px-2 py-1 text-[11px] font-bold text-[#2EC4B6] hover:bg-[#2EC4B6]/25 transition-all"
                        >
                          📍 Mapa
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#2EC4B6] mb-1">
                        ¿Dónde se encuentra ahora?
                      </label>
                      <input
                        type="text"
                        value={formData.estadoRetencion}
                        onChange={(e) => handleChange('estadoRetencion', e.target.value)}
                        placeholder="Ej: En mi patio resguardado / En veterinaria"
                        className="w-full rounded-xl bg-white/60 backdrop-blur-md border border-[#2EC4B6]/40 px-3 py-2 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white/90 focus:border-[#2EC4B6]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-[#4A5568] mb-1">Características de la Mascota</label>
                  <textarea
                    rows={2}
                    value={formData.caracteristicas}
                    onChange={(e) => handleChange('caracteristicas', e.target.value)}
                    placeholder="Color de pelaje, manchas, color del collar, etc..."
                    className="w-full rounded-xl bg-white/60 backdrop-blur-md border border-white/80 p-2.5 text-xs text-[#2D3748] font-medium outline-none resize-none transition-all duration-200 focus:bg-white/90 focus:border-[#FF7A59]"
                  />
                </div>
              </div>
            </div>

            {/* Footer de Acciones */}
            <div className="flex items-center justify-end gap-3 pt-3 mt-4 border-t border-white/60">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="font-heading rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 px-5 py-2.5 text-xs font-bold text-[#718096] hover:bg-white hover:text-[#2D3748] transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <motion.button
                type="submit"
                disabled={loading}
                animate={{ backgroundColor: activeColor }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                className="font-heading rounded-xl px-6 py-2.5 text-xs font-bold text-white shadow-md active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading
                  ? 'Publicando...'
                  : esPerdida
                  ? formData.nombre.trim()
                    ? `Encontremos a ${formData.nombre.trim()}`
                    : 'Encontremos a...'
                  : 'Reencontremos a su familia'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}