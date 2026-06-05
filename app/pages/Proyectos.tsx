"use client";
import { Boxes, Gamepad2, Github, Trophy, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ProyectosInterface } from "../models/Proyectos";

export default function Proyectos({
  titulo,
  descripcion,
  imagenes,
  repositorio,
  tipo,
}: ProyectosInterface) {
  const [indice, setIndice] = useState(0);
  // Estado para capturar la imagen que se expandirá a tamaño completo
  const [imagenModal, setImagenModal] = useState<string | null>(null);

  useEffect(() => {
    if (!imagenes || imagenes.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenes.length);
    }, 4000);

    return () => clearInterval(intervalo);
  }, [imagenes?.length]);

  // Renderizado del componente Modal usando Portals
  const renderModal = () => {
    if (!imagenModal || typeof window === "undefined") return null;

    return createPortal(
      <div 
        className="fixed inset-0 z-[150] flex flex-col bg-neutral-950/95 backdrop-blur-sm overflow-hidden select-none"
        onClick={() => setImagenModal(null)}
      >
        {/* Barra superior de herramientas */}
        <div 
          className="w-full flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 shadow-xl text-neutral-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white">
              <ZoomOut className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white">
              <ZoomIn className="w-5 h-5" />
            </button>
            <span className="text-xs md:text-sm font-medium tracking-wide text-neutral-400 truncate max-w-xs md:max-w-md">
              {titulo} — Vista de Inspección
            </span>
          </div>
          <button
            onClick={() => setImagenModal(null)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg transition-all text-white text-sm font-semibold shadow-md"
          >
            Cerrar <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lienzo central de la imagen */}
        <div 
          className="flex-1 flex items-center justify-center p-4 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-full max-w-7xl bg-black rounded-2xl overflow-hidden border border-neutral-800 p-2 shadow-2xl flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={imagenModal}
                alt="Visualización ampliada del proyecto"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Capa interactiva reutilizable para hacer las imágenes clickeables
  const BotonExpandir = ({ src }: { src: string }) => (
    <button
      onClick={() => setImagenModal(src)}
      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 cursor-pointer z-30"
    >
      <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
      <span className="text-white text-xs font-semibold tracking-wide drop-shadow-md">
        Click para expandir pantalla
      </span>
    </button>
  );

  /* ================= RENDER: MÓVIL ================= */
  if (tipo === "movil") {
    const imagenActual = imagenes ? imagenes[indice] : "";
    return (
      <div className="h-full flex flex-col transform transition-transform duration-500 hover:scale-105">
        <div className="relative h-48 overflow-hidden group">
          <Image
            src={imagenActual}
            alt={`Imagen ${indice + 1}`}
            fill
            className="object-cover transition-all duration-500"
            priority={indice === 0}
          />
          <BotonExpandir src={imagenActual} />
          {imagenes && imagenes.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {imagenes.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === indice ? "bg-yellow-500 w-4" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h1>
          <p className="text-gray-600 mb-4 flex-1">{descripcion}</p>
          <div className="flex gap-3">
            <a
              href={repositorio}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 text-sm"
            >
              <Github className="w-4 h-4" /> Código
            </a>
          </div>
        </div>
        {renderModal()}
      </div>
    );
  }

  /* ================= RENDER: GAME DEV ================= */
  if (tipo === "game_dev") {
    const imagenActual = imagenes ? imagenes[indice] : "";
    return (
      <div className="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
        <div className="relative h-64 overflow-hidden group">
          <Image
            src={imagenActual}
            alt={titulo}
            fill
            className="object-cover transition-opacity duration-1000"
          />
          <BotonExpandir src={imagenActual} />
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="flex items-center gap-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
              <Trophy className="w-3 h-3" /> Global Game Jam Popayán
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40 z-10 pointer-events-none" />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Gamepad2 className="text-yellow-500 w-5 h-5" />
            <h1 className="text-2xl font-bold text-white">{titulo}</h1>
          </div>
          <p className="text-gray-400 mb-6 flex-1 text-sm leading-relaxed line-clamp-4">
            {descripcion}
          </p>
          <div className="flex justify-between items-center">
             <div className="flex gap-2">
                <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">3D</span>
                <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">First-Person</span>
             </div>
            <a
              href={repositorio}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm"
            >
              <Github className="w-4 h-4" /> Ver Proyecto
            </a>
          </div>
        </div>
        {renderModal()}
      </div>
    );
  }

  /* ================= RENDER: AUTOMATIZACIÓN (Optimizado para n8n) ================= */
  if (tipo === "automatizacion") {
    const imagenActual = imagenes ? imagenes[indice] : "";
    return (
      <div className="flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.01]">
        {/* Contenedor adaptado con object-contain para no cortar el flujo horizontal */}
        <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] bg-gray-950 p-4 overflow-hidden flex items-center justify-center group">
          <Image
            src={imagenActual}
            alt={titulo}
            fill
            className="object-contain p-2 transition-opacity duration-1000"
          />
          {/* Al dar clic aquí, n8n se abrirá en la interfaz idéntica a tu captura */}
          <BotonExpandir src={imagenActual} />
          
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <span className="flex items-center gap-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
              <Trophy className="w-3 h-3" /> n8n Automatización
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col bg-gray-900 border-t border-neutral-800">
          <div className="flex items-center gap-2 mb-3">
            <Boxes className="text-yellow-500 w-7 h-7 flex-shrink-0" />
            <h1 className="text-2xl font-bold text-white">{titulo}</h1>
          </div>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            {descripcion}
          </p>
          <div className="flex justify-between items-center mt-auto">
             <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-medium bg-gray-800 text-yellow-500 px-2.5 py-1 rounded border border-gray-700">n8n</span>
                <span className="text-[10px] font-medium bg-gray-800 text-blue-400 px-2.5 py-1 rounded border border-gray-700">IA Local</span>
             </div>
            <a
              href={repositorio}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm shadow-md"
            >
              <Github className="w-4 h-4" /> Ver Proyecto
            </a>
          </div>
        </div>
        {renderModal()}
      </div>
    );
  }

  /* ================= RENDER: WEB ================= */
  const imagenWeb = imagenes?.[0] ?? "";
  return (
    <div className="h-full flex flex-col md:flex-row transform transition-transform duration-500 hover:scale-105">
      <div className="relative w-full md:w-1/2 h-48 md:h-56 lg:h-64 overflow-hidden flex-shrink-0 group">
        <Image
          src={imagenWeb}
          alt={titulo || "Imagen de Proyecto Web"}
          fill
          className="object-cover transition-transform duration-500"
          priority
        />
        <BotonExpandir src={imagenWeb} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
      </div>

      <div className="p-4 w-full md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h1>
          <p className="text-gray-600 mb-4 line-clamp-3 md:line-clamp-4">{descripcion}</p>
        </div>

        <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded-full">Web</span>
          </div>

          <a
            href={repositorio}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 text-sm"
          >
            <Github className="w-4 h-4" /> Repositorio
          </a>
        </div>
      </div>
      {renderModal()}
    </div>
  );
}