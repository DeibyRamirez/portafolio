"use client";

import { useEffect, useRef } from "react";
import { finePointer, gsap, prefersReducedMotion } from "./gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !finePointer() || prefersReducedMotion()) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(node, { xPercent: -50, yPercent: -50, x: -40, y: -40, opacity: 0 });
    const xTo = gsap.quickTo(node, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      xTo(event.clientX);
      yTo(event.clientY);
      gsap.to(node, { opacity: 1, duration: 0.2 });
    };
    const onOver = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const hot = Boolean(target.closest("a, button"));
      gsap.to(node, { scale: hot ? 1.8 : 1, duration: 0.3, ease: "power3.out" });
    };
    const onOut = (event: PointerEvent) => {
      if (!event.relatedTarget) gsap.to(node, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerout", onOut);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] h-3 w-3 rounded-full bg-light opacity-0 mix-blend-difference"
    />
  );
}
