import { ObjectId } from "mongodb";
import { COLLECCIONES, getMongoClient } from "@/app/lib/database";
import type { CertificadoInput, CertificadoUpdateInput } from "@/app/lib/api/validate";
import { CertificadoInterface } from "@/app/models/Certificados";

const DB_NAME = "Portafolio";

type CertificadoDocumento = {
  _id: { toString(): string };
  titulo: string;
  imagen: string;
  institucion?: string;
  fecha?: string;
};

/** Convierte un documento MongoDB al formato expuesto por la API. */
function mapCertificado(doc: CertificadoDocumento): CertificadoInterface {
  return {
    id: doc._id.toString(),
    titulo: doc.titulo,
    imagen: doc.imagen,
    institucion: doc.institucion,
    fecha: doc.fecha,
  };
}

/** Valida y parsea un ID de MongoDB. Retorna null si el formato es invalido. */
function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

/**
 * Obtiene todos los certificados de la coleccion.
 * En caso de error retorna array vacio (degradacion graceful para CI/build).
 */
export async function getCertificados(): Promise<CertificadoInterface[]> {
  try {
    const clienteMongo = await getMongoClient();
    const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.CERTIFICADOS);
    const documentos = await coleccion.find({}).toArray();
    return documentos.map((doc) => mapCertificado(doc as unknown as CertificadoDocumento));
  } catch (error) {
    console.error("Error al obtener certificados desde MongoDB:", error);
    return [];
  }
}

/**
 * Obtiene un certificado por su ID de MongoDB.
 * Retorna null si el ID es invalido o el documento no existe.
 */
export async function getCertificadoById(id: string): Promise<CertificadoInterface | null> {
  const objectId = parseObjectId(id);
  if (!objectId) return null;

  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.CERTIFICADOS);
  const documento = await coleccion.findOne({ _id: objectId });

  if (!documento) return null;
  return mapCertificado(documento as unknown as CertificadoDocumento);
}

/**
 * Crea un nuevo certificado en MongoDB.
 * Retorna el certificado creado con su ID generado.
 */
export async function createCertificado(input: CertificadoInput): Promise<CertificadoInterface> {
  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.CERTIFICADOS);

  const documento = {
    titulo: input.titulo,
    imagen: input.imagen,
    institucion: input.institucion,
    fecha: input.fecha,
  };

  const resultado = await coleccion.insertOne(documento);

  return mapCertificado({
    _id: resultado.insertedId,
    ...documento,
  } as CertificadoDocumento);
}

/**
 * Actualiza parcialmente un certificado existente.
 * Retorna null si el ID es invalido o el documento no existe.
 */
export async function updateCertificado(
  id: string,
  input: CertificadoUpdateInput,
): Promise<CertificadoInterface | null> {
  const objectId = parseObjectId(id);
  if (!objectId) return null;

  const camposActualizados: Record<string, unknown> = {};

  if (input.titulo !== undefined) camposActualizados.titulo = input.titulo;
  if (input.imagen !== undefined) camposActualizados.imagen = input.imagen;
  if (input.institucion !== undefined) camposActualizados.institucion = input.institucion;
  if (input.fecha !== undefined) camposActualizados.fecha = input.fecha;

  if (Object.keys(camposActualizados).length === 0) {
    return getCertificadoById(id);
  }

  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.CERTIFICADOS);

  const resultado = await coleccion.findOneAndUpdate(
    { _id: objectId },
    { $set: camposActualizados },
    { returnDocument: "after" },
  );

  if (!resultado) return null;
  return mapCertificado(resultado as unknown as CertificadoDocumento);
}

/**
 * Elimina un certificado por ID.
 * Retorna true si se elimino, false si el ID es invalido o no existia.
 */
export async function deleteCertificado(id: string): Promise<boolean> {
  const objectId = parseObjectId(id);
  if (!objectId) return false;

  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.CERTIFICADOS);
  const resultado = await coleccion.deleteOne({ _id: objectId });

  return resultado.deletedCount === 1;
}
