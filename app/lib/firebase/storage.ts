import {
  construirGsUrl,
  construirRutaImagenCertificado,
  construirRutaImagenProyecto,
} from "@/app/lib/firebase/storage-paths";
import { validarArchivoImagen } from "@/app/lib/firebase/validar-imagen";
import { getFirebaseBucket } from "@/app/lib/firebase/admin";

async function subirBufferStorage(
  rutaStorage: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const bucket = getFirebaseBucket();

  await bucket.file(rutaStorage).save(buffer, {
    metadata: { contentType },
    resumable: false,
  });

  return construirGsUrl(rutaStorage);
}

/**
 * Sube imagenes de un proyecto a Firebase Storage.
 * Ruta: proyectos/{tipo}/{titulo}/{titulo}_n.ext
 */
export async function subirImagenesProyecto(
  tipo: string,
  titulo: string,
  archivos: File[],
  indiceInicial = 1,
): Promise<string[]> {
  const gsUrls: string[] = [];

  for (let i = 0; i < archivos.length; i++) {
    const { formato, buffer, contentType } = await validarArchivoImagen(archivos[i]);
    const indice = indiceInicial + i;
    const ruta = construirRutaImagenProyecto(tipo, titulo, indice, formato);
    const gsUrl = await subirBufferStorage(ruta, buffer, contentType);
    gsUrls.push(gsUrl);
  }

  return gsUrls;
}

/**
 * Sube la imagen de un certificado a Firebase Storage.
 * Ruta: certificados/{titulo}/{titulo}_1.ext
 */
export async function subirImagenCertificado(titulo: string, archivo: File): Promise<string> {
  const { formato, buffer, contentType } = await validarArchivoImagen(archivo);
  const ruta = construirRutaImagenCertificado(titulo, 1, formato);
  return subirBufferStorage(ruta, buffer, contentType);
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
