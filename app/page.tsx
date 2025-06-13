import Inicio from "./components/Inicio";
import DesarrolloMovil from "./components/DesarrolloMovil";
import DesarrolloWeb from "./components/DesarrolloWeb";
import Logros from "./components/Logros";


export default function HomePage() {
  return (
    <>
    {/* Llamo a los contennidos de las difenretes secciones a la principal */}
      <Inicio />
      <DesarrolloMovil />
      <DesarrolloWeb />
      <Logros />
    </>
  );
}