"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  z: number;
  phase: number;
  speed: number;
};

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stars: Star[] = [];
    let frame = 0;
    let stopped = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(900, Math.max(24, Math.round((width * height) / 3600)));
      stars.length = 0;
      for (let index = 0; index < count; index += 1) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.25 + Math.random() * 0.75,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.6,
        });
      }
    };

    const draw = (time: number) => {
      if (stopped) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const wave = reduced ? 0.75 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 0.001 * star.speed + star.phase));
        context.fillStyle = `rgba(255,255,255,${(wave * star.z).toFixed(3)})`;
        context.beginPath();
        context.arc(star.x, star.y, star.z * 1.35, 0, Math.PI * 2);
        context.fill();
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true" />;
}
