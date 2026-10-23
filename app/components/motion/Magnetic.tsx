"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { Nudge } from "./Micro";
import { finePointer, gsap, prefersReducedMotion } from "./gsap";

const primary =
  "inline-flex min-h-11 items-center justify-center gap-3 bg-light px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-carbon transition-opacity duration-200 hover:opacity-80";
const secondary =
  "inline-flex min-h-11 items-center justify-center gap-3 border border-white/55 px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-light transition-opacity duration-200 hover:opacity-70";

function canMagnet() {
  return finePointer() && !prefersReducedMotion();
}

function useMagnet<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = (event: PointerEvent<T>) => {
    const node = ref.current;
    if (!node || !canMagnet()) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.28;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.28;
    gsap.to(node, { x, y, duration: 0.35, ease: "power3.out" });
  };

  const onPointerLeave = () => {
    const node = ref.current;
    if (!node) return;
    if (!canMagnet()) {
      gsap.set(node, { x: 0, y: 0 });
      return;
    }
    gsap.to(node, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
  };

  return { ref, onPointerMove, onPointerLeave };
}

export function MagneticLink({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  onClick,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const magnet = useMagnet<HTMLAnchorElement>();
  return (
    <a
      ref={magnet.ref}
      href={href}
      onClick={onClick}
      onPointerMove={magnet.onPointerMove}
      onPointerLeave={magnet.onPointerLeave}
      className={`${variant === "primary" ? primary : secondary} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      <Nudge />
      {external ? <span className="sr-only"> (se abre en una pestaña nueva)</span> : null}
    </a>
  );
}

export function MagneticButton({
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}) {
  const magnet = useMagnet<HTMLButtonElement>();
  return (
    <button
      ref={magnet.ref}
      type="button"
      onClick={onClick}
      onPointerMove={magnet.onPointerMove}
      onPointerLeave={magnet.onPointerLeave}
      className={`${variant === "primary" ? primary : secondary} ${className}`}
    >
      {children}
      <Nudge />
    </button>
  );
}
