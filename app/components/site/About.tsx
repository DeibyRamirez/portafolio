"use client";

import { useRef } from "react";
import Image from "next/image";
import LineHeading from "../motion/LineHeading";
import Reveal from "../motion/Reveal";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { MANIFIESTO } from "./content";
import Kicker from "./Kicker";

function Manifiesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = MANIFIESTO.split(" ");

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".word-lit", { opacity: 1 });
        return;
      }
      gsap.to(".word-lit", {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          end: "bottom 48%",
          scrub: 0.5,
        },
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className="mt-6 text-[clamp(1.55rem,3.6vw,2.8rem)] font-semibold leading-[1.2] tracking-[-0.03em]">
      <span className="sr-only">{MANIFIESTO}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="relative mr-[0.28em] inline-block">
            <span className="text-dim">{word}</span>
            <span className="word-lit absolute inset-0 text-light opacity-0">{word}</span>
          </span>
        ))}
      </span>
    </p>
  );
}

export default function About() {
  return (
    <section id="perfil" aria-labelledby="perfil-titulo" className="scroll-mt-28 border-t border-white/10 px-5 py-20 md:px-8 md:py-28 lg:py-32">
      <div className="mx-auto grid max-w-[90rem] items-end gap-10 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <figure className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-coal">
            <Image
              src="/YO.jpg"
              alt="Retrato de Deiby Ramirez, ingeniero de software."
              fill
              sizes="(max-width: 768px) 100vw, 36vw"
              loading="lazy"
              fetchPriority="low"
              className="object-cover grayscale"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 bg-carbon px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-light">
              <span>Fig. 01 · Retrato</span>
              <span>Deiby Ramirez</span>
            </figcaption>
          </figure>
        </div>
        <div className="md:col-span-7">
          <Kicker index="02" label="Perfil" />
          <LineHeading
            id="perfil-titulo"
            lines={["Ingeniería", "con criterio."]}
            className="mt-5 text-[clamp(2.4rem,6vw,5.4rem)]"
          />
          <Manifiesto />
          <Reveal className="mt-8 max-w-[46ch]">
            <p className="text-base leading-[1.65] text-silver md:text-lg">
              Me muevo entre el desarrollo móvil, la web, los videojuegos y la automatización. Cuido que la interfaz se entienda, que la lógica aguante y que el dato esté donde corresponde.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
