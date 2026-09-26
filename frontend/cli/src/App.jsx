import { useState } from "react";
import ModalPublicacion from "./components/publicaciones/ModalPublicacion";
import DetallePublicacion from "./components/publicaciones/DetallePublicacion";
import BusquedaPublicaciones from "./components/publicaciones/BusquedaPublicaciones";

export default function App() {
  // Estado para el modal de crear publicación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [refrescoKey, setRefrescoKey] = useState(0); // Contador para refrescar el listado automáticamente

  // Estados para Búsqueda y Detalle
  const [isBusquedaOpen, setIsBusquedaOpen] = useState(true);
  const [detalleId, setDetalleId] = useState(null);

  const handleSuccess = () => {
    setSuccessMessage("¡Publicación enviada exitosamente!");
    setRefrescoKey((prev) => prev + 1); // Dispara la recarga automática de la lista
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="relative h-screen w-screen bg-[#F7F4EE] overflow-hidden flex">
      {/* Toast de éxito */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 text-white px-5 py-3 shadow-lg font-bold text-sm animate-bounce">
          {successMessage}
        </div>
      )}

      {/* 1. Panel de Búsqueda de Publicaciones */}
      {isBusquedaOpen && (
        <BusquedaPublicaciones
          isOpen={isBusquedaOpen}
          refrescoKey={refrescoKey}
          onClose={() => setIsBusquedaOpen(false)}
          onSelectPublicacion={(id) => {
            setDetalleId(id);
          }}
        />
      )}

      {/* 2. Área Central / Espacio del Mapa */}
      <main className="flex-1 h-full p-8 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#2D3748]">
            <span className="text-[#1A202C]">Yira</span>
            <span className="text-[#FF7A59]">ndo</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Mascotas perdidas y encontradas</p>
        </div>

        {/* Botones de control inferiores */}
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <button
            onClick={() => setIsBusquedaOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full bg-white border border-[#E2ECE4] text-[#2D3748] px-5 py-3 font-bold text-sm shadow-md hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
          >
            <span>🔍</span>
            <span>{isBusquedaOpen ? "Ocultar Búsqueda" : "Abrir Búsqueda"}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#FF7A59] text-white px-6 py-3 font-bold text-sm shadow-[0_8px_20px_rgba(255,122,89,0.35)] hover:bg-[#ff6842] active:scale-95 transition-all cursor-pointer"
          >
            <span>🐾</span> Publicar Mascota
          </button>
        </div>
      </main>

      {/* 3. Panel de Detalle de Publicación */}
      {detalleId && (
        <div className="fixed top-4 bottom-4 right-4 z-40">
          <DetallePublicacion
            publicacionId={detalleId}
            onClose={() => setDetalleId(null)}
          />
        </div>
      )}

      {/* 4. Modal de Crear Publicación */}
      <ModalPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}