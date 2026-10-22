"use client";

import { useState } from "react";
import Image from "next/image";
import type { CertificadoInterface } from "@/app/models/Certificados";
import LineHeading from "../motion/LineHeading";
import { imagenPublica, PERSONA } from "./content";
import Dialog from "./Dialog";

export default function Certificates({ certificados }: { certificados: CertificadoInterface[] }) {
  const [activo, setActivo] = useState<CertificadoInterface | null>(null);
  const imagenActiva = activo ? imagenPublica(activo.imagen) : null;

  return (
    <section id="certificados" aria-labelledby="certificados-titulo" className="relative z-[1] scroll-mt-28 px-6 py-32 md:px-8 md:py-40">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Evidencia</p>
        <LineHeading
          id="certificados-titulo"
          lines={["Certificados."]}
          className="mt-4 text-[clamp(2.6rem,7.2vw,6.4rem)]"
        />
        <p className="mt-6 max-w-[34ch] text-lg text-silver">
          Formación que respalda el oficio, tomada del archivo del portafolio.
        </p>

        {certificados.length === 0 ? (
          <p className="mt-12 text-lg text-silver">Aún no hay certificados publicados.</p>
        ) : (
          <ul className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {certificados.map((certificado) => {
              const imagen = imagenPublica(certificado.imagen);
              const institucion = certificado.institucion || "Institución";
              const fecha = certificado.fecha || "";
              return (
                <li key={certificado.id ?? certificado.titulo}>
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-coal">
                    <button
                      type="button"
                      className="relative block aspect-[4/3] w-full bg-carbon text-left"
                      onClick={() => setActivo(certificado)}
                    >
                      {imagen ? (
                        <Image
                          src={imagen}
                          alt={`Certificado ${certificado.titulo}, ${institucion}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain p-3"
                        />
                      ) : null}
                      <span className="sr-only">Ampliar certificado</span>
                    </button>
                    <div className="flex flex-1 flex-col p-6">
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
          <a
            href={PERSONA.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-light underline-offset-4 hover:underline"
          >
            LinkedIn
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
          .
        </p>
      </div>

      <Dialog open={Boolean(activo)} title={activo?.titulo ?? "Certificado"} onClose={() => setActivo(null)}>
        {imagenActiva ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-carbon">
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
