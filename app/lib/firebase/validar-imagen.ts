/** Formatos de imagen aceptados en uploads. */
export type FormatoImagen = "png" | "jpg" | "webp" | "gif";

export const FORMATOS_IMAGEN_PERMITIDOS: FormatoImagen[] = ["png", "jpg", "webp", "gif"];

export const ETIQUETA_FORMATOS_PERMITIDOS = "PNG, JPG, WEBP o GIF";

const MIME_A_FORMATO: Record<string, FormatoImagen> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** MIME genericos que envian clientes moviles (Flutter, Android) en multipart. */
const MIMES_GENERICOS = new Set([
  "",
  "application/octet-stream",
  "binary/octet-stream",
  "application/x-binary",
]);

/** Normaliza extension de archivo a formato permitido. */
export function normalizarExtension(extension: string): FormatoImagen | null {
  const ext = extension.toLowerCase();
  if (ext === "jpeg") return "jpg";
  if (FORMATOS_IMAGEN_PERMITIDOS.includes(ext as FormatoImagen)) {
    return ext as FormatoImagen;
  }
  return null;
}

/** Obtiene formato esperado desde el nombre del archivo. */
export function formatoDesdeNombre(nombre: string): FormatoImagen | null {
  const partes = nombre.split(".");
  if (partes.length < 2) return null;
  return normalizarExtension(partes.pop()!);
}

/**
 * Detecta el formato real leyendo los magic bytes del archivo.
 * Evita aceptar archivos renombrados (.exe → .jpg).
 */
export function detectarFormatoDesdeBytes(buffer: Buffer): FormatoImagen | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "png";
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  // GIF: GIF8
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
    return "gif";
  }

  // WEBP: RIFF....WEBP
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

function mimeEsGenerico(mime: string): boolean {
  return MIMES_GENERICOS.has(mime.toLowerCase());
}

function contentTypeDesdeFormato(formato: FormatoImagen): string {
  return (
    {
      png: "image/png",
      jpg: "image/jpeg",
      webp: "image/webp",
      gif: "image/gif",
    } satisfies Record<FormatoImagen, string>
  )[formato];
}

export type ArchivoImagenValidado = {
  formato: FormatoImagen;
  buffer: Buffer;
  contentType: string;
};

/**
 * Valida un archivo de imagen antes de subirlo a Storage.
 *
 * Reglas:
 * 1. El contenido real (magic bytes) debe ser PNG, JPG, WEBP o GIF.
 * 2. Si el nombre tiene extension, debe coincidir con el contenido.
 * 3. Si el MIME no es generico, debe ser compatible con el contenido.
 *
 * Compatible con Flutter/Android que envian application/octet-stream + .jpg
 */
export async function validarArchivoImagen(archivo: File): Promise<ArchivoImagenValidado> {
  const buffer = Buffer.from(await archivo.arrayBuffer());
  const formatoReal = detectarFormatoDesdeBytes(buffer);

  if (!formatoReal) {
    throw new Error(
      `Formato no permitido: "${archivo.name}". Solo se aceptan ${ETIQUETA_FORMATOS_PERMITIDOS}.`,
    );
  }

  const formatoNombre = formatoDesdeNombre(archivo.name);
  if (formatoNombre && formatoNombre !== formatoReal) {
    throw new Error(
      `La extension de "${archivo.name}" no coincide con su contenido (${formatoReal.toUpperCase()}).`,
    );
  }

  const mime = archivo.type?.toLowerCase() ?? "";
  if (mime && !mimeEsGenerico(mime)) {
    const formatoMime = MIME_A_FORMATO[mime];
    if (formatoMime && formatoMime !== formatoReal) {
      throw new Error(
        `El tipo MIME de "${archivo.name}" (${mime}) no coincide con su contenido real.`,
      );
    }
  }

  return {
    formato: formatoReal,
    buffer,
    contentType: contentTypeDesdeFormato(formatoReal),
  };
}

/** @deprecated Usar validarArchivoImagen para validacion completa. */
export function esImagenPermitida(archivo: File): boolean {
  const formatoNombre = formatoDesdeNombre(archivo.name);
  if (formatoNombre) return true;

  const mime = archivo.type?.toLowerCase() ?? "";
  if (mime && !mimeEsGenerico(mime)) {
    return mime in MIME_A_FORMATO;
  }

  return false;
}

/** @deprecated Usar validarArchivoImagen().formato */
export function obtenerExtensionArchivo(archivo: File): string {
  return formatoDesdeNombre(archivo.name) ?? "png";
}

/** Tipos MIME aceptados (referencia documentacion). */
export const MIME_IMAGENES_PERMITIDOS = Object.keys(MIME_A_FORMATO);
