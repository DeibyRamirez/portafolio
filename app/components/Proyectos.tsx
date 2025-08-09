"use client";
import Image from "next/image";
import { Github } from "lucide-react";
import { useState, useEffect } from "react";

interface ProyectosProps {
  titulo: string;
  descripcion: string;
  imagen: string[];
  repositorio: string;
  tipo: "movil" | "web";
}

export default function Proyectos({
  titulo,
  descripcion,
  imagen,
  repositorio,
  tipo,
}: ProyectosProps) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    // Solo configuramos el intervalo si hay más de una imagen
    if (imagen.length <= 1) return;

    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagen.length);
    }, 4000); // Cambia cada 4 segundos

    // Limpiamos el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalo);
  }, [imagen.length]);

  if (tipo === "movil") {
    return (
      <div className="h-full flex flex-col transform transition-transform duration-500 hover:scale-105">
        {/* Carrusel */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imagen[indice]}
            alt={`Imagen ${indice + 1}`}
            fill
            className="object-cover transition-all duration-500"
            priority={indice === 0} // Prioriza la carga de la primera imagen
          />
          {/* Indicadores de posición (puntos) */}
          {imagen.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {imagen.map((_, i) => (
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

  // Versión para tipo web (sin carrusel)
  return (
    <div className="h-full flex flex-col transform transition-transform duration-500 group-hover:scale-105">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={imagen[0]}
          alt="Imagen de Proyecto Web"
          fill
          className="object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
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
            <Github className="w-4 h-4" /> Repositorio
          </a>
        </div>
      </div>
    </div>
  );
}