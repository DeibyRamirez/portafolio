"use client";

import LineHeading from "../motion/LineHeading";
import { PERSONA, TRAYECTORIA } from "./content";

export default function Experience() {
  return (
    <section id="trayectoria" aria-labelledby="trayectoria-titulo" className="relative z-[1] scroll-mt-28 px-6 py-32 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Recorrido</p>
          <LineHeading
            id="trayectoria-titulo"
            lines={["Trayectoria."]}
            className="mt-4 text-[clamp(2.6rem,7.2vw,6.4rem)]"
          />
          <p className="mt-6 max-w-[28ch] text-lg text-silver">
            Cada frente corresponde a trabajo publicado o a formación que ya está en el archivo.
          </p>
        </div>
        <div className="md:col-span-7">
          <ol className="border-l-[3px] border-graphite">
            {TRAYECTORIA.map((item) => (
              <li key={item.titulo} className="relative py-8 pl-8">
                <span
                  className="absolute -left-[3.5px] top-10 h-[7px] w-[7px] rounded-full bg-light shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                  aria-hidden="true"
                />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">{item.kicker}</p>
                <h3 className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.025em]">
                  {item.titulo}
                </h3>
                <p className="mt-3 max-w-[40ch] text-silver">{item.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.025em]">{PERSONA.nombre}</p>
          <p className="mt-1 text-sm text-silver">{PERSONA.rol}</p>
        </div>
      </div>
    </section>
  );
}
