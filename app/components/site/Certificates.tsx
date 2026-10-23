"use client";

import { useState } from "react";
import Image from "next/image";
import type { CertificadoInterface } from "@/app/models/Certificados";
import LineHeading from "../motion/LineHeading";
import { Lift } from "../motion/Micro";
import Reveal from "../motion/Reveal";
import { imagenPublica, PERSONA } from "./content";
import Dialog from "./Dialog";
import Kicker from "./Kicker";

export default function Certificates({ certificados }: { certificados: CertificadoInterface[] }) {
  const [activo, setActivo] = useState<CertificadoInterface | null>(null);
  const imagenActiva = activo ? imagenPublica(activo.imagen) : null;

  return (
    <section id="certificados" aria-labelledby="certificados-titulo" className="scroll-mt-28 border-t border-white/10 px-5 py-20 md:px-8 md:py-28 lg:py-32">
      <div className="mx-auto max-w-[90rem]">
        <Kicker index="06" label="Evidencia" />
        <LineHeading id="certificados-titulo" lines={["Certificados."]} className="mt-5 text-[clamp(2.2rem,5.6vw,5.4rem)]" />
        <Reveal className="mt-6 max-w-[36ch]">
          <p className="text-base leading-[1.65] text-silver md:text-lg">Formación que respalda el oficio, tomada del archivo del portafolio.</p>
        </Reveal>

        {certificados.length === 0 ? (
          <p className="mt-12 border border-white/15 px-5 py-8 text-base leading-[1.65] text-silver md:px-8 md:text-lg">
            Aún no hay certificados publicados.
          </p>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {certificados.map((certificado) => {
              const imagen = imagenPublica(certificado.imagen);
              const institucion = certificado.institucion || "Institución";
              const fecha = certificado.fecha || "";
              return (
                <li key={certificado.id ?? certificado.titulo}>
                  <article className="flex h-full flex-col border border-white/15 bg-coal">
                    <button type="button" className="relative block aspect-[4/3] w-full overflow-hidden bg-carbon text-left" onClick={() => setActivo(certificado)}>
                      {imagen ? (
                        <Lift>
                          <Image
                            src={imagen}
                            alt={`Certificado ${certificado.titulo}, ${institucion}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            loading="lazy"
                            fetchPriority="low"
                            className="object-contain p-3"
                          />
                        </Lift>
                      ) : (
                        <span className="absolute inset-0 grid place-items-center px-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                          Sin imagen
                        </span>
                      )}
                      <span className="sr-only">Ampliar certificado</span>
                    </button>
                    <div className="flex flex-1 flex-col border-t border-white/10 p-5">
                      <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em]">{certificado.titulo}</h3>
                      <p className="mt-4 flex items-center justify-between gap-3 text-sm text-silver">
                        <span>{institucion}</span>
                        {fecha ? <span>{fecha}</span> : null}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-10 text-silver">
          Hay más formación en{" "}
          <a href={PERSONA.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-light underline-offset-4 hover:underline focus-visible:underline">
            LinkedIn
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          .
        </p>
      </div>

      <Dialog open={Boolean(activo)} title={activo?.titulo ?? "Certificado"} onClose={() => setActivo(null)}>
        {imagenActiva ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
            <Image
              src={imagenActiva}
              alt={activo ? `Certificado ampliado: ${activo.titulo}` : "Certificado ampliado"}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
