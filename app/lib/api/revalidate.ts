import { revalidatePath } from "next/cache";

/**
 * Invalida la cache de la pagina principal tras cambios en proyectos o certificados.
 */
export function revalidarPortafolio() {
  revalidatePath("/");
}
