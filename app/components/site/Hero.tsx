"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { DesarrolloInterface } from "@/app/models/Desarrollos";
import Chars from "../motion/Chars";
import { MagneticLink } from "../motion/Magnetic";
import { gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { destacar, etiquetaTipo, FRASES, indice, PERSONA } from "./content";

function RoleLine({ text, hidden }: { text: string; hidden?: boolean }) {
  return (
    <span className={`role-line absolute inset-x-0 top-0 block ${hidden ? "is-next" : "is-current"}`}>
      {Array.from(text).map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span className="role-char inline-block">{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </span>
  );
}

export default function Hero({ proyectos }: { proyectos: DesarrolloInterface[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const destacados = destacar(proyectos);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      if (reduced) return;

      const timeline = gsap.timeline();
      timeline.from(".hero-char", {
        yPercent: 110,
        rotateX: -55,
        opacity: 0,
        stagger: 0.028,
        duration: 1.1,
        ease: "power4.out",
      });
      timeline.from(".hero-kicker, .hero-role, .hero-lead", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.55");
      timeline.from(".hero-cta a, .hero-cta button", { y: 18, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.06 }, "-=0.6");
      timeline.from(".hero-feature", { y: 18, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.45");

      const lines = roleRef.current?.querySelectorAll<HTMLElement>(".role-line");
      let timer = 0;
      if (lines && lines.length > 1) {
        let index = 0;
        timer = window.setInterval(() => {
          const current = lines[index];
          const nextIndex = (index + 1) % lines.length;
          const next = lines[nextIndex];
          gsap.to(current.querySelectorAll(".role-char"), {
            yPercent: -105,
            opacity: 0,
            stagger: 0.012,
            duration: 0.5,
            ease: "power2.in",
          });
          gsap.fromTo(
            next.querySelectorAll(".role-char"),
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, stagger: 0.022, duration: 0.85, ease: "power4.out" },
          );
          index = nextIndex;
        }, 3800);
      }

      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => {
        gsap.to(".hero-content", {
          yPercent: -18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      return () => {
        window.clearInterval(timer);
        media.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section id="inicio" ref={rootRef} className="relative z-[1] flex min-h-[100dvh] flex-col overflow-x-clip px-6 pb-8 pt-28 md:px-8">
      <div className="hero-content mx-auto flex w-full max-w-7xl flex-col">
        <p className="hero-kicker flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-brass">
          <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
          {PERSONA.marca}
        </p>
        <h1
          className="mt-6 max-w-[12ch] text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.025em]"
          style={{ perspective: "800px" }}
        >
          <span className="sr-only">{PERSONA.nombre}, ingeniero de software.</span>
          <span aria-hidden="true" className="block">
            <Chars text="Deiby" />
          </span>
          <span aria-hidden="true" className="block">
            <Chars text="Ramirez" />
          </span>
        </h1>
        <p
          ref={roleRef}
          aria-hidden="true"
          className="hero-role relative mt-6 min-h-[1.35em] overflow-hidden text-[clamp(1.25rem,5vw,2.6rem)] font-semibold leading-none tracking-[-0.025em] text-light"
        >
          {FRASES.map((frase, index) => (
            <RoleLine key={frase} text={frase} hidden={index !== 0} />
          ))}
        </p>
        <p className="hero-lead mt-6 max-w-[34ch] text-lg leading-relaxed text-silver md:text-xl">
          Diseño y construyo productos móviles, web y juegos, y automatizo el trabajo que se repite. Código claro, entrega que se puede usar.
        </p>
        <div className="hero-cta mt-8 flex flex-wrap gap-3">
          <MagneticLink href="#proyectos">Ver proyectos</MagneticLink>
          <MagneticLink href="#contacto" variant="secondary">
            Contacto
          </MagneticLink>
        </div>
      </div>

      {destacados.length > 0 ? (
        <div className="hero-feature mx-auto mt-14 w-full max-w-7xl md:mt-auto md:pt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Selección</p>
          <ol className="mt-3 divide-y divide-white/15 border-y border-white/15">
            {destacados.map((proyecto, index) => (
              <li key={proyecto.id ?? proyecto.titulo}>
                <a
                  href={`#proyecto-${proyecto.id ?? index}`}
                  className="group flex flex-wrap items-center gap-x-4 gap-y-1 py-4"
                >
                  <span className="w-8 text-xs font-semibold tracking-[0.14em] text-silver">{indice(index + 1)}</span>
                  <span className="min-w-0 flex-1 text-lg font-semibold tracking-[-0.025em] text-light md:text-2xl">
                    {proyecto.titulo}
                  </span>
                  <span className="text-sm text-silver">{etiquetaTipo(proyecto.tipo)}</span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-silver transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </section>
  );
}
