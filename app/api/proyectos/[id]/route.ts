import { verificarApiKey, respuestaNoAutorizado } from "@/app/lib/api/auth";
import { revalidarPortafolio } from "@/app/lib/api/revalidate";
import { respuestaError, respuestaExito, respuestaNoEncontrado } from "@/app/lib/api/responses";
import { validarProyectoUpdateInput } from "@/app/lib/api/validate";
import {
  deleteProyecto,
  getProyectoById,
  updateProyecto,
} from "@/app/lib/data/proyectos";

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

/** PUT /api/proyectos/:id — Actualiza un proyecto (requiere API key). */
export async function PUT(request: Request, { params }: RouteParams) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    const { id } = await params;
    const body = await request.json();
    const validacion = validarProyectoUpdateInput(body);

    if (!validacion.ok) return respuestaError(validacion.message, 400);

    const proyecto = await updateProyecto(id, validacion.data);

    if (!proyecto) return respuestaNoEncontrado("Proyecto");

    revalidarPortafolio();
    return respuestaExito(proyecto);
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    return respuestaError("Error al actualizar el proyecto", 500);
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
