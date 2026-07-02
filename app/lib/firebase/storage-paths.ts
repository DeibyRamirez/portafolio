/** Bucket de Firebase Storage del portafolio. */
export const FIREBASE_BUCKET = "portafoliodeibyramirez.firebasestorage.app";

/**
 * Estructura de Storage:
 * - proyectos/{tipo}/{titulo}/{titulo}_n.ext
 * - certificados/{titulo}/{titulo}_n.ext
 */

/** Ruta relativa de la carpeta del proyecto (sin nombre de archivo). */
export function construirCarpetaProyecto(tipo: string, titulo: string): string {
  return `proyectos/${tipo}/${titulo}`;
}

/** Ruta relativa de la carpeta del certificado. */
export function construirCarpetaCertificado(titulo: string): string {
  return `certificados/${titulo}`;
}

/** Nombre de archivo: {titulo}_{indice}.{extension} */
export function construirNombreImagen(titulo: string, indice: number, extension: string): string {
  return `${titulo}_${indice}.${extension}`;
}

/** Ruta completa en Storage para una imagen de proyecto. */
export function construirRutaImagenProyecto(
  tipo: string,
  titulo: string,
  indice: number,
  extension: string,
): string {
  return `${construirCarpetaProyecto(tipo, titulo)}/${construirNombreImagen(titulo, indice, extension)}`;
}

/** Ruta completa en Storage para una imagen de certificado. */
export function construirRutaImagenCertificado(
  titulo: string,
  indice: number,
  extension: string,
): string {
  return `${construirCarpetaCertificado(titulo)}/${construirNombreImagen(titulo, indice, extension)}`;
}

/** Convierte ruta relativa de Storage a URI gs://. */
export function construirGsUrl(rutaStorage: string): string {
  return `gs://${FIREBASE_BUCKET}/${rutaStorage}`;
}

/** Extension permitida a partir del archivo subido. Default: png. */
export function obtenerExtensionArchivo(archivo: File): string {
  const desdeNombre = archivo.name.split(".").pop()?.toLowerCase();

  if (desdeNombre && ["png", "jpg", "jpeg", "webp", "gif"].includes(desdeNombre)) {
    return desdeNombre === "jpeg" ? "jpg" : desdeNombre;
  }

  const desdeMime: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  return desdeMime[archivo.type] ?? "png";
}

/** Tipos MIME aceptados en uploads. */
export const MIME_IMAGENES_PERMITIDOS = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export function esImagenPermitida(archivo: File): boolean {
  if (!archivo.type) {
    const ext = archivo.name.split(".").pop()?.toLowerCase();
    return !!ext && ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
  }
  return (MIME_IMAGENES_PERMITIDOS as readonly string[]).includes(archivo.type);
}
