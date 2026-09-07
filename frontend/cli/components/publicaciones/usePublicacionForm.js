import { useState } from 'react';
import ModalPublicacion from './components/publicaciones/ModalPublicacion';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleSuccess = () => {
    setFeedbackMessage('¡Publicación creada exitosamente en el servidor!');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#F7F4EE]">
      {feedbackMessage && (
        <div className="absolute top-6 z-50 rounded-2xl bg-[#2EC4B6] px-6 py-3 font-bold text-white shadow-xl">
          {feedbackMessage}
        </div>
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded-2xl bg-[#FF7A59] px-7 py-3.5 text-base font-extrabold text-white shadow-lg transition hover:bg-[#ff6842] active:scale-95"
      >
        + Publicar Mascota
      </button>

      <ModalPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        onOpenMapPicker={() => alert('Selector de mapa: pendiente de integración geográfica')}
      />
    </div>
  );
}