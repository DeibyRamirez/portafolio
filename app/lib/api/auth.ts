/**
 * Autenticacion por API key para operaciones de escritura (POST, PUT, PATCH, DELETE).
 *
 * La clave se configura en la variable de entorno PORTFOLIO_API_KEY.
 * Se acepta en el header Authorization (Bearer) o X-API-Key.
 *
 * Las operaciones GET permanecen publicas para consumo del sitio y app movil.
 */

/**
 * Verifica que la solicitud incluya una API key valida.
 * Retorna false si PORTFOLIO_API_KEY no esta configurada o la clave no coincide.
 */
export function verificarApiKey(request: Request): boolean {
  const apiKey = process.env.PORTFOLIO_API_KEY;

  if (!apiKey) {
    console.warn("PORTFOLIO_API_KEY no configurada: operaciones de escritura bloqueadas");
    return false;
  }

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7) === apiKey;
  }

  const headerKey = request.headers.get("X-API-Key");
  return headerKey === apiKey;
}

/** Respuesta estandar 401 cuando falta o es invalida la API key. */
export function respuestaNoAutorizado() {
  return Response.json(
    { message: "No autorizado. Proporciona una API key valida en Authorization o X-API-Key." },
    { status: 401 },
  );
}
