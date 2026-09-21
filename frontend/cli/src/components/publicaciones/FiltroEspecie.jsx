import React from 'react';
import { ESPECIE } from '../../constants/mascotas';

/**
 * Componente atómico para filtrado por especie (Fase 1: Perros y Gatos)
 * Cumple con los criterios de accesibilidad y selección mutuamente excluyente.
 */
export default function FiltroEspecie({
  especieSeleccionada = '',
  onCambiarEspecie,
  disabled = false
}) {
  const opciones = [
    { valor: '', etiqueta: 'Todas', icono: '🐾' },
    { valor: ESPECIE.PERRO, etiqueta: 'Perros', icono: '🐶' },
    { valor: ESPECIE.GATO, etiqueta: 'Gatos', icono: '🐱' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-2xl border border-gray-200/60 shadow-inner">
      {opciones.map((opcion) => {
        const esActivo = especieSeleccionada === opcion.valor;
        return (
          <button
            key={opcion.valor || 'todas'}
            type="button"
            disabled={disabled}
            onClick={() => onCambiarEspecie(opcion.valor)}
            aria-pressed={esActivo}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
              esActivo
                ? 'bg-white text-[#2D3748] shadow-sm scale-[1.02] border border-black/5'
                : 'text-gray-500 hover:text-[#2D3748] hover:bg-white/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-sm">{opcion.icono}</span>
            <span>{opcion.etiqueta}</span>
          </button>
        );
      })}
    </div>
  );
}