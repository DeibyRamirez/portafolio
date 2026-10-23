"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { getLenis } from "../motion/SmoothScroll";

export default function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add("modal-open");
    else root.classList.remove("modal-open");
    return () => root.classList.remove("modal-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => panelRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <dialog ref={ref} className="sheet" aria-labelledby={titleId} onClose={onClose}>
      <div className="flex h-full w-full items-center justify-center p-1" onClick={onClose}>
        <div
          ref={panelRef}
          tabIndex={-1}
          className="max-h-[90vh] w-full max-w-5xl overflow-auto border border-white/20 bg-coal p-5 outline-none md:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 shrink-0 border border-white/55 px-4 py-2 text-sm font-semibold"
            >
              Cerrar
            </button>
          </div>
          {children}
        </div>
      </div>
    </dialog>
  );
}
