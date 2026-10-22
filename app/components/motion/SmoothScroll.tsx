"use client";

import { useEffect, type ReactNode } from "react";
import "lenis/dist/lenis.css";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

let current: Lenis | null = null;

export function getLenis() {
  return current;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let removeClick: (() => void) | null = null;
    let destroyed = false;
    let instance: Lenis | null = null;
    let ticker: ((time: number) => void) | null = null;

    const bindAnchors = () => {
      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const link = target.closest("a[href^='#']");
        if (!(link instanceof HTMLAnchorElement)) return;
        const hash = link.getAttribute("href");
        if (!hash || hash === "#") return;
        const destination = document.querySelector(hash);
        if (!(destination instanceof HTMLElement)) return;
        event.preventDefault();
        if (current) {
          current.scrollTo(destination, { offset: -88, duration: 1.6 });
        } else {
          destination.scrollIntoView({ block: "start" });
        }
      };
      document.addEventListener("click", onClick);
      removeClick = () => document.removeEventListener("click", onClick);
    };

    const start = async () => {
      if (media.matches) {
        bindAnchors();
        return;
      }

      const { default: LenisCtor } = await import("lenis");
      if (destroyed) return;

      instance = new LenisCtor({
        duration: 1.15,
        touchMultiplier: 1.4,
      });
      current = instance;
      instance.on("scroll", ScrollTrigger.update);
      ticker = (time: number) => {
        instance?.raf(time * 1000);
      };
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
      bindAnchors();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    void start();

    return () => {
      destroyed = true;
      removeClick?.();
      if (ticker) gsap.ticker.remove(ticker);
      instance?.destroy();
      if (current === instance) current = null;
    };
  }, []);

  return children;
}
