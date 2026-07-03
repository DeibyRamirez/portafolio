import { firebaseEstaConfigurado, mensajeConfiguracionFirebase } from "@/app/lib/firebase/admin";
import {
  eliminarImagenesStorage,
  subirImagenCertificado,
  subirImagenesProyecto,
} from "@/app/lib/firebase/storage";
import type { CertificadoInput, CertificadoUpdateInput, ProyectoInput, ProyectoUpdateInput } from "@/app/lib/api/validate";
import {
  createCertificado,
  deleteCertificado,
  getCertificadoById,
  updateCertificado,
} from "@/app/lib/data/certificados";
import {
  createProyecto,
  deleteProyecto,
  getProyectoById,
  updateProyecto,
} from "@/app/lib/data/proyectos";
import { DesarrolloInterface } from "@/app/models/Desarrollos";
import { CertificadoInterface } from "@/app/models/Certificados";

/**
 * Crea un proyecto en MongoDB y sube imagenes a Firebase Storage.
 * Orden: 1) MongoDB  2) Storage  3) actualiza rutas gs:// en MongoDB.
 * Si falla Storage, revierte el documento en MongoDB.
 */
export async function crearProyectoConImagenes(
  input: ProyectoInput,
  archivos: File[],
): Promise<DesarrolloInterface> {
  if (archivos.length > 0 && !input.tipo) {
    throw new Error("El campo 'tipo' es requerido cuando se suben imagenes");
  }

  if (archivos.length > 0 && !firebaseEstaConfigurado()) {
    throw new Error(mensajeConfiguracionFirebase());
  }

  const proyecto = await createProyecto({ ...input, imagenes: input.imagenes ?? [] });

  if (archivos.length === 0) {
    return proyecto;
  }

  try {
    const gsUrls = await subirImagenesProyecto(input.tipo!, input.titulo, archivos);
    const imagenes = input.imagenes?.length ? [...input.imagenes, ...gsUrls] : gsUrls;

    const actualizado = await updateProyecto(proyecto.id!, { imagenes });
    return actualizado ?? proyecto;
  } catch (error) {
    await deleteProyecto(proyecto.id!);
    throw error;
  }
}

/**
 * Actualiza un proyecto y opcionalmente sube nuevas imagenes.
 * Por defecto agrega al final. Con reemplazarImagenes=true, reemplaza todas.
 */
export async function actualizarProyectoConImagenes(
  id: string,
  input: ProyectoUpdateInput,
  archivos: File[],
  reemplazarImagenes = false,
): Promise<DesarrolloInterface | null> {
  const existente = await getProyectoById(id);
  if (!existente) return null;

  const tipo = input.tipo ?? existente.tipo;
  const titulo = input.titulo ?? existente.titulo;

  if (archivos.length > 0 && !tipo) {
    throw new Error("El proyecto debe tener 'tipo' para subir imagenes");
  }

  if (archivos.length > 0 && !firebaseEstaConfigurado()) {
    throw new Error(mensajeConfiguracionFirebase());
  }

  let imagenesBase = input.imagenes ?? existente.imagenes;
  let imagenesFinales = imagenesBase;

  if (archivos.length > 0) {
    if (reemplazarImagenes && existente.imagenes.length > 0) {
      await eliminarImagenesStorage(existente.imagenes);
      imagenesBase = [];
    }

    const indiceInicial = reemplazarImagenes ? 1 : imagenesBase.length + 1;
    const nuevasUrls = await subirImagenesProyecto(tipo!, titulo, archivos, indiceInicial);

    imagenesFinales = reemplazarImagenes ? nuevasUrls : [...imagenesBase, ...nuevasUrls];
  }

  return updateProyecto(id, { ...input, imagenes: imagenesFinales });
}

/** Crea certificado en MongoDB y sube imagen a Storage si se proporciona archivo. */
export async function crearCertificadoConImagen(
  input: CertificadoInput,
  archivo: File | null,
): Promise<CertificadoInterface> {
  const tieneArchivo = !!archivo;
  const tieneGsEnBody = !!input.imagen?.startsWith("gs://");

  if (tieneArchivo && !firebaseEstaConfigurado()) {
    throw new Error(mensajeConfiguracionFirebase());
  }

  if (!tieneArchivo && !tieneGsEnBody) {
    throw new Error("Debes enviar la imagen como archivo (multipart) o como ruta gs:// en el JSON");
  }

  const certificado = await createCertificado({
    ...input,
    imagen: tieneArchivo ? "" : input.imagen,
  });

  if (!archivo) {
    return certificado;
  }

  try {
    const gsUrl = await subirImagenCertificado(input.titulo, archivo);
    const actualizado = await updateCertificado(certificado.id!, { imagen: gsUrl });
    return actualizado ?? certificado;
  } catch (error) {
    await deleteCertificado(certificado.id!);
    throw error;
  }
}

/** Actualiza certificado y opcionalmente reemplaza la imagen en Storage. */
export async function actualizarCertificadoConImagen(
  id: string,
  input: CertificadoUpdateInput,
  archivo: File | null,
  reemplazarImagen = false,
): Promise<CertificadoInterface | null> {
  const existente = await getCertificadoById(id);
  if (!existente) return null;

  const titulo = input.titulo ?? existente.titulo;

  if (archivo && !firebaseEstaConfigurado()) {
    throw new Error(mensajeConfiguracionFirebase());
  }

  let imagenFinal = input.imagen ?? existente.imagen;

  if (archivo) {
    if (reemplazarImagen && existente.imagen) {
      await eliminarImagenesStorage([existente.imagen]);
    }
    imagenFinal = await subirImagenCertificado(titulo, archivo);
  }

  return updateCertificado(id, { ...input, imagen: imagenFinal });
}
