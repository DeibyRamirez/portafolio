"use client";

import { useRef, type ReactNode } from "react";
import { EASE_OUT, gsap, prefersReducedMotion, useGSAP } from "./gsap";

/** Short fade-rise for section ledes. Transform and opacity only. */
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      gsap.from(ref.current, {
        y: 14,
        opacity: 0,
        duration: 0.7,
        ease: EASE_OUT,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
