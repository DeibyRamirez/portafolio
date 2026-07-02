import { readFileSync } from "fs";
import { resolve } from "path";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { FIREBASE_BUCKET } from "@/app/lib/firebase/storage-paths";

let firebaseApp: App | undefined;

type ServiceAccount = Parameters<typeof cert>[0];

/** Lee credenciales desde archivo JSON (util en desarrollo local). */
function leerCredencialesDesdeArchivo(): ServiceAccount | null {
  const ruta = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!ruta) return null;

  try {
    const rutaAbsoluta = resolve(process.cwd(), ruta);
    const contenido = readFileSync(rutaAbsoluta, "utf-8");
    return JSON.parse(contenido) as ServiceAccount;
  } catch (error) {
    console.error("Error al leer FIREBASE_SERVICE_ACCOUNT_PATH:", error);
    return null;
  }
}

/** Parsea el JSON del service account desde variable de entorno. */
function leerCredencialesDesdeEnv(): ServiceAccount | null {
  const jsonCredenciales = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!jsonCredenciales) return null;

  try {
    return JSON.parse(jsonCredenciales) as ServiceAccount;
  } catch (error) {
    console.error("FIREBASE_SERVICE_ACCOUNT_JSON no es un JSON valido:", error);
    return null;
  }
}

/** Construye credenciales desde variables separadas. */
function leerCredencialesSeparadas(): ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) return null;

  return { projectId, clientEmail, privateKey };
}

function obtenerCredenciales(): ServiceAccount | null {
  return leerCredencialesDesdeArchivo() ?? leerCredencialesDesdeEnv() ?? leerCredencialesSeparadas();
}

/**
 * Inicializa Firebase Admin con credenciales de service account.
 *
 * Opciones (en orden de prioridad):
 * 1. FIREBASE_SERVICE_ACCOUNT_PATH — ruta a archivo .json (local)
 * 2. FIREBASE_SERVICE_ACCOUNT_JSON — JSON completo (Vercel)
 * 3. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 */
function inicializarFirebaseAdmin(): App {
  if (firebaseApp) return firebaseApp;

  const appExistente = getApps()[0];
  if (appExistente) {
    firebaseApp = appExistente;
    return firebaseApp;
  }

  const credenciales = obtenerCredenciales();

  if (!credenciales) {
    throw new Error(
      "Firebase no configurado. Agrega credenciales en .env.local (ver .env.example) o en Vercel.",
    );
  }

  firebaseApp = initializeApp({
    credential: cert(credenciales),
    storageBucket: FIREBASE_BUCKET,
  });

  return firebaseApp;
}

/** Retorna el bucket de Firebase Storage del portafolio. */
export function getFirebaseBucket() {
  inicializarFirebaseAdmin();
  return getStorage().bucket(FIREBASE_BUCKET);
}

/** Verifica si las credenciales de Firebase estan disponibles. */
export function firebaseEstaConfigurado(): boolean {
  return obtenerCredenciales() !== null;
}

/** Mensaje de ayuda cuando Firebase no esta configurado. */
export function mensajeConfiguracionFirebase(): string {
  return [
    "Firebase Storage no esta configurado en el servidor.",
    "Opcion local (recomendada): descarga el JSON del service account en Firebase Console",
    "y agrega a .env.local: FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json",
    "Opcion Vercel: agrega FIREBASE_SERVICE_ACCOUNT_JSON con el JSON completo en Environment Variables.",
  ].join(" ");
}
