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

function prefersStillPoster() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
  ).connection;
  const type = connection?.effectiveType;
  return Boolean(connection?.saveData || type === "slow-2g" || type === "2g");
}

/**
 * Three.js and the WebGL probe were running during hydration and stretching
 * mobile TTI. The poster is the first paint. The cloud starts only after the
 * main thread has been quiet, sooner on a fine pointer desktop.
 */
function whenPageIsQuiet(run: () => void) {
  const constrained = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const quietFor = constrained ? 6500 : 500;
  const maxWait = constrained ? 12000 : 2000;
  let startedAt = performance.now();
  let lastBusy = startedAt;
  let timer = 0;
  let idleId = 0;
  let stopped = false;
  let observer: PerformanceObserver | null = null;

  try {
    observer = new PerformanceObserver((list) => {
      if (list.getEntries().length > 0) lastBusy = performance.now();
    });
    observer.observe({ entryTypes: ["longtask"] });
  } catch {
    observer?.disconnect();
    observer = null;
  }

  const teardown = () => {
    window.clearTimeout(timer);
    if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
    observer?.disconnect();
    window.removeEventListener("load", begin);
  };

  const fire = () => {
    if (stopped) return;
    stopped = true;
    teardown();
    run();
  };

  const arm = () => {
    if (stopped) return;
    window.clearTimeout(timer);
    const now = performance.now();
    const ready = now - lastBusy >= quietFor || now - startedAt >= maxWait;
    if (!ready) {
      timer = window.setTimeout(arm, 200);
      return;
    }
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => fire(), { timeout: constrained ? 900 : 350 });
      return;
    }
    timer = window.setTimeout(fire, 32);
  };

  const begin = () => {
    startedAt = performance.now();
    lastBusy = startedAt;
    arm();
  };

  if (document.readyState === "complete") begin();
  else window.addEventListener("load", begin, { once: true });

  return () => {
    stopped = true;
    teardown();
  };
}

export default function HeroStage() {
  const [mode, setMode] = useState<"pending" | "webgl" | "poster">("pending");
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (prefersStillPoster()) {
      setMode("poster");
      return;
    }

    let cancelled = false;
    const stop = whenPageIsQuiet(() => {
      if (cancelled) return;
      if (!hasWebGL()) {
        setMode("poster");
        return;
      }
      setMode("webgl");
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  const label = mode === "webgl" && live ? "WebGL · nube de puntos" : "Poster estático";

  return (
    <div className="relative mx-auto aspect-square w-[min(100%,18.5rem)] md:w-full" aria-hidden="true">
      <div className="relative h-full border border-white/20 bg-carbon">
        <span className="pointer-events-none absolute left-0 top-0 h-3.5 w-3.5 border-l border-t border-light" />
        <span className="pointer-events-none absolute right-0 top-0 h-3.5 w-3.5 border-r border-t border-light" />
        <span className="pointer-events-none absolute bottom-0 left-0 h-3.5 w-3.5 border-b border-l border-light" />
        <span className="pointer-events-none absolute bottom-0 right-0 h-3.5 w-3.5 border-b border-r border-light" />
        <p className="absolute left-3 top-3 z-[2] font-mono text-[10px] uppercase tracking-[0.16em] text-silver">{label}</p>
        <p className="absolute bottom-3 right-3 z-[2] font-mono text-[10px] uppercase tracking-[0.16em] text-silver">Núcleo 01</p>
        <div className="absolute inset-[12%]">
          <Image
            src="/hero-poster.svg"
            alt=""
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="(max-width: 768px) 296px, 40vw"
            className={`object-contain transition-opacity duration-500 ${live ? "opacity-25" : "opacity-100"}`}
          />
          {mode === "webgl" ? (
            <HeroScene onReady={() => setLive(true)} onUnavailable={() => setMode("poster")} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
