import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Rocket, Code, Layers, Server } from 'lucide-react';
import axiosClient from './api/axiosClient';

function HomePlaceholder() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel max-w-xl w-full p-8 rounded-3xl text-center space-y-6 border border-slate-800 shadow-2xl"
      >
        <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30">
          <Rocket className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Infraestructura React Lista
          </h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mt-2">
            Base limpia libre de Angular
          </p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          Toda la configuración legacy de Angular fue eliminada. La infraestructura base con <strong className="text-white">React 19</strong>, <strong className="text-white">Vite 6</strong>, <strong className="text-white">Tailwind CSS v4</strong>, <strong className="text-white">React Router 7</strong> y <strong className="text-white">Axios Client</strong> está lista para desarrollar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Code className="w-5 h-5 text-indigo-400 mb-2" />
            <h2 className="text-xs font-bold text-white">src/api/</h2>
            <p className="text-xs text-slate-400 mt-1">Axios client base a http://localhost:8080</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Layers className="w-5 h-5 text-indigo-400 mb-2" />
            <h2 className="text-xs font-bold text-white">src/components/</h2>
            <p className="text-xs text-slate-400 mt-1">Listo para tus propios componentes UI</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Server className="w-5 h-5 text-indigo-400 mb-2" />
            <h2 className="text-xs font-bold text-white">React Router</h2>
            <p className="text-xs text-slate-400 mt-1">Enrutamiento configurado en App.jsx</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        {/* Agrega tus rutas aquí cuando crees tus páginas */}
      </Routes>
    </BrowserRouter>
  );
}
