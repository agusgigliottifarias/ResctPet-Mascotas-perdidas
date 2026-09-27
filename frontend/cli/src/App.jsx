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

  const [activeTab, setActiveTab] = useState('inicio');
  const [detalleId, setDetalleId] = useState(null);

  const handleSuccess = () => {
    setSuccessMessage("¡Publicación creada exitosamente!");
    setRefrescoKey((prev) => prev + 1); // Dispara la recarga de pines en el mapa
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="relative h-screen w-screen bg-[#F7F4EE] overflow-hidden select-none">
      {/* Toast de confirmación */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 text-white px-5 py-3 shadow-lg font-bold text-sm animate-bounce">
          {successMessage}
        </div>
      )}

      {/* 1. MAPA PRINCIPAL: Pantalla completa en el fondo con todos los pines interactivos */}
      <MapaPrincipal
        refrescoKey={refrescoKey}
        onSelectPublicacion={(id) => setDetalleId(id)}
      />

      {/* 2. DOCK LATERAL FLOTANTE */}
      <DockNavegacion
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          // Si hace clic en inicio, cerramos cualquier detalle para ver el mapa limpio
          if (tab === 'inicio') setDetalleId(null);
        }}
        onPublicarClick={() => setIsModalOpen(true)}
      />

      {/* 3. ISLA DE BÚSQUEDA Y BENTO GRID: Solo cuando está activa la pestaña 'buscar' */}
      {activeTab === 'buscar' && (
        <BusquedaPublicaciones
          isOpen={true}
          mostrarEnInicio={false}
          refrescoKey={refrescoKey}
          onClose={() => setActiveTab('inicio')}
          onSelectPublicacion={(id) => setDetalleId(id)}
        />
      )}

      {/* 4. BRANDING YIRANDO (Visible en Inicio mientras no haya un detalle abierto) */}
      {activeTab === 'inicio' && !detalleId && (
        <div className="fixed top-6 left-28 z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-lg border border-white/80 pointer-events-auto">
            <h1 className="text-2xl font-black text-[#2D3748] leading-tight">
              <span className="text-[#1A202C]">Yira</span>
              <span className="text-[#FF7A59]">ndo</span>
            </h1>
            <p className="text-xs text-gray-500 font-semibold">Mascotas perdidas y encontradas</p>
          </div>
        </div>
      )}

      {/* 5. PANEL DE DETALLE COMPLETO (Se abre a la derecha al hacer clic en cualquier pin) */}
      {detalleId && (
        <div className="fixed top-6 bottom-6 right-6 z-40 animate-in fade-in slide-in-from-right-8 duration-300">
          <DetallePublicacion
            publicacionId={detalleId}
            onClose={() => setDetalleId(null)}
          />
        </div>
      )}

      {/* 6. MODAL DE CREAR PUBLICACIÓN */}
      <ModalPublicacion
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}