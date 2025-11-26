"use client";

import Image from "next/image";
import { Code, Cpu, Layers, Zap } from "lucide-react";

interface HerramientasProps {
  lenguajes: string[];
  frameworks: string[];
  librerias: string[];
  tipo: "movil" | "web";
}

export default function Herramientas({ lenguajes, frameworks, librerias, tipo }: HerramientasProps) {
  const iconClass = "w-5 h-5 text-yellow-500";
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
  else {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-yellow-500 pb-2 inline-block">
          Tecnologías que utilizo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lenguajes */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-start gap-3 mb-4 w-full">
              <Code className="w-5 h-5" color="#facc15" /> 
              <h2 className="text-xl font-semibold text-gray-800">
                Lenguajes
              </h2>
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
            <div className="flex items-center justify-start gap-3 mb-4 w-full">
              <Layers className={iconClass} />
              <h2 className="text-xl font-semibold text-gray-800">
                Frameworks
              </h2>
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
            <div className="flex items-center justify-start gap-3 mb-4 w-full">
              <Zap className={iconClass} />
              <h2 className="text-xl font-semibold text-gray-800">
                Librerías
              </h2>
            </div>

            <ul className="space-y-2">
              {librerias.slice(0, 5).map((libreria, index) => (
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
}
