import { verificarApiKey, respuestaNoAutorizado } from "@/app/lib/api/auth";
import {
  esMultipartRequest,
  parseJsonBody,
  parseMultipartProyecto,
} from "@/app/lib/api/multipart";
import { revalidarPortafolio } from "@/app/lib/api/revalidate";
import { respuestaError, respuestaExito, respuestaNoEncontrado } from "@/app/lib/api/responses";
import { validarProyectoUpdateInput } from "@/app/lib/api/validate";
import { deleteProyecto, getProyectoById } from "@/app/lib/data/proyectos";
import { actualizarProyectoConImagenes } from "@/app/lib/services/recursos-con-imagenes";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

/** GET /api/proyectos/:id — Obtiene un proyecto por ID (publico). */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const proyecto = await getProyectoById(id);

    if (!proyecto) return respuestaNoEncontrado("Proyecto");

    return respuestaExito(proyecto);
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);
    return respuestaError("Error al obtener el proyecto", 500);
  }
}

/**
 * PUT /api/proyectos/:id — Actualiza un proyecto (requiere API key).
 * Acepta JSON o multipart con archivos `imagenes`.
 * Flag `reemplazarImagenes=true` sobrescribe las imagenes existentes.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    const { id } = await params;
    let body: unknown;
    let archivosImagen: File[] = [];
    let reemplazarImagenes = false;

    if (esMultipartRequest(request)) {
      const multipart = await parseMultipartProyecto(request);
      body = multipart.body;
      archivosImagen = multipart.archivosImagen;
      reemplazarImagenes = multipart.reemplazarImagenes;
    } else {
      body = await parseJsonBody(request);
    }

    const validacion = validarProyectoUpdateInput(body, {
      soloArchivos: archivosImagen.length > 0,
    });

    if (!validacion.ok) return respuestaError(validacion.message, 400);

    const proyecto = await actualizarProyectoConImagenes(
      id,
      validacion.data,
      archivosImagen,
      reemplazarImagenes,
    );

    if (!proyecto) return respuestaNoEncontrado("Proyecto");

    revalidarPortafolio();
    return respuestaExito(proyecto);
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    const mensaje = error instanceof Error ? error.message : "Error al actualizar el proyecto";
    return respuestaError(mensaje, 500);
  }
}

/** PATCH /api/proyectos/:id — Alias de PUT para actualizacion parcial (requiere API key). */
export async function PATCH(request: Request, context: RouteParams) {
  return PUT(request, context);
}

/** DELETE /api/proyectos/:id — Elimina un proyecto (requiere API key). */
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    const { id } = await params;
    const eliminado = await deleteProyecto(id);

    if (!eliminado) return respuestaNoEncontrado("Proyecto");

    revalidarPortafolio();
    return respuestaExito({ message: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error);
    return respuestaError("Error al eliminar el proyecto", 500);
  }
}
