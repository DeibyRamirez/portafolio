import {
  construirGsUrl,
  construirRutaImagenCertificado,
  construirRutaImagenProyecto,
  esImagenPermitida,
  obtenerExtensionArchivo,
} from "@/app/lib/firebase/storage-paths";
import { getFirebaseBucket } from "@/app/lib/firebase/admin";

async function subirArchivoStorage(rutaStorage: string, archivo: File): Promise<string> {
  const bucket = getFirebaseBucket();
  const buffer = Buffer.from(await archivo.arrayBuffer());

  await bucket.file(rutaStorage).save(buffer, {
    metadata: { contentType: archivo.type || "image/png" },
    resumable: false,
  });

  return construirGsUrl(rutaStorage);
}

function validarArchivosImagen(archivos: File[]): void {
  for (const archivo of archivos) {
    if (!esImagenPermitida(archivo)) {
      throw new Error(
        `Tipo de archivo no permitido: ${archivo.name}. Usa PNG, JPG, WEBP o GIF.`,
      );
    }
  }
}

/**
 * Sube imagenes de un proyecto a Firebase Storage.
 * Ruta: proyectos/{tipo}/{titulo}/{titulo}_n.ext
 *
 * @param indiceInicial Numero de la primera imagen (default 1). Util para append en updates.
 */
export async function subirImagenesProyecto(
  tipo: string,
  titulo: string,
  archivos: File[],
  indiceInicial = 1,
): Promise<string[]> {
  validarArchivosImagen(archivos);

  const gsUrls: string[] = [];

  for (let i = 0; i < archivos.length; i++) {
    const indice = indiceInicial + i;
    const extension = obtenerExtensionArchivo(archivos[i]);
    const ruta = construirRutaImagenProyecto(tipo, titulo, indice, extension);
    const gsUrl = await subirArchivoStorage(ruta, archivos[i]);
    gsUrls.push(gsUrl);
  }

  return gsUrls;
}

/**
 * Sube la imagen de un certificado a Firebase Storage.
 * Ruta: certificados/{titulo}/{titulo}_1.ext
 */
export async function subirImagenCertificado(titulo: string, archivo: File): Promise<string> {
  validarArchivosImagen([archivo]);

  const extension = obtenerExtensionArchivo(archivo);
  const ruta = construirRutaImagenCertificado(titulo, 1, extension);
  return subirArchivoStorage(ruta, archivo);
}

/** Elimina archivos de Storage a partir de sus rutas gs://. */
export async function eliminarImagenesStorage(gsUrls: string[]): Promise<void> {
  if (gsUrls.length === 0) return;

  const bucket = getFirebaseBucket();
  const prefijo = `gs://${bucket.name}/`;

  await Promise.all(
    gsUrls.map(async (gsUrl) => {
      if (!gsUrl.startsWith(prefijo)) return;
      const ruta = gsUrl.slice(prefijo.length);
      try {
        await bucket.file(ruta).delete({ ignoreNotFound: true });
      } catch (error) {
        console.warn(`No se pudo eliminar ${ruta} de Storage:`, error);
      }
    }),
  );
}
