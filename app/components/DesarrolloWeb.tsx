import Image from "next/image";
import Proyectos from "./Proyectos";
import Herramientas from "./Herramientas";
import { Globe, Cpu, Database, Layout } from "lucide-react";

export default function DesarrolloWeb() {
  return (
    <section id="d_web" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado con animación */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg">Desarrollo Web</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Construyo aplicaciones web modernas, escalables y con excelente rendimiento utilizando las mejores tecnologías.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
          {/* Computadora con proyecto */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-xl group">
              <Image
                src="/pc.png"
                alt="Computadora"
                width={800}
                height={600}
                className="z-0 transform transition-transform duration-500 group-hover:scale-90"
              />
              {/* Pantalla de la computadora con proyecto */}
              <div className="absolute top-[20%] left-[6.5%] w-[87%] h-[47%] bg-white rounded-lg overflow-hidden shadow-2xl">
                <Proyectos
                  titulo="Plataforma E-commerce"
                  descripcion="Sistema completo de comercio electrónico con carrito de compras, pasarela de pagos y panel administrativo."
                  imagen="/Proyectos/fondo_4.jpg"
                  repositorio="https://github.com/tu_usuario/plataforma-ecommerce"
                  tipo="web"
                />
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="w-full lg:w-1/2 space-y-8">
            {/* Herramientas */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <Herramientas
                lenguajes={["JavaScript", "TypeScript", "HTML/CSS", "PHP"]}
                frameworks={["React", "Next.js", "Laravel", "Express"]}
                librerias={["Tailwind CSS", "Redux", "Axios", "JWT","Breeze"]}
                tipo="web"
              />
            </div>

            {/* Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Enfoque en Backend</h3>
                </div>
                <p className="text-gray-600">
                  Me especializo en el desarrollo backend, integrando APIs y lógica de negocio. Para el diseño visual, suelo apoyarme en herramientas de IA para lograr mejores resultados.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Layout className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Diseño Responsivo</h3>
                </div>
                <p className="text-gray-600">
                  Interfaces adaptables a cualquier dispositivo, desde móviles hasta pantallas grandes.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Rendimiento</h3>
                </div>
                <p className="text-gray-600">
                  Optimización de carga, SEO y experiencia de usuario para los mejores resultados.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-100 rounded-full text-yellow-500">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Bases de Datos</h3>
                </div>
                <p className="text-gray-600">
                  Integración con MongoDB, PostgreSQL, Firebase y otros sistemas de almacenamiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}