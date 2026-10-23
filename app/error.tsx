"use client";

import { useEffect } from "react";
import { MagneticButton, MagneticLink } from "./components/motion/Magnetic";
import Kicker from "./components/site/Kicker";

export default function Error({
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
    <section className="flex min-h-[70dvh] items-center px-5 py-32 md:px-8">
      <div className="mx-auto w-full max-w-[90rem]">
        <Kicker index="—" label="Error" />
        <h1 className="mt-5 max-w-[14ch] text-[clamp(2.6rem,7vw,5.4rem)] font-semibold leading-[0.96] tracking-[-0.04em]">
          Esta vista no cargó.
        </h1>
        <p className="mt-6 max-w-[36ch] text-base leading-[1.65] text-silver md:text-lg">
          Hubo un problema al mostrar el portafolio. Puedes reintentar o volver al inicio.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton onClick={reset}>Reintentar</MagneticButton>
          <MagneticLink href="/" variant="secondary">
            Inicio
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
