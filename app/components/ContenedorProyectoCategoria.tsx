"use client";

import { createContext, useContext, useState } from "react";
import { DesarrolloInterface } from "@/app/models/Desarrollos";
import { convertirGSUrl } from "@/app/components/Conversion";

type TipoProyecto = NonNullable<DesarrolloInterface["tipo"]>;

interface ProyectoCategoriaContextValue {
  proyecto: DesarrolloInterface | null;
  imagenes: string[];
}

const ProyectoCategoriaContext = createContext<ProyectoCategoriaContextValue | null>(null);

export function useProyectoCategoria() {
  const context = useContext(ProyectoCategoriaContext);
  if (!context) {
    throw new Error("useProyectoCategoria debe usarse dentro de ContenedorProyectoCategoria");
  }
  return context;
}

interface ContenedorProyectoCategoriaProps {
  proyectos: DesarrolloInterface[];
  tipo: TipoProyecto;
  children: React.ReactNode;
}

export default function ContenedorProyectoCategoria({
  proyectos,
  tipo,
  children,
}: ContenedorProyectoCategoriaProps) {
  const [indice, setIndice] = useState(0);
  const indiceValido = proyectos.length > 0 ? Math.min(indice, proyectos.length - 1) : 0;
  const proyecto = proyectos[indiceValido] ?? null;
  const imagenes = proyecto?.imagenes.map((img) => convertirGSUrl(img)) ?? [];

  const selector =
    proyectos.length > 1 ? (
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label={`Proyectos de ${tipo}`}
      >
        {proyectos.map((item, i) => (
          <button
            key={item.id ?? item.titulo}
            type="button"
            role="tab"
            aria-selected={i === indiceValido}
            onClick={() => setIndice(i)}
            className={`
              rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
              ${
                i === indiceValido
                  ? "bg-yellow-500 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-yellow-400 hover:text-yellow-700"
              }
            `}
          >
            {item.titulo}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <ProyectoCategoriaContext.Provider value={{ proyecto, imagenes }}>
      {selector && <div className="mb-8 flex justify-center">{selector}</div>}
      {children}
    </ProyectoCategoriaContext.Provider>
  );
}
