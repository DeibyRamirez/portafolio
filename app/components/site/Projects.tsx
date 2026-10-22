"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { DesarrolloInterface } from "@/app/models/Desarrollos";
import LineHeading from "../motion/LineHeading";
import { getLenis } from "../motion/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP } from "../motion/gsap";
import { etiquetaTipo, herramientasDe, imagenPublica, indice, ordenarProyectos } from "./content";
import Dialog from "./Dialog";

export default function Projects({ proyectos }: { proyectos: DesarrolloInterface[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const ordenados = useMemo(() => ordenarProyectos(proyectos), [proyectos]);
  const firma = ordenados.map((proyecto) => proyecto.id ?? proyecto.titulo).join("|");
  const [horizontal, setHorizontal] = useState(false);
  const [galeria, setGaleria] = useState<{ proyecto: DesarrolloInterface; index: number } | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const galeriaHintId = useId();

  useLayoutEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setHorizontal(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!horizontal || !stage || !track || ordenados.length === 0) return;

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          end: () => `+=${distance()}`,
          onUpdate: (self) => {
            if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
            if (countRef.current && ordenados.length > 0) {
              const current = Math.min(ordenados.length, Math.max(1, Math.round(self.progress * (ordenados.length - 1)) + 1));
              countRef.current.textContent = `${indice(current)} / ${indice(ordenados.length)}`;
            }
          },
        },
      });
      triggerRef.current = tween.scrollTrigger ?? null;

      const cards = track.querySelectorAll<HTMLElement>("[data-index]");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 72%",
          },
        });
      });

      let lastCard: HTMLElement | null = null;
      const onFocus = (event: FocusEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const card = target.closest<HTMLElement>("[data-index]");
        const trigger = triggerRef.current;
        if (!card || !trigger || card === lastCard) return;
        lastCard = card;
        const max = Math.max(1, track.scrollWidth - window.innerWidth);
        const progress = Math.min(1, card.offsetLeft / max);
        const y = trigger.start + (trigger.end - trigger.start) * progress;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { duration: 0.6 });
        else window.scrollTo({ top: y });
      };
      stage.addEventListener("focusin", onFocus);

      return () => {
        stage.removeEventListener("focusin", onFocus);
        triggerRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [horizontal, firma] },
  );

  const imagenesGaleria = galeria ? (galeria.proyecto.imagenes ?? []).map((src) => imagenPublica(src)).filter((src): src is string => Boolean(src)) : [];

  useEffect(() => {
    const lenis = getLenis();
    if (!lenis || !galeria) return;
    lenis.stop();
    return () => lenis.start();
  }, [galeria]);

  const irAnterior = useCallback(() => {
    setGaleria((prev) => (prev && prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev));
  }, []);

  const irSiguiente = useCallback(() => {
    setGaleria((prev) => {
      if (!prev) return prev;
      const total = (prev.proyecto.imagenes ?? [])
        .map((src) => imagenPublica(src))
        .filter((src): src is string => Boolean(src)).length;
      if (prev.index >= total - 1) return prev;
      return { ...prev, index: prev.index + 1 };
    });
  }, []);

  const navBtnClass =
    "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-white/55 bg-carbon/85 px-4 text-sm font-semibold backdrop-blur-sm transition hover:bg-carbon disabled:opacity-40 disabled:hover:bg-carbon/85";

  useEffect(() => {
    if (!galeria || imagenesGaleria.length <= 1) return;
    const node = carouselRef.current;
    if (!node) return;
    const target = galeria.index * node.clientWidth;
    if (Math.abs(node.scrollLeft - target) > 2) {
      node.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [galeria?.index, galeria?.proyecto.id, imagenesGaleria.length]);

  useEffect(() => {
    if (!galeria || imagenesGaleria.length <= 1) return;
    const node = carouselRef.current;
    if (!node) return;

    const syncIndexFromScroll = () => {
      const width = node.clientWidth;
      if (width <= 0) return;
      const next = Math.min(imagenesGaleria.length - 1, Math.max(0, Math.round(node.scrollLeft / width)));
      setGaleria((prev) => (prev && prev.index !== next ? { ...prev, index: next } : prev));
    };

    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(syncIndexFromScroll, 80);
    };

    node.addEventListener("scrollend", syncIndexFromScroll);
    node.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      node.removeEventListener("scrollend", syncIndexFromScroll);
      node.removeEventListener("scroll", onScroll);
    };
  }, [galeria?.proyecto.id, imagenesGaleria.length]);

  useEffect(() => {
    if (!galeria || imagenesGaleria.length <= 1) return;
    const node = carouselRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollTo({ left: galeria.index * node.clientWidth, behavior: "auto" });
    });
  }, [galeria?.proyecto.id, imagenesGaleria.length]);

  return (
    <section id="proyectos" ref={rootRef} aria-labelledby="proyectos-titulo" className="relative z-[1] scroll-mt-28 pt-32 md:pt-40">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-6 md:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Trabajo</p>
          <LineHeading id="proyectos-titulo" lines={["Proyectos."]} className="mt-4 text-[clamp(2.6rem,7.2vw,6.4rem)]" />
        </div>
        {horizontal && ordenados.length > 0 ? (
          <p className="text-sm font-semibold tracking-[0.14em] text-silver" aria-hidden="true">
            <span ref={countRef}>
              {indice(1)} / {indice(ordenados.length)}
            </span>
          </p>
        ) : null}
      </div>

      {ordenados.length === 0 ? (
        <p className="mx-auto mt-12 max-w-7xl px-6 text-lg text-silver md:px-8">Aún no hay proyectos publicados.</p>
      ) : (
        <div ref={stageRef} className={horizontal ? "relative mt-12 h-dvh overflow-hidden" : "relative mt-12"}>
          <div
            ref={trackRef}
            className={
              horizontal
                ? "relative flex h-full w-max items-center gap-16 px-8 md:gap-20"
                : "flex flex-col gap-16 px-6 md:px-8"
            }
          >
            {ordenados.map((proyecto, index) => {
              const id = proyecto.id ?? String(index);
              const portada = imagenPublica(proyecto.imagenes?.[0]);
              const chips = herramientasDe(proyecto).slice(0, 6);
              return (
                <article
                  key={id}
                  id={`proyecto-${id}`}
                  data-index={index}
                  className={horizontal ? "grid w-[min(78vw,920px)] shrink-0 items-center gap-8 md:grid-cols-2" : "grid w-full items-center gap-8"}
                >
                  <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-coal md:aspect-[4/3]">
                    {portada ? (
                      <Image
                        src={portada}
                        alt={`Captura del proyecto ${proyecto.titulo}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover grayscale transition-transform duration-[2400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105 motion-reduce:transform-none"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    ) : null}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />
                    {portada ? (
                      <button
                        type="button"
                        className="absolute inset-0"
                        onClick={() => setGaleria({ proyecto, index: 0 })}
                      >
                        <span className="sr-only">Ampliar imagen de {proyecto.titulo}</span>
                        <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-[0.14em]" aria-hidden="true">
                          Ampliar
                        </span>
                      </button>
                    ) : null}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">
                      {indice(index + 1)} — {etiquetaTipo(proyecto.tipo)}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.8rem,4vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.025em]">
                      {proyecto.titulo}
                    </h3>
                    <p className="mt-4 max-w-[38ch] text-silver line-clamp-6">{proyecto.descripcion}</p>
                    {chips.length > 0 ? (
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {chips.map((chip) => (
                          <li key={chip} className="rounded-full border border-graphite px-3 py-1 text-sm text-silver">
                            {chip}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {proyecto.repositorio ? (
                      <a
                        href={proyecto.repositorio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-light"
                      >
                        Ver código
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        <span className="sr-only"> de {proyecto.titulo} (se abre en una pestaña nueva)</span>
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
          {horizontal ? (
            <div className="pointer-events-none absolute inset-x-8 bottom-8 h-px bg-graphite" aria-hidden="true">
              <span ref={barRef} className="block h-px origin-left scale-x-0 bg-light shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
            </div>
          ) : null}
        </div>
      )}

      <Dialog
        open={Boolean(galeria)}
        title={galeria?.proyecto.titulo ?? "Proyecto"}
        onClose={() => setGaleria(null)}
      >
        {galeria && imagenesGaleria.length > 0 ? (
          <div>
            {imagenesGaleria.length > 1 ? (
              <>
                <p id={galeriaHintId} className="sr-only">
                  Desliza horizontalmente o usa los botones de navegación para cambiar de imagen.
                </p>
                <div className="relative">
                  <button
                    type="button"
                    className={`absolute left-2 top-1/2 z-20 -translate-y-1/2 ${navBtnClass}`}
                    disabled={galeria.index === 0}
                    onClick={irAnterior}
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className={`absolute right-2 top-1/2 z-20 -translate-y-1/2 ${navBtnClass}`}
                    disabled={galeria.index === imagenesGaleria.length - 1}
                    onClick={irSiguiente}
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight aria-hidden="true" className="h-5 w-5" />
                  </button>
                  <div
                    ref={carouselRef}
                    className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-2xl bg-carbon [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{ WebkitOverflowScrolling: "touch" }}
                    aria-describedby={galeriaHintId}
                  >
                    {imagenesGaleria.map((src, imageIndex) => (
                      <div key={`${src}-${imageIndex}`} className="relative min-w-full shrink-0 snap-center">
                        <div className="relative aspect-[4/3] w-full">
                          <Image
                            src={src}
                            alt={`Imagen ${imageIndex + 1} de ${imagenesGaleria.length} de ${galeria.proyecto.titulo}`}
                            fill
                            sizes="90vw"
                            className="object-contain"
                            priority={imageIndex === galeria.index}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-carbon">
                <Image
                  src={imagenesGaleria[0]}
                  alt={`Imagen de ${galeria.proyecto.titulo}`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>
            )}
            {imagenesGaleria.length > 1 ? (
              <div
                className="sticky bottom-0 z-20 -mx-5 mt-4 flex items-center justify-between gap-3 border-t border-white/10 bg-coal/95 px-5 py-3 backdrop-blur md:-mx-8 md:px-8"
              >
                <button
                  type="button"
                  className={navBtnClass}
                  disabled={galeria.index === 0}
                  onClick={irAnterior}
                >
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                  Anterior
                </button>
                <p className="text-sm text-silver">
                  {galeria.index + 1} de {imagenesGaleria.length}
                </p>
                <button
                  type="button"
                  className={navBtnClass}
                  disabled={galeria.index === imagenesGaleria.length - 1}
                  onClick={irSiguiente}
                >
                  Siguiente
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </Dialog>
    </section>
  );
}
