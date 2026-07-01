import { verificarApiKey, respuestaNoAutorizado } from "@/app/lib/api/auth";
import { revalidarPortafolio } from "@/app/lib/api/revalidate";
import { respuestaError, respuestaExito, respuestaNoEncontrado } from "@/app/lib/api/responses";
import { validarCertificadoUpdateInput } from "@/app/lib/api/validate";
import {
  deleteCertificado,
  getCertificadoById,
  updateCertificado,
} from "@/app/lib/data/certificados";

type RouteParams = { params: Promise<{ id: string }> };

/** GET /api/certificados/:id — Obtiene un certificado por ID (publico). */
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const certificado = await getCertificadoById(id);

    if (!certificado) return respuestaNoEncontrado("Certificado");

    return respuestaExito(certificado);
  } catch (error) {
    console.error("Error al obtener el certificado:", error);
    return respuestaError("Error al obtener el certificado", 500);
  }
}

/** PUT /api/certificados/:id — Actualiza un certificado (requiere API key). */
export async function PUT(request: Request, { params }: RouteParams) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    const { id } = await params;
    const body = await request.json();
    const validacion = validarCertificadoUpdateInput(body);

    if (!validacion.ok) return respuestaError(validacion.message, 400);

    const certificado = await updateCertificado(id, validacion.data);

    if (!certificado) return respuestaNoEncontrado("Certificado");

    revalidarPortafolio();
    return respuestaExito(certificado);
  } catch (error) {
    console.error("Error al actualizar el certificado:", error);
    return respuestaError("Error al actualizar el certificado", 500);
  }
}

/** PATCH /api/certificados/:id — Alias de PUT para actualizacion parcial (requiere API key). */
export async function PATCH(request: Request, context: RouteParams) {
  return PUT(request, context);
}

/** DELETE /api/certificados/:id — Elimina un certificado (requiere API key). */
export async function DELETE(request: Request, { params }: RouteParams) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    const { id } = await params;
    const eliminado = await deleteCertificado(id);

    if (!eliminado) return respuestaNoEncontrado("Certificado");

    revalidarPortafolio();
    return respuestaExito({ message: "Certificado eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el certificado:", error);
    return respuestaError("Error al eliminar el certificado", 500);
  }
}
