import { Binary, LockKeyhole, Radar, ShieldAlert } from "lucide-react";

const roadmap = [
  {
    icono: <ShieldAlert className="h-5 w-5" />,
    titulo: "Fundamentos",
    detalle: "Practicas de hardening, gestion segura de secretos y principios OWASP para aplicaciones web.",
  },
  {
    icono: <Radar className="h-5 w-5" />,
    titulo: "Laboratorios",
    detalle: "Proximamente publicare entornos de practica, analisis de vulnerabilidades y reportes tecnicos.",
  },
  {
    icono: <Binary className="h-5 w-5" />,
    titulo: "Automatizacion",
    detalle: "Scripts y utilidades para validaciones de seguridad en pipelines de desarrollo continuo.",
  },
  {
    icono: <LockKeyhole className="h-5 w-5" />,
    titulo: "Blue Team",
    detalle: "Monitoreo basico, deteccion de eventos y fortalecimiento de controles para proyectos productivos.",
  },
];

export default function Ciberseguridad() {
  return (
    <section id="d_ciberseguridad" className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-slate-950 p-8 text-white md:p-10">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">Nueva linea estrategica</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Ciberseguridad en construccion</h2>
          <p className="mt-4 max-w-3xl text-slate-300">
            Este apartado queda listo para documentar proyectos de seguridad. La idea es mostrar evidencia tecnica,
            metodologia y resultados medibles, igual que en las categorias de desarrollo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {roadmap.map((item) => (
            <article key={item.titulo} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="mb-3 inline-flex rounded-lg bg-amber-500/15 p-2 text-amber-300">{item.icono}</div>
              <h3 className="text-lg font-semibold">{item.titulo}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.detalle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
