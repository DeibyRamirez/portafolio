import { ObjectId } from "mongodb";
import { COLLECCIONES, getMongoClient } from "@/app/lib/database";
import type { ProyectoInput, ProyectoUpdateInput } from "@/app/lib/api/validate";
import { DesarrolloInterface } from "@/app/models/Desarrollos";

const DB_NAME = "Portafolio";

type ProyectoDocumento = {
  _id: { toString(): string };
  tipo?: DesarrolloInterface["tipo"];
  titulo: string;
  descripcion: string;
  imagenes: string[];
  repositorio?: string;
  lenguajes: string[];
  frameworks: string[];
  librerias: string[];
};

/** Convierte un documento MongoDB al formato expuesto por la API. */
function mapProyecto(doc: ProyectoDocumento): DesarrolloInterface {
  return {
    id: doc._id.toString(),
    tipo: doc.tipo,
    titulo: doc.titulo,
    descripcion: doc.descripcion,
    imagenes: doc.imagenes ?? [],
    repositorio: doc.repositorio,
    lenguajes: doc.lenguajes ?? [],
    frameworks: doc.frameworks ?? [],
    librerias: doc.librerias ?? [],
  };
}

/** Valida y parsea un ID de MongoDB. Retorna null si el formato es invalido. */
function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

/**
 * Obtiene todos los proyectos de la coleccion.
 * En caso de error retorna array vacio (degradacion graceful para CI/build).
 */
export async function getProyectos(): Promise<DesarrolloInterface[]> {
  try {
    const clienteMongo = await getMongoClient();
    const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.PROYECTOS);
    const documentos = await coleccion.find({}).toArray();
    return documentos.map((doc) => mapProyecto(doc as unknown as ProyectoDocumento));
  } catch (error) {
    console.error("Error al obtener proyectos desde MongoDB:", error);
    return [];
  }
}

/**
 * Obtiene un proyecto por su ID de MongoDB.
 * Retorna null si el ID es invalido o el documento no existe.
 */
export async function getProyectoById(id: string): Promise<DesarrolloInterface | null> {
  const objectId = parseObjectId(id);
  if (!objectId) return null;

  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.PROYECTOS);
  const documento = await coleccion.findOne({ _id: objectId });

  if (!documento) return null;
  return mapProyecto(documento as unknown as ProyectoDocumento);
}

/**
 * Crea un nuevo proyecto en MongoDB.
 * Retorna el proyecto creado con su ID generado.
 */
export async function createProyecto(input: ProyectoInput): Promise<DesarrolloInterface> {
  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.PROYECTOS);

  const documento = {
    tipo: input.tipo,
    titulo: input.titulo,
    descripcion: input.descripcion,
    imagenes: input.imagenes ?? [],
    repositorio: input.repositorio,
    lenguajes: input.lenguajes ?? [],
    frameworks: input.frameworks ?? [],
    librerias: input.librerias ?? [],
  };

  const resultado = await coleccion.insertOne(documento);

  return mapProyecto({
    _id: resultado.insertedId,
    ...documento,
  } as ProyectoDocumento);
}

/**
 * Actualiza parcialmente un proyecto existente.
 * Solo modifica los campos presentes en el input.
 * Retorna null si el ID es invalido o el documento no existe.
 */
export async function updateProyecto(
  id: string,
  input: ProyectoUpdateInput,
): Promise<DesarrolloInterface | null> {
  const objectId = parseObjectId(id);
  if (!objectId) return null;

  const camposActualizados: Record<string, unknown> = {};

  if (input.tipo !== undefined) camposActualizados.tipo = input.tipo;
  if (input.titulo !== undefined) camposActualizados.titulo = input.titulo;
  if (input.descripcion !== undefined) camposActualizados.descripcion = input.descripcion;
  if (input.imagenes !== undefined) camposActualizados.imagenes = input.imagenes;
  if (input.repositorio !== undefined) camposActualizados.repositorio = input.repositorio;
  if (input.lenguajes !== undefined) camposActualizados.lenguajes = input.lenguajes;
  if (input.frameworks !== undefined) camposActualizados.frameworks = input.frameworks;
  if (input.librerias !== undefined) camposActualizados.librerias = input.librerias;

  if (Object.keys(camposActualizados).length === 0) {
    return getProyectoById(id);
  }

  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.PROYECTOS);

  const resultado = await coleccion.findOneAndUpdate(
    { _id: objectId },
    { $set: camposActualizados },
    { returnDocument: "after" },
  );

  if (!resultado) return null;
  return mapProyecto(resultado as unknown as ProyectoDocumento);
}

/**
 * Elimina un proyecto por ID.
 * Retorna true si se elimino, false si el ID es invalido o no existia.
 */
export async function deleteProyecto(id: string): Promise<boolean> {
  const objectId = parseObjectId(id);
  if (!objectId) return false;

  const clienteMongo = await getMongoClient();
  const coleccion = clienteMongo.db(DB_NAME).collection(COLLECCIONES.PROYECTOS);
  const resultado = await coleccion.deleteOne({ _id: objectId });

  return resultado.deletedCount === 1;
}

/** Filtra proyectos por tipo de categoria tecnica (uso en la pagina principal). */
export function filtrarProyectosPorTipo(
  proyectos: DesarrolloInterface[],
  tipo: NonNullable<DesarrolloInterface["tipo"]>,
): DesarrolloInterface[] {
  return proyectos.filter((proyecto) => proyecto.tipo === tipo);
}
