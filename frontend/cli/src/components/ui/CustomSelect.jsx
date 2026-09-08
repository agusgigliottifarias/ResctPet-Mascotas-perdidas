import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomSelect({ value, onChange, options, activeColor = '#FF7A59' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full rounded-xl bg-white/60 backdrop-blur-md border border-white/80 px-3 py-2 text-xs text-[#2D3748] font-semibold outline-none transition-all duration-200 focus:bg-white/90 hover:bg-white/80 shadow-sm"
      >
        <span className="truncate">{selectedOption?.label}</span>
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
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 overflow-hidden rounded-2xl bg-white/90 backdrop-blur-2xl border border-white/90 p-1.5 shadow-[0_18px_35px_-10px_rgba(45,55,72,0.22)] ring-1 ring-black/5 max-h-48 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  style={{
                    backgroundColor: isSelected ? `${activeColor}18` : 'transparent',
                    color: isSelected ? activeColor : '#2D3748'
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 hover:bg-[#F7F4EE] select-none ${
                    isSelected ? 'shadow-xs' : ''
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className="text-xs font-black ml-2" style={{ color: activeColor }}>
                      ✓
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}