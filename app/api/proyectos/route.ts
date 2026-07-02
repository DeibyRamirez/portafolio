import { verificarApiKey, respuestaNoAutorizado } from "@/app/lib/api/auth";
import {
  esMultipartRequest,
  parseJsonBody,
  parseMultipartProyecto,
} from "@/app/lib/api/multipart";
import { revalidarPortafolio } from "@/app/lib/api/revalidate";
import { respuestaError, respuestaExito } from "@/app/lib/api/responses";
import { validarProyectoInput } from "@/app/lib/api/validate";
import { getProyectos } from "@/app/lib/data/proyectos";
import { crearProyectoConImagenes } from "@/app/lib/services/recursos-con-imagenes";

export const runtime = "nodejs";

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

/**
 * POST /api/proyectos — Crea un proyecto (requiere API key).
 *
 * Soporta dos formatos:
 * - application/json (metadata + rutas gs:// opcionales)
 * - multipart/form-data con campo `data` (JSON) + archivos `imagenes`
 */
export async function POST(request: Request) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    let body: unknown;
    let archivosImagen: File[] = [];

    if (esMultipartRequest(request)) {
      const multipart = await parseMultipartProyecto(request);
      body = multipart.body;
      archivosImagen = multipart.archivosImagen;
    } else {
      body = await parseJsonBody(request);
    }

    const validacion = validarProyectoInput(body);
    if (!validacion.ok) return respuestaError(validacion.message, 400);

    if (archivosImagen.length > 0 && !validacion.data.tipo) {
      return respuestaError(
        "El campo 'tipo' es requerido cuando se suben imagenes (categoria en Storage)",
        400,
      );
    }

    const proyecto = await crearProyectoConImagenes(validacion.data, archivosImagen);
    revalidarPortafolio();

    return respuestaExito(proyecto, 201);
  } catch (error) {
    console.error("Error al crear el proyecto:", error);
    const mensaje = error instanceof Error ? error.message : "Error al crear el proyecto";
    return respuestaError(mensaje, 500);
  }
}
