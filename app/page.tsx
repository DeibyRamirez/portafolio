import Inicio from "./components/Inicio";
import Arquitectura from "./components/Arquitectura";
import DesarrolloMovil from "./components/DesarrolloMovil";
import DesarrolloWeb from "./components/DesarrolloWeb";
import Logros from "./components/Logros";
import GameDev from "./components/GameDev";
import Ciberseguridad from "./components/Ciberseguridad";

export const dynamic = "force-dynamic";


export default function HomePage() {
  return (
    <>
      <Inicio />
      <Arquitectura />
      <DesarrolloMovil />
      <DesarrolloWeb />
      <GameDev />
      <Ciberseguridad />
      <Logros />
    </>
  );
}
