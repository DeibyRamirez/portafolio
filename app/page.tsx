import Inicio from "./pages/Inicio";
import Arquitectura from "./pages/Arquitectura";
import DesarrolloMovil from "./pages/DesarrolloMovil";
import DesarrolloWeb from "./pages/DesarrolloWeb";
import Logros from "./pages/Logros";
import GameDev from "./pages/GameDev";
import Ciberseguridad from "./pages/Ciberseguridad";
import Automatizaciones from "./pages/Automatizaciones";


export const dynamic = "force-dynamic";


export default function HomePage() {
  return (
    <>
      <Inicio />
      <Arquitectura />
      <DesarrolloMovil />
      <DesarrolloWeb />
      <Automatizaciones/> 
      <GameDev />
      <Ciberseguridad />
      <Logros />
    </>
  );
}
