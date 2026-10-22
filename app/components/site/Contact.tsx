"use client";

import { useState } from "react";
import LineHeading from "../motion/LineHeading";
import { MagneticButton, MagneticLink } from "../motion/Magnetic";
import { PERSONA } from "./content";
import Dialog from "./Dialog";

export default function Contact() {
  const [cvAbierto, setCvAbierto] = useState(false);

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="relative z-[1] scroll-mt-28 px-6 py-32 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Contacto</p>
        <LineHeading id="contacto-titulo" lines={["Hablemos."]} className="mt-4 text-[clamp(2.6rem,7.2vw,6.4rem)]" />
        <p className="mt-6 max-w-[32ch] text-lg text-silver md:text-xl">
          Si hay un producto que construir, un flujo que ordenar o un equipo que necesita ingeniería, conversemos.
        </p>
        <a
          href={`mailto:${PERSONA.email}`}
          className="mt-10 block max-w-full break-words text-[clamp(1.35rem,3.4vw,2.8rem)] font-semibold leading-tight tracking-[-0.025em] hover:text-silver"
        >
          {PERSONA.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticLink href={`mailto:${PERSONA.email}`}>Escribir</MagneticLink>
          <MagneticLink href={PERSONA.linkedin} variant="secondary" external>
            LinkedIn
          </MagneticLink>
          <MagneticLink href={PERSONA.github} variant="secondary" external>
            GitHub
          </MagneticLink>
          <MagneticButton variant="secondary" onClick={() => setCvAbierto(true)}>
            Currículum
          </MagneticButton>
        </div>
      </div>

      <Dialog open={cvAbierto} title="Currículum vitae" onClose={() => setCvAbierto(false)}>
        <iframe title="Currículum vitae de Deiby Ramirez" src={PERSONA.cv} className="h-[70vh] w-full rounded-2xl bg-light" />
        <a
          href={PERSONA.cv}
          download
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-light px-6 py-3 text-sm font-semibold text-carbon"
        >
          Descargar PDF
        </a>
      </Dialog>
    </section>
  );
}
