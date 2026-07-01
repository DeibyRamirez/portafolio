export interface DesarrolloInterface {
    id?: string;
    tipo?: "movil" | "web" | "game_dev" | "ciberseguridad" | "automatizacion";
    titulo: string;
    descripcion: string;
    imagenes: string[];
    repositorio?: string;
    lenguajes: string[];
    frameworks: string[];
    librerias: string[];
  };
