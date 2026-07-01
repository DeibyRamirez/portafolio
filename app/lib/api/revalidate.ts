import { revalidatePath } from "next/cache";

/**
 * Invalida la cache de la pagina principal tras cambios en proyectos o certificados.
 * La pagina usa force-dynamic, pero esto asegura consistencia en despliegues con cache.
 */
export function revalidarPortafolio() {
  revalidatePath("/");
}
