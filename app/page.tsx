import Inicio from "./components/Inicio";
import DesarrolloMovil from "./components/DesarrolloMovil";
import DesarrolloWeb from "./components/DesarrolloWeb";
import Logros from "./components/Logros";


export default function HomePage() {
  return (
    <>
      <Inicio />
      <DesarrolloMovil />
      <DesarrolloWeb />
      <Logros />
    </>
  );
}