"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

/** Shared exits. Scrubbed scroll stays linear. */
export const EASE_OUT = "power3.out";
export const EASE_IN = "power2.in";
export const EASE_SPRING = "back.out(1.45)";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
