"use client";

import { useMemo, useState } from "react";
import type { DesarrolloInterface } from "@/app/models/Desarrollos";
import LineHeading from "../motion/LineHeading";
import { MicroRule } from "../motion/Micro";
import Reveal from "../motion/Reveal";
import { AREAS, unicos } from "./content";
import Kicker from "./Kicker";

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
          <li key={item} className="border border-white/20 px-3 py-1.5 text-sm text-silver">
            {item}
          </li>
        ))}
      </ul>
      {items.length > 8 ? (
        <button
          type="button"
          className="mt-4 min-h-11 text-sm font-semibold text-light underline-offset-4 hover:underline"
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
    <section id="stack" aria-labelledby="stack-titulo" className="scroll-mt-28 border-t border-white/10 px-5 py-20 md:px-8 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[90rem]">
        <Kicker index="04" label="Oficio" />
        <LineHeading id="stack-titulo" lines={["Stack."]} className="mt-5 text-[clamp(2.4rem,6vw,5.4rem)]" />
        <Reveal className="mt-6 max-w-[36ch]">
          <p className="text-base leading-[1.65] text-silver md:text-lg">Cinco frentes. Las herramientas salen de los proyectos publicados.</p>
        </Reveal>

        <div className="mt-14 border-t border-white/15">
          {AREAS.map((area, index) => (
            <article key={area.tipo} className="relative grid gap-3 border-b border-white/15 py-7 md:grid-cols-12 md:gap-8 md:py-8">
              <p className="font-mono text-[11px] tracking-[0.16em] text-silver md:col-span-2">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.03em] md:col-span-4">{area.titulo}</h3>
              <p className="max-w-[40ch] text-silver md:col-span-6">{area.detalle}</p>
              <MicroRule />
            </article>
          ))}
        </div>

        {hayHerramientas ? (
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {grupos.map((grupo) => (
              <Grupo key={grupo.titulo} titulo={grupo.titulo} items={grupo.items} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
