import { useState } from 'react';
import PasswordInput from './PasswordInput';

export default function RegisterForm({ onSuccess }) {
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Integración con el backend (RegisterRequest DTO)
      if (onSuccess) onSuccess(formData);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al procesar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-full flex-col items-center justify-center p-10">
      <h3 className="text-2xl font-black mb-1 text-[#2D3748] tracking-tight">Crear Cuenta</h3>
      <p className="text-xs text-[#718096] mb-6">Sé parte de la comunidad de rescate</p>

      {error && (
        <div className="mb-4 w-full rounded-2xl bg-red-500/10 backdrop-blur-md p-3 text-xs font-bold text-red-600 border border-red-500/20">
          {error}
        </div>
      )}

      <input
        type="text"
        required
        placeholder="Nombre y Apellido"
        value={formData.nombre}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        className="mb-3.5 w-full rounded-2xl bg-white/60 backdrop-blur-md border border-white/90 px-4 py-2.5 text-sm text-[#2D3748] outline-none transition-all duration-200 focus:bg-white/90 focus:-translate-y-0.5 focus:shadow-[0_8px_20px_rgba(255,122,89,0.15)] focus:border-[#FF7A59]"
      />

      <input
        type="email"
        required
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="mb-3.5 w-full rounded-2xl bg-white/60 backdrop-blur-md border border-white/90 px-4 py-2.5 text-sm text-[#2D3748] outline-none transition-all duration-200 focus:bg-white/90 focus:-translate-y-0.5 focus:shadow-[0_8px_20px_rgba(255,122,89,0.15)] focus:border-[#FF7A59]"
      />

      <PasswordInput
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="mb-5"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[#FF7A59] py-3 text-sm font-black text-white shadow-[0_8px_20px_rgba(255,122,89,0.3)] transition-all hover:bg-[#ff6842] active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? 'Registrando...' : 'Registrarme Gratis'}
      </button>
    </form>
  );
}