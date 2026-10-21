"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { NAV, PERSONA } from "./content";
import { getLenis } from "../motion/SmoothScroll";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "../motion/gsap";

export default function Header() {
  const barRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    const bar = barRef.current;
    if (!bar || prefersReducedMotion()) return;

    let ready = false;
    gsap.fromTo(
      bar,
      { yPercent: -120 },
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.35,
        onComplete: () => {
          ready = true;
        },
      },
    );

    const quick = gsap.quickTo(bar, "yPercent", { duration: 0.6, ease: "power3.out" });
    let last = 0;
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (!ready || document.body.dataset.navOpen === "true") {
          if (document.body.dataset.navOpen === "true") quick(0);
          return;
        }
        const y = self.scroll();
        if (y > last + 6 && y > 80) quick(-120);
        else if (y < last - 6) quick(0);
        last = y;
      },
    });

    return () => trigger.kill();
  }, { scope: barRef });

  useEffect(() => {
    if (open) {
      document.body.dataset.navOpen = "true";
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
    } else {
      delete document.body.dataset.navOpen;
      getLenis()?.start();
      document.body.style.overflow = "";
    }
    return () => {
      delete document.body.dataset.navOpen;
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (open) closeButtonRef.current?.focus();
    else menuButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const menu =
    open && mounted
      ? createPortal(
          <div id="menu-movil" className="fixed inset-0 z-[65] bg-carbon px-6 pt-24 text-light md:hidden">
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute right-5 top-4 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/55"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </button>
            <nav aria-label="Secciones">
              <ul className="flex flex-col">
                {NAV.map((item) => (
                  <li key={item.href} className="border-b border-white/10">
                    <a
                      href={item.href}
                      className="block py-4 font-display text-4xl font-semibold tracking-[-0.025em]"
                      onClick={() => {
                        getLenis()?.start();
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>,
          document.body,
        )
      : null;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        ref={barRef}
        className="border-b border-white/10 bg-carbon/75 backdrop-blur-[8px]"
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <a href="#inicio" className="text-lg font-semibold tracking-[-0.03em] text-light md:text-xl">
            {PERSONA.nombre}
          </a>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-silver md:flex" aria-label="Secciones">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="transition-colors duration-150 hover:text-light">
                {item.label}
              </a>
            ))}
          </nav>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/55 md:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </button>
        </div>
      </div>
      {menu}
    </header>
  );
}
