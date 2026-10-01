import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registrarUsuario, loginUsuario } from "../../api/authApi";

export default function AuthSlider({ isOpen, onClose, onSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Estados de Login (Tarjeta 1.2.1)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Estados de Registro
  const [regNombre, setRegNombre] = useState("");
  const [regApellido, setRegApellido] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  if (!isOpen) return null;

  // Manejador del Login (Criterios de la HU 1.2.1)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Ingresá tu correo electrónico y contraseña.");
      return;
    }

    try {
      setLoginLoading(true);
      const usuario = await loginUsuario({
        email: loginEmail,
        password: loginPassword
      });

      localStorage.setItem("user", JSON.stringify(usuario));
      if (onSuccess) onSuccess(usuario, `¡Hola de nuevo, ${usuario.nombre}!`);
      if (onClose) onClose();
    } catch (err) {
      // Informa si las credenciales son incorrectas o no está registrado
      setLoginError(err.message || "Credenciales incorrectas o usuario no registrado.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Manejador del Registro (Conexión al backend Spring Boot)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError(null);

    if (!regNombre.trim() || !regApellido.trim() || !regEmail.trim() || !regPassword) {
      setRegError("Todos los campos son obligatorios.");
      return;
    }

    if (regPassword.length < 6) {
      setRegError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setRegLoading(true);
      const res = await registrarUsuario({
        nombre: regNombre,
        apellido: regApellido,
        email: regEmail,
        password: regPassword
      });

      const usuarioCreado = res.data || res;
      localStorage.setItem("user", JSON.stringify(usuarioCreado));
      if (onSuccess) onSuccess(usuarioCreado, `¡Bienvenido/a, ${usuarioCreado.nombre}!`);
      if (onClose) onClose();
    } catch (err) {
      setRegError(err.response?.data?.message || err.message || "Error al registrar el usuario.");
    } finally {
      setRegLoading(false);
    }
  };

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

        {/* Tarjeta principal con Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 flex h-[540px] w-[860px] overflow-hidden rounded-[36px] bg-white/85 backdrop-blur-2xl shadow-[0_30px_70px_-15px_rgba(45,55,72,0.22)] border border-white/90 ring-1 ring-black/5"
        >
          {/* Botón de cierre (✕) */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-40 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#718096] border border-white/80 hover:bg-white hover:text-[#2D3748] transition-all cursor-pointer shadow-sm"
          >
            ✕
          </button>

          {/* ================= PANEL DESLIZANTE (NARANJA YIRANDO) ================= */}
          <motion.div
            className="absolute top-0 left-0 z-30 flex h-full w-1/2 flex-col items-center justify-center bg-[#FF7A59] p-10 text-center text-white shadow-2xl"
            animate={{ x: isRegister ? "0%" : "100%" }}
            transition={{ type: "spring", stiffness: 85, damping: 16 }}
          >
            <span className="text-4xl mb-2 select-none">🐾</span>
            <h2 className="font-heading text-3xl font-extrabold mb-3 tracking-tight">
              {isRegister ? "¡Hola de nuevo!" : "¡Sumate a la red!"}
            </h2>
            <p className="mb-7 text-xs font-medium text-orange-50 leading-relaxed max-w-xs">
              {isRegister
                ? "¿Ya tenés una cuenta en Yirando? Iniciá sesión para continuar ayudando a las mascotas."
                : "Registrate para reportar mascotas perdidas y reunirlas con sus familias."}
            </p>
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setLoginError(null);
                setRegError(null);
              }}
              className="font-heading rounded-full border-2 border-white px-7 py-2 font-bold text-xs tracking-wide transition hover:bg-white hover:text-[#FF7A59] active:scale-95 shadow-sm cursor-pointer"
            >
              {isRegister ? "Ir a Iniciar Sesión" : "Crear Cuenta Nueva"}
            </button>
          </motion.div>

          {/* ================= FORMULARIO 1: INICIAR SESIÓN (IZQUIERDA) ================= */}
          <div className="absolute left-0 top-0 flex h-full w-1/2 flex-col items-center justify-center p-9">
            <h3 className="font-heading text-2xl font-bold mb-0.5 text-[#2D3748]">Iniciar Sesión</h3>
            <p className="text-xs font-semibold text-[#718096] mb-4">Ingresá tus datos para continuar</p>

            {loginError && (
              <div className="mb-3 w-full rounded-xl bg-red-500/10 p-2 text-[11px] font-bold text-red-600 border border-red-500/20 text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="w-full space-y-3">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full rounded-xl bg-white/70 border border-white/80 px-4 py-2.5 text-xs text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all focus:bg-white focus:border-[#FF7A59]"
              />

              <div className="relative w-full">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full rounded-xl bg-white/70 border border-white/80 pl-4 pr-11 py-2.5 text-xs text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all focus:bg-white focus:border-[#FF7A59]"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#FF7A59] text-xs font-bold cursor-pointer"
                >
                  {showLoginPassword ? "Ocultar" : "Ver"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="font-heading w-full rounded-xl bg-[#FF7A59] py-3 font-bold text-white text-xs shadow-md transition-all hover:bg-[#ff6842] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? "Verificando..." : "Entrar a Yirando"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[11px] font-bold text-gray-500 hover:text-[#2D3748] transition-colors cursor-pointer pt-1"
              >
                Continuar como invitado
              </button>
            </form>
          </div>

          {/* ================= FORMULARIO 2: CREAR CUENTA (DERECHA) ================= */}
          <div className="absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center p-9">
            <h3 className="font-heading text-2xl font-bold mb-0.5 text-[#2D3748]">Crear Cuenta</h3>
            <p className="text-xs font-semibold text-[#718096] mb-4">Sé parte de la comunidad de rescate</p>

            {regError && (
              <div className="mb-3 w-full rounded-xl bg-red-500/10 p-2 text-[11px] font-bold text-red-600 border border-red-500/20 text-center">
                {regError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="w-full space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  placeholder="Nombre"
                  className="w-full rounded-xl bg-white/70 border border-white/80 px-3 py-2 text-xs text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all focus:bg-white focus:border-[#FF7A59]"
                />
                <input
                  type="text"
                  value={regApellido}
                  onChange={(e) => setRegApellido(e.target.value)}
                  placeholder="Apellido"
                  className="w-full rounded-xl bg-white/70 border border-white/80 px-3 py-2 text-xs text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all focus:bg-white focus:border-[#FF7A59]"
                />
              </div>

              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Correo electrónico"
                className="w-full rounded-xl bg-white/70 border border-white/80 px-3 py-2 text-xs text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all focus:bg-white focus:border-[#FF7A59]"
              />

              <div className="relative w-full">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Contraseña (mín. 6 caracteres)"
                  className="w-full rounded-xl bg-white/70 border border-white/80 pl-3 pr-11 py-2 text-xs text-[#2D3748] font-medium placeholder-[#A0AEC0] outline-none transition-all focus:bg-white focus:border-[#FF7A59]"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#FF7A59] text-xs font-bold cursor-pointer"
                >
                  {showRegisterPassword ? "Ocultar" : "Ver"}
                </button>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="font-heading w-full rounded-xl bg-[#FF7A59] py-2.5 font-bold text-white text-xs shadow-md transition-all hover:bg-[#ff6842] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {regLoading ? "Registrando..." : "Registrarme Gratis"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[11px] font-bold text-gray-500 hover:text-[#2D3748] transition-colors cursor-pointer pt-1"
              >
                Continuar como invitado
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}