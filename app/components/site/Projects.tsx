"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { DesarrolloInterface } from "@/app/models/Desarrollos";
import LineHeading from "../motion/LineHeading";
import { MicroRule } from "../motion/Micro";
import { ScrollTrigger } from "../motion/gsap";
import { etiquetaTipo, herramientasDe, imagenPublica, indice, ordenarProyectos } from "./content";
import Dialog from "./Dialog";
import Kicker from "./Kicker";

export default function Projects({ proyectos }: { proyectos: DesarrolloInterface[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const ordenados = useMemo(() => ordenarProyectos(proyectos), [proyectos]);
  const [galeria, setGaleria] = useState<{ proyecto: DesarrolloInterface; index: number } | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const galeriaHintId = useId();

  const imagenesGaleria = galeria
    ? (galeria.proyecto.imagenes ?? []).map((src) => imagenPublica(src)).filter((src): src is string => Boolean(src))
    : [];

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
    "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 border border-white/55 bg-carbon/90 px-4 text-sm font-semibold disabled:opacity-40";

  useEffect(() => {
    if (!galeria || imagenesGaleria.length <= 1) return;
    const node = carouselRef.current;
    if (!node) return;
    const target = galeria.index * node.clientWidth;
    if (Math.abs(node.scrollLeft - target) > 2) {
      node.scrollTo({ left: target, behavior: "smooth" });
    }
  }, [galeria, imagenesGaleria.length]);

  const galeriaId = galeria?.proyecto.id;

  useEffect(() => {
    if (!galeriaId || imagenesGaleria.length <= 1) return;
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
  }, [galeriaId, imagenesGaleria.length]);

  useEffect(() => {
    if (!galeriaId || imagenesGaleria.length <= 1) return;
    const node = carouselRef.current;
    if (!node) return;
    requestAnimationFrame(() => {
      node.scrollTo({ left: 0, behavior: "auto" });
    });
  }, [galeriaId, imagenesGaleria.length]);

  return (
    <section id="proyectos" ref={rootRef} aria-labelledby="proyectos-titulo" className="scroll-mt-28 border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto w-full max-w-[90rem]">
        <Kicker index="03" label="Trabajo" />
        <LineHeading id="proyectos-titulo" lines={["Proyectos."]} className="mt-4 text-[clamp(2.4rem,6vw,5.4rem)]" />

        {ordenados.length === 0 ? (
          <p className="mt-12 text-lg text-silver">Aún no hay proyectos publicados.</p>
        ) : (
          <div className="mt-12">
            {ordenados.map((proyecto, index) => {
              const id = proyecto.id ?? String(index);
              const portada = imagenPublica(proyecto.imagenes?.[0]);
              const chips = herramientasDe(proyecto).slice(0, 6);
              return (
                <article
                  key={id}
                  id={`proyecto-${id}`}
                  data-project=""
                  className="relative grid items-center gap-6 border-t border-white/15 py-10 md:grid-cols-12 md:gap-10 md:py-14"
                >
                  <div className="order-2 md:order-1 md:col-span-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                      {indice(index + 1)} — {etiquetaTipo(proyecto.tipo)}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.7rem,3vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]">{proyecto.titulo}</h3>
                    <p className="mt-4 max-w-[42ch] text-silver">{proyecto.descripcion}</p>
                    {chips.length > 0 ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {chips.map((chip) => (
                          <li key={chip} className="border border-white/20 px-3 py-1 text-sm text-silver">
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
                        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-light"
                      >
                        Ver código
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                        <span className="sr-only"> de {proyecto.titulo} (se abre en una pestaña nueva)</span>
                      </a>
                    ) : null}
                  </div>
                  <div className="order-1 md:order-2 md:col-span-7">
                    {portada ? (
                      <button type="button" className="block w-full text-left" onClick={() => setGaleria({ proyecto, index: 0 })}>
                        <span className="relative block aspect-[16/10] overflow-hidden border border-white/15 bg-coal">
                          <Image
                            src={portada}
                            alt={`Captura del proyecto ${proyecto.titulo}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                            fetchPriority="low"
                            className="object-cover"
                            onLoad={() => ScrollTrigger.refresh()}
                          />
                        </span>
                        <span className="mt-3 inline-flex font-mono text-[10px] uppercase tracking-[0.16em] text-silver">Ampliar</span>
                      </button>
                    ) : (
                      <div className="grid aspect-[16/10] place-items-center border border-white/15 bg-coal font-mono text-[11px] uppercase tracking-[0.16em] text-silver">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <MicroRule />
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={Boolean(galeria)} title={galeria?.proyecto.titulo ?? "Proyecto"} onClose={() => setGaleria(null)}>
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
                    className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overflow-y-hidden bg-carbon [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                            loading={imageIndex === galeria.index ? undefined : "lazy"}
                            fetchPriority={imageIndex === galeria.index ? "high" : "low"}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
                <Image src={imagenesGaleria[0]} alt={`Imagen de ${galeria.proyecto.titulo}`} fill sizes="90vw" className="object-contain" />
              </div>
            )}
            {imagenesGaleria.length > 1 ? (
              <div className="sticky bottom-0 z-20 -mx-5 mt-4 flex items-center justify-between gap-3 border-t border-white/10 bg-coal px-5 py-3 md:-mx-8 md:px-8">
                <button type="button" className={navBtnClass} disabled={galeria.index === 0} onClick={irAnterior}>
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                  Anterior
                </button>
                <p className="text-sm text-silver">
                  {galeria.index + 1} de {imagenesGaleria.length}
                </p>
                <button type="button" className={navBtnClass} disabled={galeria.index === imagenesGaleria.length - 1} onClick={irSiguiente}>
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
