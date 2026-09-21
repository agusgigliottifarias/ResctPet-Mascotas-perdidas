import React from 'react';

/**
 * Componente visual para activar/desactivar filtro por proximidad geográfica (Radio 5 km)
 */
export default function FiltroCercania({
  activo = false,
  cargando = false,
  radioKm = 5,
  onToggle,
  error = null
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggle}
          disabled={cargando}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
            activo
              ? 'bg-[#2EC4B6]/15 border-[#2EC4B6] text-[#2EC4B6] shadow-xs'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          } ${cargando ? 'opacity-60 cursor-wait' : ''}`}
        >
          <span className="text-sm">📍</span>
          <span>{cargando ? 'Localizando...' : `Cerca de mí (${radioKm} km)`}</span>
          {activo && (
            <span className="w-2 h-2 rounded-full bg-[#2EC4B6] animate-pulse"></span>
          )}
        </button>

        {activo && (
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Radio: {radioKm} km
          </span>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-amber-600 font-medium pl-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}