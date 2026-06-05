export interface ProyectosInterface {
  titulo: string;
  descripcion: string;
  imagenes: string[] | null;
  repositorio: string;
  tipo: "movil" | "web" | "game_dev" | "ciberseguridad" | "automatizacion";
}