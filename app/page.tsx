import Inicio from "./pages/Inicio";
import Arquitectura from "./pages/Arquitectura";
import DesarrolloMovil from "./pages/DesarrolloMovil";
import DesarrolloWeb from "./pages/DesarrolloWeb";
import Logros from "./pages/Logros";
import GameDev from "./pages/GameDev";
import Ciberseguridad from "./pages/Ciberseguridad";
import Automatizaciones from "./pages/Automatizaciones";
import { getCertificados } from "@/app/lib/data/certificados";
import { filtrarProyectosPorTipo, getProyectos } from "@/app/lib/data/proyectos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [proyectos, certificados] = await Promise.all([getProyectos(), getCertificados()]);

  return (
    <>
      <Inicio />
      <Arquitectura />
      <DesarrolloMovil proyectos={filtrarProyectosPorTipo(proyectos, "movil")} />
      <DesarrolloWeb proyectos={filtrarProyectosPorTipo(proyectos, "web")} />
      <Automatizaciones proyectos={filtrarProyectosPorTipo(proyectos, "automatizacion")} />
      <GameDev proyectos={filtrarProyectosPorTipo(proyectos, "game_dev")} />
      <Ciberseguridad proyectos={filtrarProyectosPorTipo(proyectos, "ciberseguridad")} />
      <Logros certificados={certificados} />
    </>
  );
}
