"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          background: "#070708",
          color: "#f4f4f1",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: "2rem" }}>
          <div style={{ maxWidth: "36rem" }}>
            <p style={{ fontFamily: "ui-monospace, monospace", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c6c6c0" }}>
              Error
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.04em", lineHeight: 0.96, margin: "1rem 0" }}>
              Esta vista no cargó.
            </h1>
            <p style={{ color: "#c6c6c0", lineHeight: 1.65, maxWidth: "36ch" }}>
              Hubo un problema al mostrar el portafolio.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "1.5rem",
                minHeight: 44,
                background: "#f4f4f1",
                color: "#070708",
                border: 0,
                padding: "0.75rem 1.25rem",
                fontWeight: 600,
              }}
            >
              Reintentar
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
