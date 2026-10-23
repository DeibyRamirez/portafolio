"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { DesarrolloInterface } from "@/app/models/Desarrollos";
import HeroStage from "../motion/HeroStage";
import { HoverX } from "../motion/Micro";
import { MagneticLink } from "../motion/Magnetic";
import { EASE_IN, EASE_OUT, EASE_SPRING, gsap, prefersReducedMotion, useGSAP } from "../motion/gsap";
import { AREAS, destacar, etiquetaTipo, FRASES, indice, PERSONA } from "./content";
import Kicker from "./Kicker";

function RoleLine({ text, hidden }: { text: string; hidden?: boolean }) {
  return (
    <span className={`role-line absolute inset-x-0 top-0 block whitespace-nowrap ${hidden ? "is-next" : "is-current"}`}>
      {Array.from(text).map((char, index) => (
        <span key={`${char}-${index}`} className="role-mask">
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
      if (prefersReducedMotion()) return;

      const timeline = gsap.timeline({ delay: 0.05 });
      timeline.from(".hero-kicker, .hero-lead, .hero-cta", {
        y: 14,
        opacity: 0,
        duration: 0.7,
        ease: EASE_OUT,
        stagger: 0.05,
      });

      const lines = roleRef.current?.querySelectorAll<HTMLElement>(".role-line");
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      let timer = 0;
      if (lines && lines.length > 1) {
        let index = 0;
        timer = window.setInterval(() => {
          if (document.hidden) return;
          const current = lines[index];
          const nextIndex = (index + 1) % lines.length;
          const next = lines[nextIndex];
          if (!current || !next) return;
          const leaving = current.querySelectorAll(".role-char");
          const entering = next.querySelectorAll(".role-char");
          gsap.killTweensOf(leaving);
          gsap.killTweensOf(entering);
          gsap.to(leaving, {
            yPercent: -105,
            opacity: 0,
            stagger: mobile ? 0.008 : 0.012,
            duration: 0.38,
            ease: EASE_IN,
            overwrite: "auto",
          });
          gsap.fromTo(
            entering,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              stagger: mobile ? 0.01 : 0.016,
              duration: 0.62,
              ease: EASE_SPRING,
              overwrite: "auto",
            },
          );
          index = nextIndex;
        }, 3800);
      }

      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => {
        gsap.to(".hero-copy", {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
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
    <section id="inicio" ref={rootRef} className="relative overflow-x-clip px-5 pb-10 pt-28 md:px-8 md:pb-16 md:pt-32">
      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-8 md:min-h-[calc(100dvh-8rem)] md:grid-cols-12 md:gap-10">
        <div className="hero-copy min-w-0 md:col-span-7">
          <div className="hero-kicker">
            <Kicker index="01" label={PERSONA.marca} />
          </div>
          <h1 className="mt-5 max-w-[11ch] text-[clamp(3.25rem,11vw,7.5rem)] font-semibold leading-[0.96] tracking-[-0.045em]">
            Deiby
            <span className="block">Ramirez</span>
          </h1>
          <p className="sr-only">{PERSONA.rol}</p>
          <p
            ref={roleRef}
            aria-hidden="true"
            className="hero-role relative mt-5 h-[1.3em] overflow-hidden text-[clamp(1.05rem,4.7vw,2.05rem)] font-semibold leading-[1.3] tracking-[-0.03em] text-light"
          >
            {FRASES.map((frase, index) => (
              <RoleLine key={frase} text={frase} hidden={index !== 0} />
            ))}
          </p>
        </div>
        <div className="min-w-0 md:col-span-5 md:row-span-2">
          <HeroStage />
        </div>
        <div className="hero-copy min-w-0 md:col-span-7">
          <p className="hero-lead max-w-[38ch] text-base leading-[1.65] text-silver md:mt-5 md:text-lg">
            Diseño y construyo productos móviles, web y juegos, y automatizo el trabajo que se repite. Código claro, entrega que se puede usar.
          </p>
          <div className="hero-cta mt-7 flex flex-wrap gap-3">
            <MagneticLink href="#proyectos">Ver proyectos</MagneticLink>
            <MagneticLink href="#contacto" variant="secondary">
              Contacto
            </MagneticLink>
          </div>
          {destacados.length > 0 ? (
            <ol className="mt-10 divide-y divide-white/15 border-y border-white/15">
              {destacados.map((proyecto, index) => (
                <li key={proyecto.id ?? proyecto.titulo}>
                  <a href={`#proyecto-${proyecto.id ?? index}`} className="flex min-h-11 items-center gap-3 py-3 hover:bg-white/[0.04]">
                    <span className="w-8 font-mono text-[11px] tracking-[0.14em] text-silver">{indice(index + 1)}</span>
                    <span className="min-w-0 flex-1 truncate text-base font-semibold tracking-[-0.02em] md:text-lg">{proyecto.titulo}</span>
                    <span className="hidden text-sm text-silver sm:inline">{etiquetaTipo(proyecto.tipo)}</span>
                    <HoverX>
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-silver" />
                    </HoverX>
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-white/15 pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
              {AREAS.map((area, index) => (
                <li key={area.tipo}>
                  {indice(index + 1)} {area.titulo}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-8 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-silver md:flex">
            <span className="scroll-nudge inline-block h-6 w-px bg-light" aria-hidden="true" />
            Desplazar
          </p>
        </div>
      </div>
    </section>
  );
}
