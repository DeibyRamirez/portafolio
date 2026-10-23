import { NAV, PERSONA } from "./content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-[2] border-t border-white/10 px-5 pb-0 pt-14 md:px-8">
      <div className="mx-auto grid max-w-[90rem] gap-10 md:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-silver">Portafolio</p>
          <p className="mt-3 max-w-[28ch] text-silver">
            {PERSONA.nombreCompleto}. {PERSONA.rol}.
          </p>
        </div>
        <nav aria-label="Pie de página" className="md:justify-self-end">
          <ul className="flex flex-col gap-2 md:items-end">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-silver">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={PERSONA.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-silver">
                GitHub
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-[90rem] font-mono text-[11px] text-silver">
        © {year} {PERSONA.nombreCompleto}. Todos los derechos reservados.
      </p>
      <div className="mt-6 overflow-hidden">
        <p className="wordmark" aria-hidden="true">
          CHEIVIZ
        </p>
      </div>
    </footer>
  );
}
