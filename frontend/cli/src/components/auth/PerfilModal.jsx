import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PerfilModal({ isOpen, onClose, usuario, onLogout }) {
  if (!isOpen || !usuario) return null;

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
          className="relative z-10 w-full max-w-[380px] rounded-[36px] bg-white/90 backdrop-blur-2xl p-6 shadow-2xl border border-white/90 text-center"
        >
          {/* Avatar con iniciales */}
          <div className="w-16 h-16 rounded-full bg-[#FF7A59]/15 text-[#FF7A59] font-black text-xl flex items-center justify-center mx-auto mb-3 border-2 border-[#FF7A59]/30">
            {usuario.nombre?.[0]?.toUpperCase()}
            {usuario.apellido?.[0]?.toUpperCase()}
          </div>

          <h3 className="font-heading text-lg font-black text-[#2D3748]">
            {usuario.nombre} {usuario.apellido}
          </h3>
          <p className="text-xs font-semibold text-gray-500 mb-6">{usuario.email}</p>

          <div className="space-y-2">
            <button
              onClick={onLogout}
              className="w-full rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 py-2.5 text-xs font-bold transition-all"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 text-[#4A5568] py-2 text-xs font-bold transition-all"
            >
              Volver al Mapa
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}