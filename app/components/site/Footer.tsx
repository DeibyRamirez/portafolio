import { NAV, PERSONA } from "./content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[1] border-t border-graphite px-6 pb-0 pt-16 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-silver">Portafolio</p>
          <p className="mt-3 max-w-[28ch] text-silver">
            {PERSONA.nombreCompleto}. {PERSONA.rol}.
          </p>
        </div>
        <nav aria-label="Pie de página" className="md:justify-self-end">
          <ul className="flex flex-col gap-2 md:items-end">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm font-semibold text-silver hover:text-light">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#certificados" className="text-sm font-semibold text-silver hover:text-light">
                Certificados
              </a>
            </li>
            <li>
              <a href="#stack" className="text-sm font-semibold text-silver hover:text-light">
                Stack
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-silver">
        © {year} {PERSONA.nombreCompleto}. Todos los derechos reservados.
      </p>
      <div className="mt-8 overflow-hidden">
        <p className="wordmark" aria-hidden="true">
          CHEIVIZ
        </p>
      </div>
    </footer>
  );
}
