"use client";

import { useEffect, useRef } from "react";

type Props = {
  onReady?: () => void;
  onUnavailable?: () => void;
};

type Disposable = { dispose: () => void };

/**
 * Signature point-cloud. Loaded only from a dynamic client import.
 * The loop pauses offscreen and when the tab is hidden. Pixel ratio
 * stays at or below 1.5 on phones and low-power devices.
 */
export default function HeroScene({ onReady, onUnavailable }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(onReady);
  const failRef = useRef(onUnavailable);
  readyRef.current = onReady;
  failRef.current = onUnavailable;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    const disposables: Disposable[] = [];
    let release: (() => void) | null = null;

    const boot = async () => {
      const THREE = await import("three");
      if (disposed) return;

      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const cores = navigator.hardwareConcurrency || 8;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
      const lowEnd = cores <= 4 || memory <= 4;
      const dprCap = mobile ? (lowEnd ? 1.25 : 1.5) : lowEnd ? 1.25 : 1.75;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const shellCount = lowEnd ? 220 : mobile ? 520 : 1400;
      const innerCount = Math.round(shellCount * 0.34);
      const ringCount = lowEnd ? 64 : mobile ? 110 : 200;
      const edgeSamples = lowEnd ? 5 : mobile ? 8 : 12;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: mobile || lowEnd ? "low-power" : "high-performance",
      });
      if (!renderer.getContext()) {
        failRef.current?.();
        return;
      }
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      disposables.push(renderer);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
      camera.position.set(0, 0.08, 5.6);

      const sprite = document.createElement("canvas");
      sprite.width = 64;
      sprite.height = 64;
      const paint = sprite.getContext("2d");
      if (!paint) {
        failRef.current?.();
        return;
      }
      const gradient = paint.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.75)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      paint.fillStyle = gradient;
      paint.fillRect(0, 0, 64, 64);
      const map = new THREE.CanvasTexture(sprite);
      disposables.push(map);

      const group = new THREE.Group();
      scene.add(group);

      const addPoints = (positions: Float32Array, size: number, opacity: number) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
          color: 0xf4f4f1,
          size,
          map,
          transparent: true,
          opacity,
          depthWrite: false,
          sizeAttenuation: true,
        });
        disposables.push(geometry, material);
        const points = new THREE.Points(geometry, material);
        group.add(points);
        return points;
      };

      addPoints(fibonacci(shellCount, 0.92), mobile ? 0.045 : 0.03, 0.92);
      addPoints(fibonacci(innerCount, 0.44), mobile ? 0.03 : 0.02, 0.7);
      const edges = icosahedronEdges(THREE, 0.92, edgeSamples);
      if (edges.length > 0) addPoints(edges, mobile ? 0.034 : 0.022, 1);
      const ringA = addPoints(orbit(ringCount, 1.28, 1.05), mobile ? 0.032 : 0.02, 0.8);
      const ringB = addPoints(orbit(ringCount, 1.46, -0.72), mobile ? 0.032 : 0.02, 0.65);

      const parent = canvas.parentElement;
      const resize = () => {
        const host = parent ?? canvas;
        const width = host.clientWidth;
        const height = host.clientHeight;
        if (width < 2 || height < 2) return;
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resize();

      const pointer = { x: 0, y: 0 };
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const onMove = (event: PointerEvent) => {
        const host = parent ?? canvas;
        const rect = host.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        pointer.y = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 0.45;
        pointer.x = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 0.28;
      };
      if (fine && parent) parent.addEventListener("pointermove", onMove);

      let yaw = 0.62;
      let running = false;
      let announced = false;
      const frame = () => {
        if (disposed) return;
        yaw += 0.0016;
        group.rotation.y = yaw + pointer.y;
        group.rotation.x = 0.32 + pointer.x;
        ringA.rotation.z += 0.0011;
        ringB.rotation.z -= 0.0008;
        renderer.render(scene, camera);
        if (!announced) {
          announced = true;
          readyRef.current?.();
        }
      };

      const gate = { visible: false, page: document.visibilityState === "visible" };
      const sync = () => {
        const should = gate.visible && gate.page && !disposed;
        if (should && !running) {
          running = true;
          renderer.setAnimationLoop(frame);
        } else if (!should && running) {
          running = false;
          renderer.setAnimationLoop(null);
        }
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          gate.visible = Boolean(entry?.isIntersecting);
          sync();
        },
        { threshold: 0.08 },
      );
      observer.observe(parent ?? canvas);

      const onVisibility = () => {
        gate.page = document.visibilityState === "visible";
        sync();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const resizeObserver = new ResizeObserver(() => resize());
      resizeObserver.observe(parent ?? canvas);

      release = () => {
        running = false;
        renderer.setAnimationLoop(null);
        observer.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        if (fine && parent) parent.removeEventListener("pointermove", onMove);
        renderer.forceContextLoss();
      };
    };

    void boot().catch(() => {
      if (!disposed) failRef.current?.();
    });

    return () => {
      disposed = true;
      release?.();
      for (const item of disposables) item.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function fibonacci(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const denom = Math.max(1, count - 1);
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / denom) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * index;
    positions[index * 3] = Math.cos(theta) * ring * radius;
    positions[index * 3 + 1] = y * radius;
    positions[index * 3 + 2] = Math.sin(theta) * ring * radius;
  }
  return positions;
}

function orbit(count: number, radius: number, tilt: number) {
  const positions = new Float32Array(count * 3);
  const cos = Math.cos(tilt);
  const sin = Math.sin(tilt);
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    positions[index * 3] = x;
    positions[index * 3 + 1] = -z * sin;
    positions[index * 3 + 2] = z * cos;
  }
  return positions;
}

function icosahedronEdges(THREE: typeof import("three"), radius: number, samples: number) {
  const geometry = new THREE.IcosahedronGeometry(radius, 0);
  const position = geometry.getAttribute("position");
  const index = geometry.getIndex();
  const pairs = new Map<string, [number, number]>();
  const add = (a: number, b: number) => {
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (!pairs.has(key)) pairs.set(key, a < b ? [a, b] : [b, a]);
  };
  if (index) {
    for (let cursor = 0; cursor < index.count; cursor += 3) {
      const a = index.getX(cursor);
      const b = index.getX(cursor + 1);
      const c = index.getX(cursor + 2);
      add(a, b);
      add(b, c);
      add(c, a);
    }
  }
  const values: number[] = [];
  for (const [a, b] of pairs.values()) {
    for (let step = 0; step <= samples; step += 1) {
      const t = step / samples;
      values.push(
        position.getX(a) + (position.getX(b) - position.getX(a)) * t,
        position.getY(a) + (position.getY(b) - position.getY(a)) * t,
        position.getZ(a) + (position.getZ(b) - position.getZ(a)) * t,
      );
    }
  }
  geometry.dispose();
  return new Float32Array(values);
}
