"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { Nudge } from "./Micro";
import { EASE_OUT, EASE_SPRING, finePointer, gsap, prefersReducedMotion } from "./gsap";

const primary =
  "magnet on-light inline-flex min-h-11 items-center justify-center gap-3 bg-light px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-carbon transition-opacity duration-200 hover:opacity-80";
const secondary =
  "magnet inline-flex min-h-11 items-center justify-center gap-3 border border-white/55 px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-light transition-opacity duration-200 hover:opacity-70";

function canMagnet() {
  return finePointer() && !prefersReducedMotion();
}

function useMagnet<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const pressed = useRef(false);

  const onPointerMove = (event: PointerEvent<T>) => {
    const node = ref.current;
    if (!node || !canMagnet()) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.28;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.28;
    gsap.to(node, {
      x,
      y,
      scale: pressed.current ? 0.98 : 1,
      duration: 0.4,
      ease: EASE_OUT,
      overwrite: "auto",
    });
  };

  const onPointerDown = () => {
    const node = ref.current;
    if (!node || !canMagnet()) return;
    pressed.current = true;
    gsap.to(node, { scale: 0.98, duration: 0.16, ease: EASE_OUT, overwrite: "auto" });
  };

  const onPointerUp = () => {
    const node = ref.current;
    pressed.current = false;
    if (!node || !canMagnet()) return;
    gsap.to(node, { scale: 1, duration: 0.45, ease: EASE_SPRING, overwrite: "auto" });
  };

  const onPointerLeave = () => {
    const node = ref.current;
    pressed.current = false;
    if (!node) return;
    if (!canMagnet()) {
      gsap.set(node, { x: 0, y: 0, scale: 1 });
      return;
    }
    gsap.to(node, { x: 0, y: 0, scale: 1, duration: 0.6, ease: EASE_SPRING, overwrite: "auto" });
  };

  return { ref, onPointerMove, onPointerDown, onPointerUp, onPointerLeave };
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
      onPointerDown={magnet.onPointerDown}
      onPointerUp={magnet.onPointerUp}
      onPointerCancel={magnet.onPointerUp}
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
      onPointerDown={magnet.onPointerDown}
      onPointerUp={magnet.onPointerUp}
      onPointerCancel={magnet.onPointerUp}
      onPointerLeave={magnet.onPointerLeave}
      className={`${variant === "primary" ? primary : secondary} ${className}`}
    >
      {children}
      <Nudge />
    </button>
  );
}
