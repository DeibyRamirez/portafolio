"use client";

import { useMemo, useState } from "react";
import type { DesarrolloInterface } from "@/app/models/Desarrollos";
import LineHeading from "../motion/LineHeading";
import { AREAS, unicos } from "./content";

function Grupo({ titulo, items }: { titulo: string; items: string[] }) {
  const [abierto, setAbierto] = useState(false);
  if (items.length === 0) return null;
  const visibles = abierto ? items : items.slice(0, 8);
  const resto = items.length - visibles.length;

  return (
    <div>
      <h3 className="text-lg font-semibold tracking-[-0.02em]">{titulo}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {visibles.map((item) => (
          <li key={item} className="rounded-full border border-graphite px-3 py-1.5 text-sm text-silver">
            {item}
          </li>
        ))}
      </ul>
      {items.length > 8 ? (
        <button
          type="button"
          className="mt-4 min-h-11 text-sm font-semibold underline-offset-4 hover:underline"
          aria-expanded={abierto}
          onClick={() => setAbierto((value) => !value)}
        >
          {abierto ? "Ver menos" : `Ver ${resto} más`}
        </button>
      ) : null}
    </div>
  );
}

export default function Skills({ proyectos }: { proyectos: DesarrolloInterface[] }) {
  const grupos = useMemo(
    () => [
      { titulo: "Lenguajes", items: unicos(proyectos.flatMap((proyecto) => proyecto.lenguajes ?? [])) },
      { titulo: "Frameworks", items: unicos(proyectos.flatMap((proyecto) => proyecto.frameworks ?? [])) },
      { titulo: "Librerías", items: unicos(proyectos.flatMap((proyecto) => proyecto.librerias ?? [])) },
    ],
    [proyectos],
  );
  const hayHerramientas = grupos.some((grupo) => grupo.items.length > 0);

  return (
    <section id="stack" aria-labelledby="stack-titulo" className="relative z-[1] scroll-mt-28 px-6 py-32 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Oficio</p>
        <LineHeading id="stack-titulo" lines={["Stack."]} className="mt-4 text-[clamp(2.6rem,7.2vw,6.4rem)]" />
        <p className="mt-6 max-w-[34ch] text-lg text-silver">Cinco frentes. Las herramientas salen de los proyectos publicados.</p>

        <div className="mt-16 border-t border-graphite">
          {AREAS.map((area, index) => (
            <article key={area.tipo} className="grid gap-4 border-b border-graphite py-8 md:grid-cols-12 md:gap-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-silver md:col-span-2">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="text-[clamp(1.6rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.025em] md:col-span-4">
                {area.titulo}
              </h3>
              <p className="max-w-[36ch] text-silver md:col-span-6">{area.detalle}</p>
            </article>
          ))}
        </div>

        {hayHerramientas ? (
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {grupos.map((grupo) => (
              <Grupo key={grupo.titulo} titulo={grupo.titulo} items={grupo.items} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
