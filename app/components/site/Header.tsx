"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { NAV, PERSONA } from "./content";
import { getLenis } from "../motion/SmoothScroll";
import { MicroRule, Nudge } from "../motion/Micro";

export default function Header() {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const nodes = NAV.map((item) => document.querySelector(item.href)).filter((node): node is Element => node instanceof Element);
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.1, 0.3] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const locked = [document.querySelector("header"), document.querySelector("main"), document.querySelector("footer")];
    if (open) {
      document.body.dataset.navOpen = "true";
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
      locked.forEach((node) => node?.setAttribute("inert", ""));
    } else {
      delete document.body.dataset.navOpen;
      getLenis()?.start();
      document.body.style.overflow = "";
      locked.forEach((node) => node?.removeAttribute("inert"));
    }
    return () => {
      delete document.body.dataset.navOpen;
      document.body.style.overflow = "";
      locked.forEach((node) => node?.removeAttribute("inert"));
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
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const root = document.getElementById("menu-movil");
      if (!root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("a, button"));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const menu =
    open && mounted
      ? createPortal(
          <div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de secciones"
            className="fixed inset-0 z-[65] flex flex-col bg-carbon px-5 pb-10 pt-24 text-light"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute right-4 top-4 inline-flex min-h-11 min-w-11 items-center justify-center border border-white/55"
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" className="h-5 w-5" />
              <span className="sr-only">Cerrar menú</span>
            </button>
            <nav aria-label="Secciones">
              <ul className="flex flex-col">
                {NAV.map((item, index) => (
                  <li key={item.href} className="border-b border-white/10">
                    <a
                      href={item.href}
                      className="flex min-h-14 items-baseline gap-4 py-3 font-display text-[clamp(2rem,8vw,2.6rem)] font-semibold leading-none tracking-[-0.03em]"
                      onClick={() => {
                        getLenis()?.start();
                        setOpen(false);
                      }}
                    >
                      <span className="font-mono text-xs tracking-[0.16em] text-silver">{String(index + 1).padStart(2, "0")}</span>
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
      <div className="border-b border-white/10 bg-carbon">
        <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <a href="#inicio" className="min-w-0 text-light">
            <span className="block text-sm font-semibold tracking-[-0.03em] md:text-base">{PERSONA.nombre}</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-silver">{PERSONA.marca}</span>
          </a>
          <nav className="hidden items-center gap-5 lg:flex" aria-label="Secciones">
            {NAV.map((item) => {
              const current = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "true" : undefined}
                  className={`relative inline-flex items-center gap-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${current ? "text-light" : "text-silver hover:text-light"}`}
                >
                  {item.label}
                  <Nudge />
                  <MicroRule active={current} />
                </a>
              );
            })}
          </nav>
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/55 lg:hidden"
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
