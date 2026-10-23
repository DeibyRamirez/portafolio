import type { DesarrolloInterface } from "@/app/models/Desarrollos";
import { convertirGSUrl } from "@/app/components/Conversion";

export const PERSONA = {
  marca: "The Cheiviz",
  nombre: "Deiby Ramirez",
  nombreCompleto: "Deiby Alejandro Ramirez Galvis",
  rol: "Ingeniero de software",
  email: "deibyalejandroramirez13@gmail.com",
  github: "https://github.com/DeibyRamirez",
  linkedin: "https://www.linkedin.com/in/deiby-ramirez-67a273255",
  cv: "/cv-deiby.pdf",
};

export const FRASES = [
  "Ingeniero de software.",
  "Código con criterio.",
  "De la idea al producto.",
];

export const MANIFIESTO =
  "Construyo software que alguien puede usar. De la interfaz al dato, con criterio de producto y código que se puede mantener.";

export const NAV = [
  { href: "#proyectos", label: "Proyectos" },
  { href: "#perfil", label: "Perfil" },
  { href: "#stack", label: "Oficio" },
  { href: "#trayectoria", label: "Trayectoria" },
  { href: "#certificados", label: "Certificados" },
  { href: "#contacto", label: "Contacto" },
];

export const ORDEN_TIPO = ["web", "movil", "game_dev", "automatizacion", "ciberseguridad"] as const;

export const ETIQUETA: Record<string, string> = {
  web: "Web",
  movil: "Móvil",
  game_dev: "Game dev",
  automatizacion: "Automatización",
  ciberseguridad: "Ciberseguridad",
};

export const AREAS = [
  {
    tipo: "movil",
    titulo: "Móvil",
    detalle: "Interfaces táctiles y aplicaciones multiplataforma, con servicios conectados.",
  },
  {
    tipo: "web",
    titulo: "Web",
    detalle: "Productos en el navegador: formularios, datos y una interfaz que responde.",
  },
  {
    tipo: "game_dev",
    titulo: "Juegos",
    detalle: "Prototipos bajo reloj. Atmósfera, mecánica y trabajo en equipo.",
  },
  {
    tipo: "automatizacion",
    titulo: "Automatización",
    detalle: "Flujos que leen, clasifican y responden sin repetir el mismo trabajo.",
  },
  {
    tipo: "ciberseguridad",
    titulo: "Seguridad",
    detalle: "Conceptos y diagnóstico aplicados como hábito dentro del producto.",
  },
] as const;

export const TRAYECTORIA = [
  {
    kicker: "Formación",
    titulo: "Ingeniería de software",
    texto: "Software y computación como oficio. Pienso el producto completo: interfaz, lógica y datos.",
  },
  {
    kicker: "Móvil",
    titulo: "Aplicaciones multiplataforma",
    texto: "Interfaces en Flutter, con Firebase y un solo código para iOS y Android.",
  },
  {
    kicker: "Web",
    titulo: "Productos en el navegador",
    texto: "Aplicaciones con Next.js y TypeScript, del formulario a la base de datos.",
  },
  {
    kicker: "Juegos",
    titulo: "Global Game Jam Popayán",
    texto: "Museum of Silent Faces: supervivencia en primera persona, hecha en Godot, en equipo y bajo reloj.",
  },
  {
    kicker: "Automatización",
    titulo: "Flujos que trabajan solos",
    texto: "Orquestación con n8n para leer, clasificar y responder correo y tareas repetidas.",
  },
  {
    kicker: "Seguridad",
    titulo: "Criterio de ciberseguridad",
    texto: "Formación en conceptos y diagnóstico. Entra al modo de construir: secretos, superficie y entrega.",
  },
];

export function etiquetaTipo(tipo?: string) {
  if (!tipo) return "Proyecto";
  return ETIQUETA[tipo] ?? "Proyecto";
}

export function ordenarProyectos(proyectos: DesarrolloInterface[]) {
  const rank = new Map<string, number>(ORDEN_TIPO.map((tipo, index) => [tipo, index]));
  return proyectos
    .map((proyecto, index) => ({ proyecto, index }))
    .sort(
      (a, b) =>
        (rank.get(a.proyecto.tipo ?? "") ?? 99) - (rank.get(b.proyecto.tipo ?? "") ?? 99) ||
        a.index - b.index,
    )
    .map(({ proyecto }) => proyecto);
}

export function destacar(proyectos: DesarrolloInterface[], max = 3) {
  const ordenados = ordenarProyectos(proyectos);
  const salida: DesarrolloInterface[] = [];
  const vistos = new Set<string>();

  for (const tipo of ORDEN_TIPO) {
    const encontrado = ordenados.find((proyecto) => proyecto.tipo === tipo);
    if (!encontrado) continue;
    const clave = encontrado.id ?? encontrado.titulo;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push(encontrado);
    if (salida.length >= max) return salida;
  }

  return salida;
}

export function unicos(valores: string[]) {
  const vistos = new Set<string>();
  const salida: string[] = [];
  for (const valor of valores) {
    const limpio = valor.trim();
    const clave = limpio.toLowerCase();
    if (!limpio || vistos.has(clave)) continue;
    vistos.add(clave);
    salida.push(limpio);
  }
  return salida.sort((a, b) => a.localeCompare(b, "es"));
}

export function herramientasDe(proyecto: DesarrolloInterface) {
  return unicos([...(proyecto.lenguajes ?? []), ...(proyecto.frameworks ?? []), ...(proyecto.librerias ?? [])]);
}

export function imagenPublica(src?: string | null) {
  if (!src) return null;
  if (src.startsWith("https://") || src.startsWith("http://") || src.startsWith("/")) return src;
  return convertirGSUrl(src);
}

export function indice(valor: number) {
  return String(valor).padStart(2, "0");
}
