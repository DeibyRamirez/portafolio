import { DesarrolloInterface } from "@/app/models/Desarrollos";

/** Tipos de proyecto permitidos en MongoDB y en la UI. */
export const TIPOS_PROYECTO = [
  "movil",
  "web",
  "game_dev",
  "ciberseguridad",
  "automatizacion",
] as const satisfies readonly NonNullable<DesarrolloInterface["tipo"]>[];

type ResultadoValidacion<T> = { ok: true; data: T } | { ok: false; message: string };

/** Campos requeridos y opcionales para crear un proyecto. */
export type ProyectoInput = {
  tipo?: DesarrolloInterface["tipo"];
  titulo: string;
  descripcion: string;
  imagenes?: string[];
  repositorio?: string;
  lenguajes?: string[];
  frameworks?: string[];
  librerias?: string[];
};

/** Campos parciales para actualizar un proyecto existente. */
export type ProyectoUpdateInput = Partial<ProyectoInput>;

/** Campos requeridos y opcionales para crear un certificado. */
export type CertificadoInput = {
  titulo: string;
  imagen: string;
  institucion?: string;
  fecha?: string;
};

/** Campos parciales para actualizar un certificado existente. */
export type CertificadoUpdateInput = Partial<CertificadoInput>;

function esString(valor: unknown): valor is string {
  return typeof valor === "string";
}

function esArrayStrings(valor: unknown): valor is string[] {
  return Array.isArray(valor) && valor.every((item) => typeof item === "string");
}

function esTipoProyectoValido(valor: unknown): valor is NonNullable<DesarrolloInterface["tipo"]> {
  return typeof valor === "string" && (TIPOS_PROYECTO as readonly string[]).includes(valor);
}

/**
 * Valida el body de una solicitud POST para crear un proyecto.
 * Requiere titulo y descripcion no vacios.
 */
export function validarProyectoInput(body: unknown): ResultadoValidacion<ProyectoInput> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "El cuerpo de la solicitud debe ser un objeto JSON" };
  }

  const datos = body as Record<string, unknown>;

  if (!esString(datos.titulo) || datos.titulo.trim() === "") {
    return { ok: false, message: "El campo 'titulo' es requerido y debe ser un string no vacio" };
  }

  if (!esString(datos.descripcion) || datos.descripcion.trim() === "") {
    return { ok: false, message: "El campo 'descripcion' es requerido y debe ser un string no vacio" };
  }

  if (datos.tipo !== undefined && !esTipoProyectoValido(datos.tipo)) {
    return {
      ok: false,
      message: `El campo 'tipo' debe ser uno de: ${TIPOS_PROYECTO.join(", ")}`,
    };
  }

  if (datos.imagenes !== undefined && !esArrayStrings(datos.imagenes)) {
    return { ok: false, message: "El campo 'imagenes' debe ser un array de strings" };
  }

  if (datos.lenguajes !== undefined && !esArrayStrings(datos.lenguajes)) {
    return { ok: false, message: "El campo 'lenguajes' debe ser un array de strings" };
  }

  if (datos.frameworks !== undefined && !esArrayStrings(datos.frameworks)) {
    return { ok: false, message: "El campo 'frameworks' debe ser un array de strings" };
  }

  if (datos.librerias !== undefined && !esArrayStrings(datos.librerias)) {
    return { ok: false, message: "El campo 'librerias' debe ser un array de strings" };
  }

  if (datos.repositorio !== undefined && !esString(datos.repositorio)) {
    return { ok: false, message: "El campo 'repositorio' debe ser un string" };
  }

  return {
    ok: true,
    data: {
      tipo: datos.tipo as DesarrolloInterface["tipo"],
      titulo: datos.titulo.trim(),
      descripcion: datos.descripcion.trim(),
      imagenes: datos.imagenes as string[] | undefined,
      repositorio: datos.repositorio as string | undefined,
      lenguajes: datos.lenguajes as string[] | undefined,
      frameworks: datos.frameworks as string[] | undefined,
      librerias: datos.librerias as string[] | undefined,
    },
  };
}

/**
 * Valida el body de PUT/PATCH para actualizar un proyecto.
 * Al menos un campo editable debe estar presente, salvo soloArchivos=true (solo multipart).
 */
export function validarProyectoUpdateInput(
  body: unknown,
  opciones?: { soloArchivos?: boolean },
): ResultadoValidacion<ProyectoUpdateInput> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "El cuerpo de la solicitud debe ser un objeto JSON" };
  }

  const datos = body as Record<string, unknown>;
  const camposEditables = [
    "tipo",
    "titulo",
    "descripcion",
    "imagenes",
    "repositorio",
    "lenguajes",
    "frameworks",
    "librerias",
  ] as const;

  const tieneAlgunCampo =
    opciones?.soloArchivos === true ||
    camposEditables.some((campo) => datos[campo] !== undefined);

  if (!tieneAlgunCampo) {
    return { ok: false, message: "Debes enviar al menos un campo para actualizar" };
  }

  if (datos.titulo !== undefined && (!esString(datos.titulo) || datos.titulo.trim() === "")) {
    return { ok: false, message: "El campo 'titulo' debe ser un string no vacio" };
  }

  if (datos.descripcion !== undefined && (!esString(datos.descripcion) || datos.descripcion.trim() === "")) {
    return { ok: false, message: "El campo 'descripcion' debe ser un string no vacio" };
  }

  if (datos.tipo !== undefined && !esTipoProyectoValido(datos.tipo)) {
    return {
      ok: false,
      message: `El campo 'tipo' debe ser uno de: ${TIPOS_PROYECTO.join(", ")}`,
    };
  }

  if (datos.imagenes !== undefined && !esArrayStrings(datos.imagenes)) {
    return { ok: false, message: "El campo 'imagenes' debe ser un array de strings" };
  }

  if (datos.lenguajes !== undefined && !esArrayStrings(datos.lenguajes)) {
    return { ok: false, message: "El campo 'lenguajes' debe ser un array de strings" };
  }

  if (datos.frameworks !== undefined && !esArrayStrings(datos.frameworks)) {
    return { ok: false, message: "El campo 'frameworks' debe ser un array de strings" };
  }

  if (datos.librerias !== undefined && !esArrayStrings(datos.librerias)) {
    return { ok: false, message: "El campo 'librerias' debe ser un array de strings" };
  }

  if (datos.repositorio !== undefined && !esString(datos.repositorio)) {
    return { ok: false, message: "El campo 'repositorio' debe ser un string" };
  }

  const actualizacion: ProyectoUpdateInput = {};

  if (datos.tipo !== undefined) actualizacion.tipo = datos.tipo as DesarrolloInterface["tipo"];
  if (datos.titulo !== undefined) actualizacion.titulo = (datos.titulo as string).trim();
  if (datos.descripcion !== undefined) actualizacion.descripcion = (datos.descripcion as string).trim();
  if (datos.imagenes !== undefined) actualizacion.imagenes = datos.imagenes as string[];
  if (datos.repositorio !== undefined) actualizacion.repositorio = datos.repositorio as string;
  if (datos.lenguajes !== undefined) actualizacion.lenguajes = datos.lenguajes as string[];
  if (datos.frameworks !== undefined) actualizacion.frameworks = datos.frameworks as string[];
  if (datos.librerias !== undefined) actualizacion.librerias = datos.librerias as string[];

  return { ok: true, data: actualizacion };
}

/**
 * Valida el body de POST para crear un certificado.
 * Requiere titulo. La imagen puede venir como archivo multipart (imagenOpcional=true).
 */
export function validarCertificadoInput(
  body: unknown,
  opciones?: { imagenOpcional?: boolean },
): ResultadoValidacion<CertificadoInput> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "El cuerpo de la solicitud debe ser un objeto JSON" };
  }

  const datos = body as Record<string, unknown>;

  if (!esString(datos.titulo) || datos.titulo.trim() === "") {
    return { ok: false, message: "El campo 'titulo' es requerido y debe ser un string no vacio" };
  }

  const imagenOpcional = opciones?.imagenOpcional === true;
  const imagenRaw = datos.imagen;

  if (!imagenOpcional) {
    if (!esString(imagenRaw) || imagenRaw.trim() === "") {
      return { ok: false, message: "El campo 'imagen' es requerido y debe ser un string no vacio" };
    }
  } else if (imagenRaw !== undefined && (!esString(imagenRaw) || imagenRaw.trim() === "")) {
    return { ok: false, message: "Si envias 'imagen' en JSON, debe ser un string no vacio" };
  }

  if (datos.institucion !== undefined && !esString(datos.institucion)) {
    return { ok: false, message: "El campo 'institucion' debe ser un string" };
  }

  if (datos.fecha !== undefined && !esString(datos.fecha)) {
    return { ok: false, message: "El campo 'fecha' debe ser un string" };
  }

  return {
    ok: true,
    data: {
      titulo: datos.titulo.trim(),
      imagen: esString(imagenRaw) ? imagenRaw.trim() : "",
      institucion: datos.institucion as string | undefined,
      fecha: datos.fecha as string | undefined,
    },
  };
}

/**
 * Valida el body de PUT/PATCH para actualizar un certificado.
 * Con soloArchivo=true permite actualizar enviando unicamente un archivo multipart.
 */
export function validarCertificadoUpdateInput(
  body: unknown,
  opciones?: { soloArchivo?: boolean },
): ResultadoValidacion<CertificadoUpdateInput> {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "El cuerpo de la solicitud debe ser un objeto JSON" };
  }

  const datos = body as Record<string, unknown>;
  const camposEditables = ["titulo", "imagen", "institucion", "fecha"] as const;

  const tieneAlgunCampo =
    opciones?.soloArchivo === true ||
    camposEditables.some((campo) => datos[campo] !== undefined);

  if (!tieneAlgunCampo) {
    return { ok: false, message: "Debes enviar al menos un campo para actualizar" };
  }

  if (datos.titulo !== undefined && (!esString(datos.titulo) || datos.titulo.trim() === "")) {
    return { ok: false, message: "El campo 'titulo' debe ser un string no vacio" };
  }

  if (datos.imagen !== undefined && (!esString(datos.imagen) || datos.imagen.trim() === "")) {
    return { ok: false, message: "El campo 'imagen' debe ser un string no vacio" };
  }

  if (datos.institucion !== undefined && !esString(datos.institucion)) {
    return { ok: false, message: "El campo 'institucion' debe ser un string" };
  }

  if (datos.fecha !== undefined && !esString(datos.fecha)) {
    return { ok: false, message: "El campo 'fecha' debe ser un string" };
  }

  const actualizacion: CertificadoUpdateInput = {};

  if (datos.titulo !== undefined) actualizacion.titulo = (datos.titulo as string).trim();
  if (datos.imagen !== undefined) actualizacion.imagen = (datos.imagen as string).trim();
  if (datos.institucion !== undefined) actualizacion.institucion = datos.institucion as string;
  if (datos.fecha !== undefined) actualizacion.fecha = datos.fecha as string;

  return { ok: true, data: actualizacion };
}

/** Tipos exportados para referencia en documentacion y clientes moviles. */
export type TiposProyecto = (typeof TIPOS_PROYECTO)[number];
