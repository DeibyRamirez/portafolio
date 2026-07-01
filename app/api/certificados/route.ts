import { verificarApiKey, respuestaNoAutorizado } from "@/app/lib/api/auth";
import { revalidarPortafolio } from "@/app/lib/api/revalidate";
import { respuestaError, respuestaExito } from "@/app/lib/api/responses";
import { validarCertificadoInput } from "@/app/lib/api/validate";
import { createCertificado, getCertificados } from "@/app/lib/data/certificados";

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

/** POST /api/certificados — Crea un certificado (requiere API key). */
export async function POST(request: Request) {
  if (!verificarApiKey(request)) return respuestaNoAutorizado();

  try {
    const body = await request.json();
    const validacion = validarCertificadoInput(body);

    if (!validacion.ok) return respuestaError(validacion.message, 400);

    const certificado = await createCertificado(validacion.data);
    revalidarPortafolio();

    return respuestaExito(certificado, 201);
  } catch (error) {
    console.error("Error al crear el certificado:", error);
    return respuestaError("Error al crear el certificado", 500);
  }
}
