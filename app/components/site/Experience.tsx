"use client";

import { useRef } from "react";
import LineHeading from "../motion/LineHeading";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { PERSONA, TRAYECTORIA } from "./content";
import Kicker from "./Kicker";

export default function Experience() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".rail-fill", { scaleY: 1 });
        return;
      }
      gsap.fromTo(
        ".rail-fill",
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 75%",
            end: "bottom 65%",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      id="trayectoria"
      ref={rootRef}
      aria-labelledby="trayectoria-titulo"
      className="scroll-mt-28 border-t border-white/10 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-[90rem] gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Kicker index="05" label="Recorrido" />
          <LineHeading id="trayectoria-titulo" lines={["Trayectoria."]} className="mt-4 text-[clamp(2.4rem,6vw,5.4rem)]" />
          <p className="mt-6 max-w-[30ch] text-lg text-silver">
            Cada frente corresponde a trabajo publicado o a formación que ya está en el archivo.
          </p>
        </div>
        <div className="md:col-span-7">
          <ol className="relative border-l border-white/15">
            <span className="rail-fill absolute bottom-0 left-[-1px] top-0 w-px origin-top scale-y-0 bg-light" aria-hidden="true" />
            {TRAYECTORIA.map((item) => (
              <li key={item.titulo} className="relative py-7 pl-8">
                <span className="absolute -left-[3.5px] top-9 h-1.5 w-1.5 rounded-full bg-light" aria-hidden="true" />
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-silver">{item.kicker}</p>
                <h3 className="mt-2 text-[clamp(1.45rem,2.6vw,2.15rem)] font-semibold leading-tight tracking-[-0.03em]">{item.titulo}</h3>
                <p className="mt-3 max-w-[46ch] text-silver">{item.texto}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-[clamp(1.45rem,2.6vw,2.15rem)] font-semibold tracking-[-0.03em]">{PERSONA.nombre}</p>
          <p className="mt-1 text-sm text-silver">{PERSONA.rol}</p>
        </div>
      </div>
    </section>
  );
}
