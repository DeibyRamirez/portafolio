"use client";

import { useState } from "react";
import LineHeading from "../motion/LineHeading";
import { MagneticButton, MagneticLink } from "../motion/Magnetic";
import { PERSONA } from "./content";
import Dialog from "./Dialog";
import Kicker from "./Kicker";

export default function Contact() {
  const [cvAbierto, setCvAbierto] = useState(false);

  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="scroll-mt-28 border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[90rem]">
        <Kicker index="07" label="Contacto" />
        <LineHeading id="contacto-titulo" lines={["Hablemos."]} className="mt-4 text-[clamp(2.4rem,6vw,5.4rem)]" />
        <p className="mt-6 max-w-[36ch] text-lg text-silver md:text-xl">
          Si hay un producto que construir, un flujo que ordenar o un equipo que necesita ingeniería, conversemos.
        </p>
        <a
          href={`mailto:${PERSONA.email}`}
          className="mt-8 block max-w-full break-all text-[clamp(1.15rem,3vw,2.4rem)] font-semibold leading-tight tracking-[-0.03em]"
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
        <iframe title="Currículum vitae de Deiby Ramirez" src={PERSONA.cv} className="h-[70vh] w-full bg-light" />
        <a
          href={PERSONA.cv}
          download
          className="mt-4 inline-flex min-h-11 items-center bg-light px-5 py-3 text-sm font-semibold text-carbon"
        >
          Descargar PDF
        </a>
      </Dialog>
    </section>
  );
}
