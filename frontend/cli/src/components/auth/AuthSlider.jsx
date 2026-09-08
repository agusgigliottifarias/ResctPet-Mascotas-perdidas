import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthSlider({ onLoginSuccess, onRegisterSuccess }) {
  // false = vista inicial Login (panel salmón a la derecha)
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[#F7F4EE] overflow-hidden">
      {/* Trama decorativa de fondo con opacidad baja */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232D3748' fill-opacity='0.4'%3E%3Cpath d='M20 15c-2 0-3 1-4 3s0 4 2 5 4 0 5-2-1-6-3-6zm-10 1c-1.5 0-2.5 1-3 2.5s.5 3.5 2 4 3.5-.5 4-2-1.5-4.5-3-4.5zm5 9c-3 0-5 2.5-5 5.5s2 5 5 5 5-2 5-5-2-5.5-5-5.5zm45 25c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zm-4-8c-1.5 0-2.5 1-3 2.5s.5 3.5 2 4 3.5-.5 4-2-1.5-4.5-3-4.5zm8 0c-1.5 0-2.5 1-3 2.5s.5 3.5 2 4 3.5-.5 4-2-1.5-4.5-3-4.5zm-38 23c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '90px 90px'
        }}
      />

      {/* Tarjeta Glassmorphic principal */}
      <div className="relative z-10 flex h-[520px] w-[860px] overflow-hidden rounded-[36px] bg-white/75 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(45,55,72,0.15)] border border-white/80 ring-1 ring-black/5">
        
        {/* Panel Deslizante Salmón */}
        <motion.div
          className="absolute top-0 left-0 z-20 flex h-full w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#FF7A59] to-[#FF6B6B] p-10 text-center text-white shadow-[0_0_30px_rgba(255,122,89,0.25)]"
          animate={{ x: isRegister ? '0%' : '100%' }}
          transition={{ type: 'spring', stiffness: 75, damping: 15 }}
        >
          <span className="text-3xl mb-2">🐾</span>
          <h2 className="text-3xl font-black mb-3 tracking-tight">
            {isRegister ? '¡Hola de nuevo!' : '¡Sumate a la red!'}
          </h2>
          <p className="mb-8 text-sm text-orange-50 leading-relaxed max-w-xs">
            {isRegister
              ? '¿Ya cuidás patitas con nosotros? Ingresá para ver novedades en tu zona.'
              : 'Registrate para reportar mascotas perdidas y ayudar a reunirlas con sus familias.'}
          </p>
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="rounded-full border-2 border-white px-8 py-2.5 font-bold text-xs tracking-wide transition hover:bg-white hover:text-[#FF7A59] active:scale-95"
          >
            {isRegister ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </motion.div>

        {/* Lado Izquierdo: Formulario de Iniciar Sesión */}
        <div className="absolute left-0 top-0 h-full w-1/2">
          <LoginForm onSuccess={onLoginSuccess} />
        </div>

        {/* Lado Derecho: Formulario de Registro */}
        <div className="absolute right-0 top-0 h-full w-1/2">
          <RegisterForm onSuccess={onRegisterSuccess} />
        </div>

      </div>
    </div>
  );
}