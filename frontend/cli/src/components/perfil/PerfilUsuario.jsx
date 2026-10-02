import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PerfilUsuario({
  isOpen,
  onClose,
  usuario,
  onLogout,
  error = null,
  onRetry = null
}) {
  if (!isOpen) return null;

  // Criterio: Si no inició sesión, no permite acceder a su información personal
  if (!usuario) {
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
            className="relative z-10 w-full max-w-[400px] rounded-[36px] bg-white/90 backdrop-blur-2xl p-7 shadow-2xl border border-white/90 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl">
              🔒
            </div>
            <h3 className="font-heading text-xl font-black text-[#2D3748] mb-1">
              Acceso Restringido
            </h3>
            <p className="text-xs font-semibold text-[#718096] mb-5">
              Debés iniciar sesión en Yirando para poder consultar tu información personal.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#FF7A59] hover:bg-[#ff6842] text-white py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Iniciar Sesión / Registrarme
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  // Iniciales del usuario para el avatar
  const iniciales = `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`.toUpperCase() || 'U';

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

        {/* Tarjeta de Perfil */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[460px] rounded-[36px] bg-white/90 backdrop-blur-2xl p-7 sm:p-8 shadow-[0_30px_70px_-15px_rgba(45,55,72,0.22)] border border-white/90 ring-1 ring-black/5"
        >
          {/* Botón de cierre superior (✕) */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm text-[#718096] border border-white/80 hover:bg-white hover:text-[#2D3748] transition-all cursor-pointer shadow-sm"
          >
            ✕
          </button>

          {/* Encabezado */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FF7A59]/15 text-[#FF7A59] border-2 border-[#FF7A59]/30 flex items-center justify-center font-heading font-black text-2xl shadow-inner">
              {iniciales}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider mb-1">
                ● Usuario Activo
              </div>
              <h2 className="font-heading text-2xl font-black text-[#2D3748] leading-tight">
                {usuario.nombre} {usuario.apellido}
              </h2>
              <p className="text-xs font-semibold text-[#718096]">
                Miembro de la comunidad Yirando
              </p>
            </div>
          </div>

          {/* Criterio: Error al consultar información */}
          {error ? (
            <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-center">
              <span className="text-2xl mb-1 block">⚠️</span>
              <p className="text-xs font-bold text-red-600 mb-2">
                Los datos personales no pudieron ser cargados.
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="rounded-lg bg-red-600 text-white px-3 py-1.5 text-[11px] font-bold hover:bg-red-700 transition-all cursor-pointer"
                >
                  Reintentar
                </button>
              )}
            </div>
          ) : (
            /* Sección de Datos Personales Registrados */
            <div className="space-y-3 mb-6">
              <div className="rounded-2xl bg-[#F7F4EE]/80 p-3.5 border border-white/80">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] mb-0.5">
                  Nombre Completo
                </span>
                <p className="text-sm font-bold text-[#2D3748]">
                  {usuario.nombre} {usuario.apellido}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F4EE]/80 p-3.5 border border-white/80">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] mb-0.5">
                  Correo Electrónico
                </span>
                <p className="text-sm font-bold text-[#2D3748]">
                  {usuario.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#F7F4EE]/80 p-3 border border-white/80">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] mb-0.5">
                    Identificador (ID)
                  </span>
                  <p className="text-xs font-bold text-[#2D3748]">
                    #{usuario.id || 'N/A'}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#F7F4EE]/80 p-3 border border-white/80">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#A0AEC0] mb-0.5">
                    Estado de Sesión
                  </span>
                  <p className="text-xs font-bold text-emerald-600">
                    Autenticado (JWT)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex items-center gap-3 pt-3 border-t border-black/5">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#4A5568] py-2.5 text-xs font-bold transition-all cursor-pointer"
            >
              Volver al Mapa
            </button>
            <button
              onClick={onLogout}
              className="flex-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🚪</span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}