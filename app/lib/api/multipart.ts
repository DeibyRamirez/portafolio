/**
 * Parseo de requests multipart/form-data para la API.
 *
 * Formato esperado:
 * - Campo `data`: JSON string con metadata del recurso
 * - Campo `imagenes`: uno o varios archivos (proyectos)
 * - Campo `imagen`: un archivo (certificados)
 * - Campo opcional `reemplazarImagenes`: "true" para sobrescribir imagenes existentes
 */

export type MultipartProyectoPayload = {
  body: unknown;
  archivosImagen: File[];
  reemplazarImagenes: boolean;
};

export type MultipartCertificadoPayload = {
  body: unknown;
  archivoImagen: File | null;
  reemplazarImagen: boolean;
};

function esArchivoValido(valor: FormDataEntryValue): valor is File {
  return valor instanceof File && valor.size > 0;
}

function parsearBooleano(valor: FormDataEntryValue | null): boolean {
  if (typeof valor !== "string") return false;
  return valor.toLowerCase() === "true" || valor === "1";
}

function extraerJson(formData: FormData, campo = "data"): unknown {
  const raw = formData.get(campo);

  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error(`El campo '${campo}' debe contener un JSON valido`);
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error(`El campo '${campo}' no contiene JSON valido`);
  }
}

/** Indica si el request es multipart/form-data. */
export function esMultipartRequest(request: Request): boolean {
  const contentType = request.headers.get("content-type") ?? "";
  return contentType.includes("multipart/form-data");
}

/** Parsea POST/PATCH de proyectos con archivos opcionales. */
export async function parseMultipartProyecto(request: Request): Promise<MultipartProyectoPayload> {
  const formData = await request.formData();

  return {
    body: extraerJson(formData),
    archivosImagen: formData.getAll("imagenes").filter(esArchivoValido),
    reemplazarImagenes: parsearBooleano(formData.get("reemplazarImagenes")),
  };
}

/** Parsea POST/PATCH de certificados con archivo opcional. */
export async function parseMultipartCertificado(request: Request): Promise<MultipartCertificadoPayload> {
  const formData = await request.formData();
  const imagen = formData.get("imagen");

  return {
    body: extraerJson(formData),
    archivoImagen: imagen !== null && esArchivoValido(imagen) ? imagen : null,
    reemplazarImagen: parsearBooleano(formData.get("reemplazarImagen")),
  };
}

/** Parsea body JSON o retorna null si es multipart (para delegar al parser multipart). */
export async function parseJsonBody(request: Request): Promise<unknown> {
  return request.json() as Promise<unknown>;
}
