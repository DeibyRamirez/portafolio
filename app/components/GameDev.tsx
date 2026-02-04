import Image from "next/image";
import Proyectos from "./Proyectos";
import Herramientas from "./Herramientas";
import { Cpu, Gamepad2, Ghost, Timer, Users } from "lucide-react";
import { convertirGSUrl } from "./Conversion";

export default async function GameDev() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API}/proyectos`, { cache: 'no-store' });
  const proyectos = await response.json();

  const proyectosGame = proyectos.filter((proyecto: any) => proyecto.tipo === "game_dev");
  const proyectoPrincipal = proyectosGame[0];

  return (
    <section id="d_game_dev" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg">Game Dev</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Exploro la intersección entre el arte y la ingeniería, creando experiencias interactivas y mecánicas complejas.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* MOCKUP DE DISPOSITIVO (Smartphone/Handheld) */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            {/* Carcasa del dispositivo */}
            <div className="relative w-[500px] h-[600px] bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-[8px] border-gray-800">

              {/* Pantalla interna */}
              <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative border border-gray-700">
                {proyectoPrincipal ? (
                  <Proyectos
                    titulo={proyectoPrincipal.titulo}
                    descripcion={proyectoPrincipal.descripcion}
                    imagenes={proyectoPrincipal.imagenes.map((img: string) => convertirGSUrl(img))}
                    repositorio={proyectoPrincipal.repositorio}
                    tipo="game_dev"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    Cargando proyecto...
                  </div>
                )}
              </div>
            </div>
            {/* Brillo decorativo detrás del dispositivo */}
            <div className="absolute -z-10 w-64 h-64 bg-yellow-200 blur-[100px] opacity-50"></div>
          </div>

          {/* Contenido Técnico */}
          <div className="w-full lg:w-1/2 space-y-5">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gamepad2 className="text-yellow-500" /> Competencias Técnicas
              </h3>
              {proyectoPrincipal && (
                <Herramientas
                  lenguajes={proyectoPrincipal.lenguajes}
                  frameworks={proyectoPrincipal.frameworks}
                  librerias={proyectoPrincipal.librerias}
                  tipo="game_dev"
                />
              )}
            </div>

            {/* Grid de Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureItem
                icon={<Timer className="w-5 h-5" />}
                title="Rapid Prototyping"
                desc="Capacidad de entregar productos funcionales en retos de 48 horas."
              />
              <FeatureItem
                icon={<Cpu className="w-5 h-5" />}
                title="Lógica de Juego"
                desc="Programación de sistemas de IA, físicas y gestión de estados."
              />
              <FeatureItem
                icon={<Users className="w-5 h-5" />}
                title="Colaboración"
                desc="Trabajo coordinado con artistas y diseñadores de sonido."
              />
              <FeatureItem
                icon={<Ghost className="w-5 h-5" />}
                title="Inmersión"
                desc="Enfoque en UX y atmósfera, especialmente en Survival Horror."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Componente pequeño para las cards de características
export function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2 text-yellow-600">
        {icon}
        <span className="font-bold uppercase text-xs tracking-wider">{title}</span>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}