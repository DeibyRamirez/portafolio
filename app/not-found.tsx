import { MagneticLink } from "./components/motion/Magnetic";

export default function NotFound() {
  return (
    <section className="relative z-[1] flex min-h-[100dvh] items-center px-6 py-32 md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brass">404</p>
        <h1 className="mt-4 max-w-[12ch] text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.025em]">
          Página no encontrada.
        </h1>
        <p className="mt-6 max-w-[28ch] text-lg text-silver">Esa ruta no forma parte de este portafolio.</p>
        <div className="mt-8">
          <MagneticLink href="/">Volver al inicio</MagneticLink>
        </div>
      </div>
    </section>
  );
}
