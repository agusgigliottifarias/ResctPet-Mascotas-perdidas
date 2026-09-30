import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistroForm } from './useRegistroForm';

export default function ModalRegistro({ isOpen, onClose, onSuccess }) {
  const {
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
  } = useRegistroForm({ onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Fondo con desenfoque */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1A202C]/40 backdrop-blur-md"
        />

        {/* Contenedor del Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[480px] rounded-[36px] bg-white/90 backdrop-blur-2xl p-7 sm:p-8 shadow-[0_30px_70px_-15px_rgba(45,55,72,0.18)] border border-white/90 ring-1 ring-black/5"
        >
          {/* Encabezado */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A59]/10 text-[#FF7A59] text-[11px] font-black tracking-wide uppercase mb-2">
                Unite a la comunidad
              </div>
              <h2 className="font-heading text-2xl font-black text-[#2D3748] tracking-tight">
                Crear Cuenta
              </h2>
              <p className="text-xs font-semibold text-[#718096] mt-0.5">
                Registrate para publicar, buscar y ayudar a reencontrar mascotas en Yirando.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm text-[#718096] border border-white/80 hover:bg-white hover:text-[#2D3748] transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Banner de error general / backend */}
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-2xl bg-red-500/10 backdrop-blur-md p-3 text-xs font-bold text-red-600 border border-red-500/20 flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{generalError}</span>
            </motion.div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nombre y Apellido en 2 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Nombre <span className="text-[#FF7A59]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Laura"
                  disabled={loading}
                  className={`w-full rounded-xl bg-white/70 backdrop-blur-md border px-3.5 py-2.5 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white ${
                    errors.nombre
                      ? 'border-red-400 focus:border-red-500 ring-2 ring-red-500/10'
                      : 'border-white/80 focus:border-[#FF7A59]'
                  }`}
                />
                {errors.nombre && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Apellido <span className="text-[#FF7A59]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleChange('apellido', e.target.value)}
                  placeholder="Ej: Gómez"
                  disabled={loading}
                  className={`w-full rounded-xl bg-white/70 backdrop-blur-md border px-3.5 py-2.5 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white ${
                    errors.apellido
                      ? 'border-red-400 focus:border-red-500 ring-2 ring-red-500/10'
                      : 'border-white/80 focus:border-[#FF7A59]'
                  }`}
                />
                {errors.apellido && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">
                    {errors.apellido}
                  </p>
                )}
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                Correo Electrónico <span className="text-[#FF7A59]">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="ejemplo@correo.com"
                disabled={loading}
                className={`w-full rounded-xl bg-white/70 backdrop-blur-md border px-3.5 py-2.5 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 ring-2 ring-red-500/10'
                    : 'border-white/80 focus:border-[#FF7A59]'
                }`}
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                Contraseña <span className="text-[#FF7A59]">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  className={`w-full rounded-xl bg-white/70 backdrop-blur-md border pl-3.5 pr-12 py-2.5 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white ${
                    errors.password
                      ? 'border-red-400 focus:border-red-500 ring-2 ring-red-500/10'
                      : 'border-white/80 focus:border-[#FF7A59]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#A0AEC0] hover:text-[#4A5568] transition-colors text-xs font-bold cursor-pointer"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                Confirmar Contraseña <span className="text-[#FF7A59]">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Repetí tu contraseña"
                  disabled={loading}
                  className={`w-full rounded-xl bg-white/70 backdrop-blur-md border pl-3.5 pr-12 py-2.5 text-xs text-[#2D3748] font-medium outline-none transition-all duration-200 focus:bg-white ${
                    errors.confirmPassword
                      ? 'border-red-400 focus:border-red-500 ring-2 ring-red-500/10'
                      : 'border-white/80 focus:border-[#FF7A59]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-[#A0AEC0] hover:text-[#4A5568] transition-colors text-xs font-bold cursor-pointer"
                >
                  {showConfirmPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-end gap-3 pt-3 mt-4 border-t border-white/60">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="font-heading rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 px-4 py-2.5 text-xs font-bold text-[#718096] hover:bg-white hover:text-[#2D3748] transition-all cursor-pointer disabled:opacity-50"
              >
                Continuar como invitado
              </button>

              <button
                type="submit"
                disabled={loading}
                className="font-heading rounded-xl bg-[#FF7A59] hover:bg-[#ff6842] px-6 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(255,122,89,0.35)] active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  'Registrarme'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}