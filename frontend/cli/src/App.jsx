import { useState } from "react";
import { motion } from "framer-motion";

export default function AuthSlider() {
  const [isRegister, setIsRegister] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-[#F7F4EE] overflow-hidden font-['Nunito',sans-serif]">
      
      {/* Importación directa de fuentes: Quicksand (títulos) y Nunito (cuerpo/inputs) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Quicksand:wght@600;700;800&display=swap');
        .font-heading { font-family: 'Quicksand', sans-serif; }
      `}</style>

      {/* Trama de fondo */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232D3748' fill-opacity='0.4'%3E%3Cpath d='M20 15c-2 0-3 1-4 3s0 4 2 5 4 0 5-2-1-6-3-6zm-10 1c-1.5 0-2.5 1-3 2.5s.5 3.5 2 4 3.5-.5 4-2-1.5-4.5-3-4.5zm5 9c-3 0-5 2.5-5 5.5s2 5 5 5 5-2 5-5-2-5.5-5-5.5zm45 25c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7zm-4-8c-1.5 0-2.5 1-3 2.5s.5 3.5 2 4 3.5-.5 4-2-1.5-4.5-3-4.5zm8 0c-1.5 0-2.5 1-3 2.5s.5 3.5 2 4 3.5-.5 4-2-1.5-4.5-3-4.5zm-38 23c-2 0-3.5 1.5-3.5 3.5s1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '90px 90px'
        }}
      />

      {/* Contenedor principal */}
      <div className="relative z-10 flex h-[520px] w-[860px] overflow-hidden rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border border-[#EFE9E1]">
        
        {/* ================= PANEL DESLIZANTE (SALMÓN) ================= */}
        <motion.div
          className="absolute top-0 left-0 z-20 flex h-full w-1/2 flex-col items-center justify-center bg-[#FF7A59] p-10 text-center text-white"
          animate={{ x: isRegister ? "0%" : "100%" }}
          transition={{ type: "spring", stiffness: 75, damping: 15 }}
        >
          <span className="text-4xl mb-2 select-none">🐾</span>
          <h2 className="font-heading text-3xl font-extrabold mb-3 tracking-tight">
            {isRegister ? "¡Hola de nuevo!" : "¡Sumate a la red!"}
          </h2>
          <p className="mb-8 text-sm font-medium text-orange-50 leading-relaxed max-w-xs">
            {isRegister
              ? "¿Ya cuidás mascotas con nosotros? Ingresá para ver novedades en tu zona."
              : "Registrate para reportar mascotas perdidas y ayudar a reunirlas con sus familias."}
          </p>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-heading rounded-full border-2 border-white px-8 py-2.5 font-bold text-sm tracking-wide transition hover:bg-white hover:text-[#FF7A59] active:scale-95"
          >
            {isRegister ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </motion.div>

        {/* ================= FORMULARIO 1: INICIAR SESIÓN (LADO IZQUIERDO) ================= */}
        <div className="absolute left-0 flex h-full w-1/2 flex-col items-center justify-center p-10">
          <h3 className="font-heading text-2xl font-bold mb-1 text-[#2D3748]">Iniciar Sesión</h3>
          <p className="text-xs font-semibold text-[#718096] mb-6">Ingresá tus datos para continuar</p>
          
          <input
            type="email"
            placeholder="Correo electrónico"
            className="mb-4 w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] px-4 py-3 text-sm text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
          />

          {/* Campo Contraseña con botón de visualización */}
          <div className="relative mb-6 w-full">
            <input
              type={showLoginPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] pl-4 pr-11 py-3 text-sm text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
            />
            <button
              type="button"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
              aria-label={showLoginPassword ? "Ocultar contraseña" : "Ver contraseña"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#FF7A59] transition-colors focus:outline-none"
            >
              {showLoginPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <button className="font-heading w-full rounded-xl bg-[#FF7A59] py-3 font-bold text-white text-sm shadow-md transition hover:bg-[#ff6842] active:scale-[0.98]">
            Entrar a Yirando
          </button>
        </div>

        {/* ================= FORMULARIO 2: CREAR CUENTA (LADO DERECHO) ================= */}
        <div className="absolute right-0 flex h-full w-1/2 flex-col items-center justify-center p-10">
          <h3 className="font-heading text-2xl font-bold mb-1 text-[#2D3748]">Crear Cuenta</h3>
          <p className="text-xs font-semibold text-[#718096] mb-6">Sé parte de la comunidad de rescate</p>
          
          <input
            type="text"
            placeholder="Nombre y Apellido"
            className="mb-3.5 w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="mb-3.5 w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] px-4 py-2.5 text-sm text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
          />

          {/* Campo Contraseña con botón de visualización */}
          <div className="relative mb-5 w-full">
            <input
              type={showRegisterPassword ? "text" : "password"}
              placeholder="Contraseña"
              className="w-full rounded-xl bg-[#FDFBF7] border border-[#E2E8F0] pl-4 pr-11 py-2.5 text-sm text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all duration-200 focus:-translate-y-0.5 focus:shadow-md focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
            />
            <button
              type="button"
              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              aria-label={showRegisterPassword ? "Ocultar contraseña" : "Ver contraseña"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#FF7A59] transition-colors focus:outline-none"
            >
              {showRegisterPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <button className="font-heading w-full rounded-xl bg-[#FF7A59] py-3 font-bold text-white text-sm shadow-md transition hover:bg-[#ff6842] active:scale-[0.98]">
            Registrarme Gratis
          </button>
        </div>

      </div>
    </div>
  );
}