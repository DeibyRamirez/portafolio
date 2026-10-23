import { MagneticLink } from "./components/motion/Magnetic";
import Kicker from "./components/site/Kicker";

export default function NotFound() {
  return (
    <section className="flex min-h-[100dvh] items-center px-5 py-32 md:px-8">
      <div className="mx-auto w-full max-w-[90rem]">
        <Kicker index="404" label="Ruta" />
        <h1 className="mt-4 max-w-[12ch] text-[clamp(3.2rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
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
