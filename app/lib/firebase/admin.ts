import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import { FIREBASE_BUCKET } from "@/app/lib/firebase/storage-paths";

let firebaseApp: App | undefined;

/**
 * Inicializa Firebase Admin con credenciales de service account.
 * Soporta FIREBASE_SERVICE_ACCOUNT_JSON (JSON completo) o variables separadas.
 */
function inicializarFirebaseAdmin(): App {
  if (firebaseApp) return firebaseApp;

  const appExistente = getApps()[0];
  if (appExistente) {
    firebaseApp = appExistente;
    return firebaseApp;
  }

  const jsonCredenciales = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (jsonCredenciales) {
    firebaseApp = initializeApp({
      credential: cert(JSON.parse(jsonCredenciales) as Parameters<typeof cert>[0]),
      storageBucket: FIREBASE_BUCKET,
    });
    return firebaseApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    firebaseApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      storageBucket: FIREBASE_BUCKET,
    });
    return firebaseApp;
  }

  throw new Error(
    "Firebase no configurado. Define FIREBASE_SERVICE_ACCOUNT_JSON o FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY",
  );
}

/** Retorna el bucket de Firebase Storage del portafolio. */
export function getFirebaseBucket() {
  inicializarFirebaseAdmin();
  return getStorage().bucket(FIREBASE_BUCKET);
}

/** Verifica si las credenciales de Firebase estan disponibles. */
export function firebaseEstaConfigurado(): boolean {
  return !!(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    (process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY)
  );
}
