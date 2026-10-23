"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

function hasWebGL() {
  try {
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") || probe.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

export default function HeroStage() {
  const [mode, setMode] = useState<"pending" | "webgl" | "poster">("pending");
  const [live, setLive] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !hasWebGL()) {
      setMode("poster");
      return;
    }
    setMode("webgl");
  }, []);

  const label = mode === "webgl" && live ? "WebGL · nube de puntos" : "Poster estático";

  return (
    <div className="relative mx-auto aspect-square w-[min(100%,18.5rem)] md:w-full" aria-hidden="true">
      <div className="relative h-full border border-white/20 bg-carbon">
        <span className="pointer-events-none absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-light" />
        <span className="pointer-events-none absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-light" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-light" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-light" />
        <p className="absolute left-3 top-3 z-[2] font-mono text-[10px] uppercase tracking-[0.18em] text-silver">{label}</p>
        <p className="absolute bottom-3 right-3 z-[2] font-mono text-[10px] uppercase tracking-[0.18em] text-silver">Núcleo 01</p>
        <div className="absolute inset-[12%]">
          <Image
            src="/hero-poster.svg"
            alt=""
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="(max-width: 768px) 296px, 40vw"
            className={`object-contain transition-opacity duration-700 ${live ? "opacity-25" : "opacity-100"}`}
          />
          {mode === "webgl" ? (
            <HeroScene onReady={() => setLive(true)} onUnavailable={() => setMode("poster")} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
