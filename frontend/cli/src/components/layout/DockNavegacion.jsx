import React from 'react';
import huellaPublicarSvg from '../../assets/huella-publicar.svg';

export default function DockNavegacion({
  activeTab = 'inicio',
  onSelectTab,
  onPublicarClick
}) {
  const posicionesCirculo = {
    inicio: 'top-[20px]',
    buscar: 'top-[92px]',
    chat: 'top-[268px]',
    perfil: 'top-[340px]'
  };

  const posicionActual = posicionesCirculo[activeTab] || posicionesCirculo.inicio;

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed left-5 top-1/2 -translate-y-1/2 z-40 flex items-center select-none"
    >
      <div className="relative w-[84px] h-[416px] bg-white/95 backdrop-blur-xl rounded-[44px] border border-white/90 shadow-[0_20px_50px_-10px_rgba(45,55,72,0.18)] flex flex-col items-center justify-between py-5 px-2">
        
        {/* Círculo deslizante */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#D9D9D9]/50 transition-all duration-300 ease-out pointer-events-none ${posicionActual}`}
        />

        {/* 1. INICIO */}
        <div className="relative flex items-center group z-10">
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('inicio')}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer text-[#2D3748] hover:scale-105 active:scale-95"
            aria-label="Inicio"
          >
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 114 125" fill="none">
              <path
                d="M52.348 2.046C53.545 0.651 55.704 0.651 56.901 2.046L110.24 64.196C111.909 66.142 110.527 69.15 107.963 69.15H103.037V114.081C103.036 120.156 98.111 125.081 92.037 125.081H16C9.925 125.081 5 120.156 5 114.081V69.15H1.286C-1.278 69.15 -2.66 66.142 -0.99 64.196L6.034 56.011C6.888 54.187 8.225 52.636 9.883 51.525L52.348 2.046Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/80 shadow-md text-xs font-bold text-[#1A202C] whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            Inicio
          </div>
        </div>

        {/* 2. BÚSQUEDA */}
        <div className="relative flex items-center group z-10">
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('buscar')}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer text-[#2D3748] hover:scale-105 active:scale-95"
            aria-label="Buscar publicaciones"
          >
            <svg className="w-7 h-7 transition-transform group-hover:scale-110" viewBox="0 0 100 115" fill="none">
              <circle cx="56" cy="45" r="38" stroke="currentColor" strokeWidth="6" fill="transparent" />
              <path d="M28 73L4 97" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              <path d="M42 22C52 18 64 19 72 24" stroke="#FF7A59" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </button>
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/80 shadow-md text-xs font-bold text-[#1A202C] whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            Buscar publicaciones
          </div>
        </div>

        {/* 3. PUBLICAR (HUELLA) */}
        <div className="relative flex items-center group z-20 my-1">
          <button
            type="button"
            onClick={() => onPublicarClick && onPublicarClick()}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-[0_8px_20px_rgba(255,122,89,0.35)]"
            aria-label="Publicar Mascota"
          >
            <img
              src={huellaPublicarSvg}
              alt="Publicar Mascota"
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </button>
          <div className="absolute left-full ml-3 px-3.5 py-1.5 bg-[#FF7A59] text-white rounded-xl shadow-lg text-xs font-black whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            Publicar Mascota
          </div>
        </div>

        {/* 4. CHAT */}
        <div className="relative flex items-center group z-10">
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('chat')}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer text-[#2D3748] hover:scale-105 active:scale-95"
            aria-label="Mensajes y Chat"
          >
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 150 110" fill="none">
              <path
                d="M106 5C125 5 141 21 141 40C141 60 125 75 106 75H60L12 103V65C5 59 1 49 1 40C1 21 17 5 36 5H106Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/80 shadow-md text-xs font-bold text-[#1A202C] whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            Mensajes y Chat
          </div>
        </div>

        {/* 5. PERFIL */}
        <div className="relative flex items-center group z-10">
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('perfil')}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer text-[#2D3748] hover:scale-105 active:scale-95"
            aria-label="Mi Perfil"
          >
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="30" r="22" stroke="currentColor" strokeWidth="8" />
              <path d="M10 90C10 68 28 58 50 58C72 58 90 68 90 90" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200/80 shadow-md text-xs font-bold text-[#1A202C] whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
            Mi Perfil
          </div>
        </div>

      </div>
    </nav>
  );
}