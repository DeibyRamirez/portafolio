import { verificarApiKey, respuestaNoAutorizado } from "@/app/lib/api/auth";
import {
  esMultipartRequest,
  parseJsonBody,
  parseMultipartCertificado,
} from "@/app/lib/api/multipart";
import { revalidarPortafolio } from "@/app/lib/api/revalidate";
import { respuestaError, respuestaExito } from "@/app/lib/api/responses";
import { validarCertificadoInput } from "@/app/lib/api/validate";
import { getCertificados } from "@/app/lib/data/certificados";
import { crearCertificadoConImagen } from "@/app/lib/services/recursos-con-imagenes";

export const runtime = "nodejs";

/** GET /api/certificados — Lista todos los certificados (publico). */
export async function GET() {
  try {
    const certificados = await getCertificados();
    return respuestaExito(certificados);
  } catch (error) {
    console.error("Error al obtener los certificados:", error);
    return respuestaError("Error al obtener los certificados", 500);
  }
}

/**
 * POST /api/certificados — Crea un certificado (requiere API key).
 *
 * multipart/form-data:
 * - data: JSON con titulo, institucion, fecha
 * - imagen: archivo de imagen
 */
export async function POST(request: Request) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    let body: unknown;
    let archivoImagen: File | null = null;

    if (esMultipartRequest(request)) {
      const multipart = await parseMultipartCertificado(request);
      body = multipart.body;
      archivoImagen = multipart.archivoImagen;
    } else {
      body = await parseJsonBody(request);
    }

    const validacion = validarCertificadoInput(body, { imagenOpcional: !!archivoImagen });
    if (!validacion.ok) return respuestaError(validacion.message, 400);

    const certificado = await crearCertificadoConImagen(validacion.data, archivoImagen);
    revalidarPortafolio();

    return respuestaExito(certificado, 201);
  } catch (error) {
    console.error("Error al crear el certificado:", error);
    const mensaje = error instanceof Error ? error.message : "Error al crear el certificado";
    return respuestaError(mensaje, 500);
  }
}
