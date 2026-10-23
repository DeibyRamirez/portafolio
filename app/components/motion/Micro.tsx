"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { finePointer, prefersReducedMotion } from "./gsap";

type MicroAnim = { revert: () => void };
type ShiftValues = { x?: number; scale?: number; scaleX?: number };

function shift(
  target: HTMLElement,
  values: ShiftValues,
  alive: () => boolean,
  store: { current: MicroAnim | null },
  duration = 340,
) {
  const settling = values.x === 0 || values.scaleX === 0 || values.scale === 1;
  void import("animejs").then(({ animate }) => {
    if (!alive()) return;
    store.current = animate(target, {
      ...values,
      duration,
      ease: settling ? "outCubic" : "outBack(1.35)",
      composition: "replace",
    });
  });
}

function bindHover(
  node: HTMLElement,
  parent: HTMLElement,
  enterValues: ShiftValues,
  leaveValues: ShiftValues,
  duration: number,
) {
  let alive = true;
  const store: { current: MicroAnim | null } = { current: null };
  const enter = () => shift(node, enterValues, () => alive, store, duration);
  const leave = (event?: Event) => {
    if (event instanceof FocusEvent && parent.contains(event.relatedTarget as Node | null)) return;
    shift(node, leaveValues, () => alive, store, duration);
  };
  parent.addEventListener("pointerenter", enter);
  parent.addEventListener("pointerleave", leave);
  parent.addEventListener("focusin", enter);
  parent.addEventListener("focusout", leave);
  return () => {
    alive = false;
    store.current?.revert();
    parent.removeEventListener("pointerenter", enter);
    parent.removeEventListener("pointerleave", leave);
    parent.removeEventListener("focusin", enter);
    parent.removeEventListener("focusout", leave);
  };
}

/** Slides a child mark on pointer hover. Transform only. */
export function Nudge() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.closest("a, button");
    if (!node || !(parent instanceof HTMLElement)) return;
    if (!finePointer() || prefersReducedMotion()) return;
    return bindHover(node, parent, { x: 6 }, { x: 0 }, 320);
  }, []);

  return (
    <span ref={ref} aria-hidden="true" className="inline-block text-[0.7em] leading-none">
      →
    </span>
  );
}

/** Nudges an icon on hover or keyboard focus. Transform only. */
export function HoverX({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.closest("a, button");
    if (!node || !(parent instanceof HTMLElement)) return;
    if (!finePointer() || prefersReducedMotion()) return;
    return bindHover(node, parent, { x: 5 }, { x: 0 }, 320);
  }, []);

  return (
    <span ref={ref} aria-hidden="true" className="inline-flex">
      {children}
    </span>
  );
}

/** Scales framed media on hover. Transform only, clipped by the parent. */
export function Lift({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.closest("a, button");
    if (!node || !(parent instanceof HTMLElement)) return;
    if (!finePointer() || prefersReducedMotion()) return;
    return bindHover(node, parent, { scale: 1.035 }, { scale: 1 }, 520);
  }, []);

  return (
    <span ref={ref} className="absolute inset-0 block">
      {children}
    </span>
  );
}

/** Draws a hairline under the parent on hover, focus, or when active. */
export function MicroRule({ active = false }: { active?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;

    if (prefersReducedMotion()) {
      node.style.transform = active ? "scaleX(1)" : "scaleX(0)";
      return;
    }

    let alive = true;
    const store: { current: MicroAnim | null } = { current: null };
    const show = () => shift(node, { scaleX: 1 }, () => alive, store, 340);
    const hide = (event?: Event) => {
      if (active) return;
      if (event instanceof FocusEvent && parent.contains(event.relatedTarget as Node | null)) return;
      shift(node, { scaleX: 0 }, () => alive, store, 280);
    };

    if (active) show();
    parent.addEventListener("pointerenter", show);
    parent.addEventListener("pointerleave", hide);
    parent.addEventListener("focusin", show);
    parent.addEventListener("focusout", hide);

    return () => {
      alive = false;
      store.current?.revert();
      parent.removeEventListener("pointerenter", show);
      parent.removeEventListener("pointerleave", hide);
      parent.removeEventListener("focusin", show);
      parent.removeEventListener("focusout", hide);
    };
  }, [active]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-light ${active ? "scale-x-100" : "scale-x-0"}`}
    />
  );
}
