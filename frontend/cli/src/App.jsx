import { useState } from "react";
import ModalPublicacion from "./components/publicaciones/ModalPublicacion";
import DetallePublicacion from "./components/publicaciones/DetallePublicacion";
import BusquedaPublicaciones from "./components/publicaciones/BusquedaPublicaciones";
import DockNavegacion from "./components/layout/DockNavegacion";
import MapaPrincipal from "./components/mapa/MapaPrincipal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [refrescoKey, setRefrescoKey] = useState(0);

  // Panel de Búsqueda y Detalle
  const [isBusquedaOpen, setIsBusquedaOpen] = useState(true);
  const [detalleId, setDetalleId] = useState(null);
  const [activeTab, setActiveTab] = useState('buscar');

  const handleSuccess = () => {
    setSuccessMessage("¡Publicación enviada exitosamente!");
    setRefrescoKey((prev) => prev + 1);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="relative h-screen w-screen bg-[#F7F4EE] overflow-hidden flex">
      {/* Toast de confirmación de éxito */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 text-white px-5 py-3 shadow-lg font-bold text-sm animate-bounce">
          {successMessage}
        </div>
      )}

      {/* 1. DOCK LATERAL FLOTANTE FIGMA (Maneja toda la navegación y el publicar) */}
      <DockNavegacion
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'buscar') {
            setIsBusquedaOpen(true);
          } else {
            setIsBusquedaOpen(false);
          }
        }}
        onPublicarClick={() => setIsModalOpen(true)}
      />

      {/* 2. PANEL LATERAL DE BÚSQUEDA */}
      {isBusquedaOpen && (
        <div className="ml-28 h-full z-30">
          <BusquedaPublicaciones
            isOpen={isBusquedaOpen}
            refrescoKey={refrescoKey}
            onClose={() => {
              setIsBusquedaOpen(false);
              setActiveTab('inicio');
            }}
            onSelectPublicacion={(id) => {
              setDetalleId(id);
            }}
          />
        </div>
      )}

      {/* 3. ÁREA CENTRAL: MAPA COMPLETO Y MARCA */}
      <main className="relative flex-1 h-full overflow-hidden">
        {/* Mapa Leaflet interactivo adaptado a tu paleta */}
        <MapaPrincipal
          refrescoKey={refrescoKey}
          onSelectPublicacion={(id) => setDetalleId(id)}
        />

        {/* Tarjeta flotante con el nombre de Yirando */}
        <div className={`absolute top-6 z-20 transition-all pointer-events-none ${!isBusquedaOpen ? 'left-28' : 'left-8'}`}>
          <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-lg border border-white/80 pointer-events-auto">
            <h1 className="text-2xl font-black text-[#2D3748] leading-tight">
              <span className="text-[#1A202C]">Yira</span>
              <span className="text-[#FF7A59]">ndo</span>
            </h1>
            <p className="text-xs text-gray-500 font-semibold">Mascotas perdidas y encontradas</p>
          </div>
        </div>
      </main>

      {/* 4. MODAL / DETALLE DE PUBLICACIÓN */}
      {detalleId && (
        <div className="fixed top-4 bottom-4 right-4 z-40">
          <DetallePublicacion
            id={detalleId}
            onClose={() => setDetalleId(null)}
          />
        </div>
      )}

      {/* 5. MODAL DE CREAR PUBLICACIÓN (Abierto desde la huella del Dock) */}
      <ModalPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}