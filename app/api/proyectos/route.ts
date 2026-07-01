import { verificarApiKey, respuestaNoAutorizado } from "@/app/lib/api/auth";
import { revalidarPortafolio } from "@/app/lib/api/revalidate";
import { respuestaError, respuestaExito } from "@/app/lib/api/responses";
import { validarProyectoInput } from "@/app/lib/api/validate";
import { createProyecto, getProyectos } from "@/app/lib/data/proyectos";

/** GET /api/proyectos — Lista todos los proyectos (publico). */
export async function GET() {
  try {
    const proyectos = await getProyectos();
    return respuestaExito(proyectos);
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);
    return respuestaError("Error al obtener los proyectos", 500);
  }
}

/** POST /api/proyectos — Crea un proyecto (requiere API key). */
export async function POST(request: Request) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    const body = await request.json();
    const validacion = validarProyectoInput(body);

    if (!validacion.ok) return respuestaError(validacion.message, 400);

    const proyecto = await createProyecto(validacion.data);
    revalidarPortafolio();

    return respuestaExito(proyecto, 201);
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    return respuestaError("Error al crear el proyecto", 500);
  }
}
