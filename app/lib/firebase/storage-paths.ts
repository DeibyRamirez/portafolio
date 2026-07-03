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
