import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";

interface ProyectosProps {
  titulo: string;
  descripcion: string;
  imagen: string;
  repositorio: string;
  tipo: "movil" | "web";
}

export default function Proyectos({ titulo, descripcion, imagen, repositorio, tipo }: ProyectosProps) {
  if (tipo === "movil") {
    return (
      <div className="h-full flex flex-col transform transition-transform duration-500 hover:scale-105">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imagen}
            alt="Imagen de Proyecto Móvil"
            fill
            className="object-cover transform transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent "></div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h1>
          <p className="text-gray-600 mb-4 flex-1">{descripcion}</p>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 text-sm">
              <Github className="w-4 h-4" /> Código
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col transform transition-transform duration-500 group-hover:scale-105">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={imagen}
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
          
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2 text-sm">
            <Github className="w-4 h-4" /> Repositorio
          </button>
        </div>
      </div>
    </div>
  );
}