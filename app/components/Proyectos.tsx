"use client";
import { Gamepad2, Github, Trophy } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ProyectosProps {
  titulo: string;
  descripcion: string;
  imagenes: string[];
  repositorio: string;
  tipo: "movil" | "web" | "game_dev";
}

export default function Proyectos({
  titulo,
  descripcion,
  imagenes,
  repositorio,
  tipo,
}: ProyectosProps) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    // Solo configuramos el intervalo si hay más de una imagen
    if (imagenes.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenes.length);
    }, 4000); // Cambia cada 4 segundos

    // Limpiamos el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalo);
  }, [imagenes.length]);

  if (tipo === "movil") {
    return (
      <div className="h-full flex flex-col transform transition-transform duration-500 hover:scale-105">
        {/* Carrusel */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imagenes[indice]}
            alt={`Imagen ${indice + 1}`}
            fill
            className="object-cover transition-all duration-500"
            priority={indice === 0} // Prioriza la carga de la primera imagen
          />
          {/* Indicadores de posición (puntos) */}
          {imagenes.length > 1 && (
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
          {/* Gradiente para visibilidad de texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        </div>

        {/* Contenido del proyecto */}
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
      </div>
    );
  }


  // NUEVO: RENDER GAME DEV
  if (tipo === "game_dev") {
    return (
      <div className="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imagenes[indice]}
            alt={titulo}
            fill
            className="object-cover transition-opacity duration-1000"
          />
          <div className="absolute top-4 left-4 z-20">
            <span className="flex items-center gap-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
              <Trophy className="w-3 h-3" /> Global Game Jam Popayán
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black/40 z-10" />
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
              className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 text-sm"
            >
              <Github className="w-4 h-4" /> Ver Proyecto
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Versión para tipo web (sin carrusel)
  return (
    <div className="h-full flex flex-col md:flex-row transform transition-transform duration-500 hover:scale-105">
      <div className="relative w-full md:w-1/2 h-48 md:h-56 lg:h-64 overflow-hidden flex-shrink-0">
        <Image
          src={imagenes?.[0] ?? ""}
          alt={titulo || "Imagen de Proyecto Web"}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
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
    </div>
  );
}