import Image from "next/image";
import Proyectos from "./Proyectos";
import Herramientas from "./Herramientas";
import { Globe, Cpu, Database, Layout } from "lucide-react";
import { convertirGSUrl } from "./Conversion";
import { FeatureItem } from "./GameDev";

export default async function DesarrolloWeb() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API}/proyectos`, { cache: "no-store" });
  const proyectos = await response.json();

  const proyectosWeb = proyectos.filter((proyecto: any) => proyecto.tipo === "web");
  const proyectoPrincipal = proyectosWeb[0];

  return (
    <section id="d_web" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-yellow-500 text-white px-5 py-3 rounded-xl">
              Desarrollo Web
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Construyo aplicaciones web modernas, escalables y con excelente rendimiento utilizando
            tecnologías de alto nivel.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
          {/* Mockup Computadora */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-2xl group">
              <Image src="/pc.png" alt="Computadora" width={900} height={700} className="z-0" />

              {/* Pantalla del PC */}
              <div className="absolute top-[19%] left-[6.5%] w-[87%] h-[48%] bg-white rounded-xl overflow-hidden shadow-2xl">
                <Proyectos
                  titulo={proyectoPrincipal.titulo}
                  descripcion={proyectoPrincipal.descripcion}
                  imagenes={proyectoPrincipal.imagenes.map((img: string) => convertirGSUrl(img))}
                  repositorio={proyectoPrincipal.repositorio}
                  tipo="web"
                />
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-full lg:w-1/2 space-y-10">
            {/* Herramientas */}
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
              <Herramientas
                lenguajes={proyectoPrincipal.lenguajes}
                frameworks={proyectoPrincipal.frameworks}
                librerias={proyectoPrincipal.librerias}
                tipo="web"
              />
            </div>

            {/* Grid de Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureItem
                icon={<Globe className="w-5 h-5" />}
                title="Enfoque en Backend"
                desc="Especializado en APIs y lógica de negocio. El diseño visual lo perfecciono con apoyo de herramientas de IA."
              />
              <FeatureItem
                icon={<Layout className="w-5 h-5" />}
                title="Diseño Responsivo"
                desc="Interfaces adaptables a cualquier dispositivo, desde móviles hasta pantallas XL."
              />
              <FeatureItem
                icon={<Cpu className="w-5 h-5" />}
                title="Rendimiento"
                desc="Optimización SEO, carga rápida y experiencia de usuario fluida."
              />
              <FeatureItem
                icon={<Database className="w-5 h-5" />}
                title="Bases de Datos"
                desc="Integración con MongoDB, PostgreSQL, Firebase y otras tecnologías."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
