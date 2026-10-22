"use client";

import { useRef } from "react";
import Image from "next/image";
import LineHeading from "../motion/LineHeading";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { MANIFIESTO } from "./content";

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
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 78%",
          end: "bottom 45%",
          scrub: 0.6,
        },
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className="mt-8 text-[clamp(1.7rem,4.2vw,3.2rem)] font-semibold leading-[1.18] tracking-[-0.025em]">
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
    <section id="perfil" aria-labelledby="perfil-titulo" className="relative z-[1] scroll-mt-28 px-6 py-32 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-7xl items-end gap-12 md:grid-cols-12">
        <div className="order-2 md:order-1 md:col-span-5">
          <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-coal">
            <Image
              src="/YO.jpg"
              alt="Retrato de Deiby Ramirez, ingeniero de software."
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale transition-transform duration-[2400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon via-carbon/10 to-transparent" />
            <figcaption className="absolute bottom-5 left-5 text-sm font-semibold tracking-[-0.02em]">Deiby Ramirez</figcaption>
          </figure>
        </div>
        <div className="order-1 md:order-2 md:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Perfil</p>
          <LineHeading
            id="perfil-titulo"
            lines={["Ingeniería", "con criterio."]}
            className="mt-4 text-[clamp(2.6rem,7.2vw,6.4rem)]"
          />
          <Manifiesto />
          <p className="reveal mt-8 max-w-[38ch] text-base leading-relaxed text-silver md:text-lg">
            Me muevo entre el desarrollo móvil, la web, los videojuegos y la automatización. Cuido que la interfaz se entienda, que la lógica aguante y que el dato esté donde corresponde.
          </p>
        </div>
      </div>
    </section>
  );
}
