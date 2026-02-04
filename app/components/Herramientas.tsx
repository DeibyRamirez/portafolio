"use client";

import Image from "next/image";
import { Box, Code, Cpu, Gamepad2, Layers, PenTool, Zap } from "lucide-react";

interface HerramientasProps {
  lenguajes: string[];
  frameworks: string[];
  librerias: string[];
  tipo: "movil" | "web" | "game_dev";

}

export default function Herramientas({ lenguajes, frameworks, librerias, tipo }: HerramientasProps) {
  const iconClass = "w-5 h-5 text-yellow-500";

  // Render para Móvil (Mantiene todas las librerías)
  if (tipo === "movil") {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-yellow-500 pb-2 inline-block">
          Tecnologías que utilizo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Lenguajes */}

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Code className={iconClass} />
              <h2 className="text-xl font-semibold text-gray-800">Lenguajes</h2>
            </div>
            <ul className="space-y-2">
              {lenguajes.map((lenguaje, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-700">{lenguaje}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Frameworks */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Layers className={iconClass} />
              <h2 className="text-xl font-semibold text-gray-800">Frameworks</h2>
            </div>
            <ul className="space-y-2">
              {frameworks.map((framework, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-700">{framework}</span>
                </li>
              ))}
            </ul>
          </div>


          {/* Librerías */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Zap className={iconClass} />
              <h2 className="text-xl font-semibold text-gray-800">Librerías</h2>
            </div>
            <ul className="space-y-2">
              {librerias.map((libreria, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-700">{libreria}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // RENDER WEB Y GAME DEV
  // Limitamos a 5 si es web, si es gamedev mostramos todas (Blender, Aseprite, etc)
  const libreriasAMostrar = tipo === "web" ? librerias.slice(0, 5) : librerias;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-yellow-500 pb-2 inline-block">
        {tipo === "game_dev" ? "Pipeline de Desarrollo" : "Tecnologías que utilizo"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Columna 1: Lenguajes / Motor */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            {tipo === "game_dev" ? <Gamepad2 className={iconClass} /> : <Code className={iconClass} />}
            <h2 className="text-shadow-xs font-semibold text-gray-800">
              {tipo === "game_dev" ? "Motor & Lógica" : "Lenguajes"}
            </h2>
          </div>
          <ul className="space-y-2">
            {lenguajes.map((l, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-gray-700">{l}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 2: Frameworks / 3D Tools */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            {tipo === "game_dev" ? <Box className={iconClass} /> : <Layers className={iconClass} />}
            <h2 className="text-shadow-xs font-semibold text-gray-800">
              {tipo === "game_dev" ? "Modelado & Arte" : "Frameworks"}
            </h2>
          </div>
          <ul className="space-y-2">
            {frameworks.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-gray-700">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Librerías (Limitadas a 5 en WEB) */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            {tipo === "game_dev" ? <PenTool className="w-6 h-6 text-yellow-500" /> : <Layers className="w-6 h-6 text-yellow-500" />}
            <h2 className="text-shadow-xs font-semibold text-gray-800">
              {tipo === "game_dev" ? "Texture / UI" : "Librerías"}
            </h2>
          </div>
          <ul className="space-y-2">
            {libreriasAMostrar.map((lib, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span className="text-gray-700">{lib}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

