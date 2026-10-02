import { useState } from "react";
import ModalPublicacion from "./components/publicaciones/ModalPublicacion";
import DetallePublicacion from "./components/publicaciones/DetallePublicacion";
import BusquedaPublicaciones from "./components/publicaciones/BusquedaPublicaciones";
import DockNavegacion from "./components/layout/DockNavegacion";
import MapaPrincipal from "./components/mapa/MapaPrincipal";
import AuthSlider from "./components/auth/AuthSlider";
import PerfilUsuario from "./components/perfil/PerfilUsuario";

export default function App() {
  // Estado del usuario activo
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    try {
      const guardado = localStorage.getItem('user');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Si no hay sesión, se abre el slider al entrar (pero se puede cerrar para explorar como invitado)
  const [isAuthOpen, setIsAuthOpen] = useState(() => {
    return !localStorage.getItem('user');
  });

  // Estado para la vista de información del usuario (Tarea 1.3.1)
  const [isPerfilOpen, setIsPerfilOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [refrescoKey, setRefrescoKey] = useState(0);

  const [activeTab, setActiveTab] = useState('inicio');
  const [detalleId, setDetalleId] = useState(null);

  const handleSuccess = () => {
    setSuccessMessage("¡Publicación creada exitosamente!");
    setRefrescoKey((prev) => prev + 1);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleAuthExitoso = (usuario, mensaje) => {
    setUsuarioLogueado(usuario);
    setSuccessMessage(mensaje || `¡Bienvenido/a, ${usuario.nombre}!`);
    setIsAuthOpen(false);
    setActiveTab('inicio');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUsuarioLogueado(null);
    setIsPerfilOpen(false);
    setActiveTab('inicio');
    setSuccessMessage("Sesión cerrada correctamente.");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <div className="relative h-screen w-screen bg-[#F7F4EE] overflow-hidden select-none">
      {/* Toast de confirmación */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-emerald-500 text-white px-5 py-3 shadow-lg font-bold text-sm animate-bounce">
          {successMessage}
        </div>
      )}

      {/* 1. MAPA PRINCIPAL */}
      <MapaPrincipal
        refrescoKey={refrescoKey}
        onSelectPublicacion={(id) => setDetalleId(id)}
      />

      {/* 2. DOCK LATERAL FLOTANTE */}
      <DockNavegacion
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'inicio') setDetalleId(null);
          if (tab === 'perfil') {
            if (!usuarioLogueado) {
              setIsAuthOpen(true);
            } else {
              setIsPerfilOpen(true);
            }
          }
        }}
        onPublicarClick={() => setIsModalOpen(true)}
      />

      {/* 3. ISLA DE BÚSQUEDA Y LISTA DE 5 */}
      {activeTab === 'buscar' && (
        <BusquedaPublicaciones
          isOpen={true}
          mostrarEnInicio={false}
          refrescoKey={refrescoKey}
          onClose={() => setActiveTab('inicio')}
          onSelectPublicacion={(id) => setDetalleId(id)}
        />
      )}

      {/* 4. BRANDING YIRANDO CON LOGO DEL PERRO A LA IZQUIERDA */}
      {activeTab === 'inicio' && !detalleId && (
        <div className="fixed top-6 left-28 z-20 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/80 pointer-events-auto flex items-center gap-3">
            <img 
              src="/logo-Yira.svg" 
              alt="Logo Yirando" 
              className="w-10 h-10 object-contain drop-shadow-xs"
            />
            <div>
              <h1 className="text-2xl font-black text-[#2D3748] leading-none">
                <span className="text-[#1A202C]">Yira</span>
                <span className="text-[#FF7A59]">ndo</span>
              </h1>
              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                Mascotas perdidas y encontradas
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. PANEL DE DETALLE */}
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

      {/* 7. SLIDER DE AUTENTICACIÓN (LOGIN + REGISTRO) */}
      <AuthSlider
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setActiveTab('inicio');
        }}
        onSuccess={handleAuthExitoso}
      />

      {/* 8. VISTA DE INFORMACIÓN DEL USUARIO (TAREA 1.3.1) */}
      <PerfilUsuario
        isOpen={isPerfilOpen}
        onClose={() => {
          setIsPerfilOpen(false);
          setActiveTab('inicio');
        }}
        usuario={usuarioLogueado}
        onLogout={handleLogout}
      />
    </div>
  );
}