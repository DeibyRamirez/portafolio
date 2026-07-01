"use client";

import { useState } from "react";
import { Box, Code, Gamepad2, Layers, PenTool, Zap, ChevronDown } from "lucide-react";
import { HerramientasInterface } from "../models/Herramientas";

interface SeccionProps {
  icono: React.ReactNode;
  titulo: string;
  items: string[];
  defaultOpen?: boolean;
}

function Seccion({ icono, titulo, items, defaultOpen = false }: SeccionProps) {
  const [abierto, setAbierto] = useState(defaultOpen);

  return (
    <div
      className={`
        rounded-xl border border-gray-100 overflow-hidden
        transition-shadow duration-300
        ${abierto ? "shadow-lg" : "shadow-sm hover:shadow-md"}
      `}
    >
      {/* Cabecera clickeable */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full bg-white px-6 py-4 flex items-center justify-between group cursor-pointer"
        aria-expanded={abierto}
      >
        <div className="flex items-center gap-3">
          <span
            className={`
              flex items-center justify-center w-9 h-9 rounded-lg
              transition-colors duration-300
              ${abierto ? "bg-yellow-500 text-white" : "bg-yellow-50 text-yellow-500 group-hover:bg-yellow-100"}
            `}
          >
            {icono}
          </span>
          <span className="text-base font-semibold text-gray-800">{titulo}</span>
          <span
            className={`
              ml-1 text-xs font-medium px-2 py-0.5 rounded-full
              transition-colors duration-300
              ${abierto ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-500"}
            `}
          >
            {items.length}
          </span>
        </div>

        <ChevronDown
          className={`
            w-5 h-5 text-gray-400 transition-transform duration-300 ease-in-out flex-shrink-0
            ${abierto ? "rotate-180 text-yellow-500" : ""}
          `}
        />
      </button>

      {/* Panel desplegable con animación CSS */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${abierto ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <ul className="bg-gray-50 border-t border-gray-100 px-6 py-4 space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-3 py-1"
              style={{
                animationDelay: abierto ? `${i * 40}ms` : "0ms",
              }}
            >
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0" />
              <span className="text-sm text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Herramientas({
  lenguajes,
  frameworks,
  librerias,
  tipo,
}: HerramientasInterface) {
  const iconSize = "w-5 h-5";

  // Configuración por tipo
  const secciones = (() => {
    if (tipo === "game_dev") {
      return [
        {
          icono: <Gamepad2 className={iconSize} />,
          titulo: "Motor & Lógica",
          items: lenguajes,
        },
        {
          icono: <Box className={iconSize} />,
          titulo: "Modelado & Arte",
          items: frameworks,
        },
        {
          icono: <PenTool className={iconSize} />,
          titulo: "Texture / UI",
          items: librerias,
        },
      ];
    }

    if (tipo === "movil") {
      return [
        {
          icono: <Code className={iconSize} />,
          titulo: "Lenguajes",
          items: lenguajes,
        },
        {
          icono: <Layers className={iconSize} />,
          titulo: "Frameworks",
          items: frameworks,
        },
        {
          icono: <Zap className={iconSize} />,
          titulo: "Librerías",
          items: librerias,
        },
      ];
    }

    if (tipo === "automatizacion") {
      return [
        {
          icono: <Code className={iconSize} />,
          titulo: "Lenguajes & Scripts",
          items: lenguajes,
        },
        {
          icono: <Layers className={iconSize} />,
          titulo: "Orquestación",
          items: frameworks,
        },
        {
          icono: <Zap className={iconSize} />,
          titulo: "Integraciones",
          items: librerias,
        },
      ];
    }

    if (tipo === "ciberseguridad") {
      return [
        {
          icono: <Code className={iconSize} />,
          titulo: "Herramientas",
          items: lenguajes,
        },
        {
          icono: <Layers className={iconSize} />,
          titulo: "Metodologías",
          items: frameworks,
        },
        {
          icono: <Zap className={iconSize} />,
          titulo: "Plataformas",
          items: librerias,
        },
      ];
    }

    // web (por defecto): limita librerías a 5
    return [
      {
        icono: <Code className={iconSize} />,
        titulo: "Lenguajes",
        items: lenguajes,
      },
      {
        icono: <Layers className={iconSize} />,
        titulo: "Frameworks",
        items: frameworks,
      },
      {
        icono: <Zap className={iconSize} />,
        titulo: "Librerías",
        items: librerias.slice(0, 5),
      },
    ];
  })();

  const titulo =
    tipo === "game_dev"
      ? "Pipeline de Desarrollo"
      : tipo === "automatizacion"
        ? "Stack de Automatización"
        : tipo === "ciberseguridad"
          ? "Stack de Seguridad"
          : "Tecnologías que utilizo";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-yellow-500 pb-2 inline-block">
        {titulo}
      </h1>

      <div className="flex flex-col gap-3">
        {secciones.map((seccion, i) => (
          <Seccion
            key={i}
            icono={seccion.icono}
            titulo={seccion.titulo}
            items={seccion.items}
            defaultOpen={i === 0} // La primera sección empieza abierta
          />
        ))}
      </div>
    </div>
  );
}