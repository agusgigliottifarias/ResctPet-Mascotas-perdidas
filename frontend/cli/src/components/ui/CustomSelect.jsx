import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({
  value,
  onChange,
  options,
  activeColor = '#FF7A59',
  disabled = false,
  placeholder = 'Seleccionar',
  searchable = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) return options;
    const normalized = searchTerm.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(normalized));
  }, [options, searchTerm, searchable]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition-all duration-200 shadow-sm ${
          disabled
            ? 'bg-black/5 border-black/5 text-[#A0AEC0] cursor-not-allowed'
            : 'bg-white/60 backdrop-blur-md border-white/80 text-[#2D3748] hover:bg-white/80 focus:bg-white/90'
        }`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-[#718096] shrink-0 ml-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/90 p-1.5 shadow-[0_18px_35px_-10px_rgba(45,55,72,0.22)] ring-1 ring-black/5"
          >
            {/* Buscador superior reactivo al color del formulario */}
            {searchable && (
              <div className="p-1 pb-1.5 border-b border-black/5">
                <div
                  className="relative flex items-center rounded-lg bg-[#F7F4EE]/80 px-2.5 py-1.5 border transition-all duration-200"
                  style={{
                    borderColor: isFocused ? activeColor : 'rgba(0,0,0,0.08)',
                    boxShadow: isFocused ? `0 0 0 2px ${activeColor}20` : 'none',
                    backgroundColor: isFocused ? '#FFFFFF' : 'rgba(247,244,238,0.8)'
                  }}
                >
                  {/* Icono de Lupa */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 shrink-0 mr-1.5 transition-colors duration-200"
                    style={{ color: isFocused ? activeColor : '#A0AEC0' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>

                  <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Buscar..."
                    className="w-full bg-transparent text-xs text-[#2D3748] font-medium outline-none placeholder-[#A0AEC0]"
                  />
                </div>
              </div>
            )}

            <ul className="max-h-44 overflow-y-auto mt-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      style={{
                        backgroundColor: isSelected ? `${activeColor}18` : 'transparent',
                        color: isSelected ? activeColor : '#2D3748'
                      }}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 hover:bg-[#F7F4EE] select-none"
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && (
                        <span className="text-xs font-black ml-2" style={{ color: activeColor }}>
                          ✓
                        </span>
                      )}
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-2 text-center text-xs text-[#A0AEC0] italic select-none">
                  No se encontraron resultados
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}