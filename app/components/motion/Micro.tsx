"use client";

import { useEffect, useRef } from "react";
import { finePointer, prefersReducedMotion } from "./gsap";

type MicroAnim = { revert: () => void };

function shift(target: HTMLElement, values: { x?: number; scaleX?: number }, alive: () => boolean, store: { current: MicroAnim | null }) {
  void import("animejs").then(({ animate }) => {
    if (!alive()) return;
    store.current = animate(target, {
      ...values,
      duration: 420,
      ease: "outCubic",
      composition: "replace",
    });
  });
}

/** Slides a child mark on pointer hover. Transform only. */
export function Nudge() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.closest("a, button");
    if (!node || !(parent instanceof HTMLElement)) return;
    if (!finePointer() || prefersReducedMotion()) return;

    let alive = true;
    const store: { current: MicroAnim | null } = { current: null };

    const enter = () => shift(node, { x: 7 }, () => alive, store);
    const leave = () => shift(node, { x: 0 }, () => alive, store);
    parent.addEventListener("pointerenter", enter);
    parent.addEventListener("pointerleave", leave);

    return () => {
      alive = false;
      store.current?.revert();
      parent.removeEventListener("pointerenter", enter);
      parent.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <span ref={ref} aria-hidden="true" className="inline-block text-[0.7em] leading-none">
      →
    </span>
  );
}

/** Draws a hairline under the parent on hover or focus. Transform only. */
export function MicroRule() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    const parent = node?.parentElement;
    if (!node || !parent || prefersReducedMotion()) return;

    let alive = true;
    const store: { current: MicroAnim | null } = { current: null };

    const enter = () => shift(node, { scaleX: 1 }, () => alive, store);
    const leave = (event: Event) => {
      if (event instanceof FocusEvent && parent.contains(event.relatedTarget as Node | null)) return;
      shift(node, { scaleX: 0 }, () => alive, store);
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
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-light"
    />
  );
}
