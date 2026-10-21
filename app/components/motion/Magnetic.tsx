"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { finePointer, gsap, prefersReducedMotion } from "./gsap";

const primary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-light px-6 py-3 text-sm font-semibold text-carbon transition-colors duration-150 hover:bg-white/85";
const secondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/55 px-6 py-3 text-sm font-semibold text-light transition-colors duration-150 hover:bg-light hover:text-carbon";

function canMagnet() {
  return finePointer() && !prefersReducedMotion();
}

function useMagnet<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = (event: PointerEvent<T>) => {
    const node = ref.current;
    if (!node || !canMagnet()) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * 0.35;
    const y = (event.clientY - (rect.top + rect.height / 2)) * 0.35;
    gsap.to(node, { x, y, duration: 0.4, ease: "power3.out" });
  };

  const onPointerLeave = () => {
    const node = ref.current;
    if (!node) return;
    if (!canMagnet()) {
      gsap.set(node, { x: 0, y: 0 });
      return;
    }
    gsap.to(node, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
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
    </button>
  );
}
