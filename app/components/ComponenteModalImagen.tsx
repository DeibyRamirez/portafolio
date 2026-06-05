"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface ComponenteModalImagenProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ComponenteModalImagen: React.FC<ComponenteModalImagenProps> = ({
  src,
  alt,
  onClose,
}) => {
  // Manejar el cierre al presionar 'Esc'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Si no estamos en el navegador, no renderizar nada
  if (typeof window === "undefined") return null;

  const modalRoot = document.body; // Renderizamos en el body

  if (!modalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-neutral-900/90 backdrop-blur-sm transition-opacity duration-300 overflow-hidden"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo oscuro
    >
      {/* Barra de herramientas superior (como en tu ejemplo) */}
      <div
        className="relative flex items-center justify-between p-4 bg-neutral-950/80 border-b border-neutral-800 shadow-lg text-neutral-300 z-[110]"
        onClick={(e) => e.stopPropagation()} // Evita que el clic aquí cierre el modal
      >
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
            <ZoomOut className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-neutral-800 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
          <span className="text-sm">Vista a Tamaño Completo</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Botón de cerrar con el icono 'X' */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-white text-sm"
          >
            Cerrar <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenedor de la Imagen Expandida */}
      <div
        className="flex-1 flex items-center justify-center p-6 relative z-[105]"
        onClick={(e) => e.stopPropagation()} // Evita que el clic aquí cierre el modal
      >
        <div className="relative w-full h-full max-w-7xl max-h-screen bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border-4 border-neutral-800 p-2">
          <div className="w-full h-full rounded-lg overflow-auto flex items-center justify-center p-2 bg-black">
            <Image
              src={src}
              alt={alt}
              width={1920} // Un ancho grande por defecto para calidad
              height={1080}
              // 🌟 CAMBIO CLAVE: Usa object-contain para mostrar la imagen completa y permitir scroll si es necesario
              className="object-contain w-auto h-auto max-w-full max-h-full"
            />
          </div>
        </div>
      </div>
    </div>,
    modalRoot // Apuntamos al cuerpo del documento
  );
};

export default ComponenteModalImagen;