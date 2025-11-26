import Image from "next/image";
import Proyectos from "./Proyectos";
import Herramientas from "./Herramientas";
import { Smartphone, Code, Cpu, Zap } from "lucide-react";
import { convertirGSUrl } from "./Conversion";

export default async function DesarrolloMovil() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API}/proyectos`, { cache: 'no-store' });
  const proyectos = await response.json();

  // Filtrar proyectos móviles
  const proyectosMovil = proyectos.filter((proyecto: any) => proyecto.tipo === "movil");
  const proyectoPrincipal = proyectosMovil[0]; // el que mostramos en el celular

  return (
    <section id="d_movil" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado con animación */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg">Desarrollo Móvil</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creo aplicaciones móviles nativas y multiplataforma con excelente rendimiento y experiencia de usuario.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Teléfono con proyecto */}
          <div className="relative w-full lg:w-1/3 flex justify-center">
            <div className="relative w-70 h-auto group">
              <Image
                src="/celular.png"
                alt="Telefono"
                width={300}
                height={600}
                className="z-0"
              />
              {/* Pantalla del teléfono con proyecto */}
              <div className="absolute top-[3.5%] left-[8%] w-[84%] h-[92.5%] bg-white rounded-2xl overflow-hidden shadow-xl">
                {proyectoPrincipal && (
                  <Proyectos
                    titulo={proyectoPrincipal.titulo}
                    descripcion={proyectoPrincipal.descripcion}
                    imagenes={proyectoPrincipal.imagenes.map((img: string) => convertirGSUrl(img))}
                    repositorio={proyectoPrincipal.repositorio}
                    tipo="movil"
                  />

                )}

              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Herramientas */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              {/* Lenguajes de programacion / framworks / librerias que he utilizado en mis proyectos */}
              {proyectoPrincipal && (
                <Herramientas
                  lenguajes={proyectoPrincipal.lenguajes}
                  frameworks={proyectoPrincipal.frameworks}
                  librerias={proyectoPrincipal.librerias}
                  tipo="movil"
                />

              )}

            </div>

            {/* Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Multiplataforma</h3>
                </div>
                <p className="text-gray-600">
                  Desarrollo apps que funcionan en iOS y Android con un solo código base, reduciendo costos y tiempo.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Alto Rendimiento</h3>
                </div>
                <p className="text-gray-600">
                  Aplicaciones optimizadas para un rendimiento nativo, con animaciones fluidas y tiempos de carga mínimos.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Código Limpio</h3>
                </div>
                <p className="text-gray-600">
                  Arquitectura sólida siguiendo principios SOLID y patrones de diseño para un mantenimiento sencillo.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Integraciones</h3>
                </div>
                <p className="text-gray-600">
                  Conexión con APIs, Firebase, bases de datos locales y servicios de terceros para funcionalidades avanzadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}