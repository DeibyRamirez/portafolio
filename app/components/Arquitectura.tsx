import { Blocks, FolderTree, ShieldCheck, Smartphone } from "lucide-react";

const pilares = [
  {
    icono: <FolderTree className="h-5 w-5" />,
    titulo: "Estructura modular",
    descripcion:
      "Cada area del portafolio se mantiene como bloque independiente para facilitar mantenimiento y crecimiento.",
  },
  {
    icono: <Smartphone className="h-5 w-5" />,
    titulo: "Multicategoria",
    descripcion:
      "El repositorio esta organizado para agregar proyectos moviles, web, game dev y nuevas especialidades sin romper la navegacion.",
  },
  {
    icono: <ShieldCheck className="h-5 w-5" />,
    titulo: "Ruta de ciberseguridad",
    descripcion:
      "Se prepara un espacio dedicado para laboratorios, writeups y practicas tecnicas de seguridad ofensiva y defensiva.",
  },
  {
    icono: <Blocks className="h-5 w-5" />,
    titulo: "Escalabilidad",
    descripcion:
      "El enfoque permite incorporar nuevos proyectos y categorias manteniendo una presentacion profesional y consistente.",
  },
];

export default function Arquitectura() {
  return (
    <section id="arquitectura" className="px-6 py-20 md:px-8">
      <div className="section-shell mx-auto max-w-7xl rounded-3xl p-8 md:p-10">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">
            Vision del repositorio
          </p>
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Base profesional para crecer por lineas tecnicas</h2>
          <p className="mt-4 text-slate-600">
            Esta estructura organiza la informacion con enfoque de producto: perfil, arquitectura, areas de desarrollo y logros.
            Asi puedes escalar el portafolio sin perder claridad para reclutadores o clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pilares.map((pilar) => (
            <article key={pilar.titulo} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-lg bg-amber-100 p-2 text-amber-700">{pilar.icono}</div>
              <h3 className="text-lg font-semibold text-slate-900">{pilar.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{pilar.descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
