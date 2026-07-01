/**
 * Helpers para respuestas JSON consistentes en los Route Handlers.
 */

/** Respuesta de error con mensaje y codigo HTTP. */
export function respuestaError(message: string, status: number) {
  return Response.json({ message }, { status });
}

/** Respuesta exitosa con datos y codigo HTTP opcional (default 200). */
export function respuestaExito<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

/** Respuesta 404 cuando no se encuentra un recurso por ID. */
export function respuestaNoEncontrado(recurso: string) {
  return respuestaError(`${recurso} no encontrado`, 404);
}
