import { useState } from "react";
import AuthSlider from "./components/auth/AuthSlider";
import ModalPublicacion from "./components/publicaciones/ModalPublicacion";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSuccess = () => {
    setSuccessMessage("¡Publicación enviada exitosamente!");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Mensaje toast de éxito */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 text-white px-5 py-3 shadow-lg font-bold text-sm">
          {successMessage}
        </div>
      )}

      {/* Botón flotante para abrir el modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#FF7A59] text-white px-6 py-3 font-bold text-sm shadow-[0_8px_20px_rgba(255,122,89,0.35)] hover:bg-[#ff6842] active:scale-95 transition-all"
      >
        <span>🐾</span> Publicar Mascota
      </button>

      {/* Pantalla base de login/registro */}
      <AuthSlider />

      {/* Modal de Crear Publicación */}
      <ModalPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        onOpenMapPicker={() => alert("Próximamente: Selector de mapa interactivo")}
      />
    </div>
  );
}