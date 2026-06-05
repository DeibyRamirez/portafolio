import { Bot, Database, Clock, Shield, Workflow } from "lucide-react";
import Proyectos from "./Proyectos";
import { safeFetchJson } from "../lib/api";
import { DesarrolloInterface } from "../models/Desarrollos";
// import { convertirGSUrl } from "../components/Conversion";
import Herramientas from "./Herramientas";
import { convertirGSUrl } from "../components/Conversion";


export default async function Automatizaciones() {

  const proyectosData = await safeFetchJson<DesarrolloInterface[]>("/proyectos");
  const proyectos = Array.isArray(proyectosData) ? proyectosData : [];

  const proyectosAutomatizacion = proyectos.filter((proyecto) => proyecto.tipo === "automatizacion");
  const proyectoPrincipal = proyectosAutomatizacion.length > 0 ? proyectosAutomatizacion[0] : null;

  // Nueva estructura de datos agrupada por categorías
  const automatizacionesData = {
    orquestacion: {
      titulo: "Orquestación con n8n",
      items: [
        "Webhooks y triggers en tiempo real",
        "Schedulers para tareas programadas",
        "Condicionales y loops complejos",
        "Ejecución paralela de workflows"
      ]
    },
    iaLocal: {
      titulo: "Modelos de IA Locales",
      items: [
        "Ollama con Llama3, Mistral, Phi",
        "Embeddings para búsqueda semántica",
        "RAG con documentos internos",
        "Procesamiento sin conexión a internet"
      ]
    },
    casosUso: {
      titulo: "Casos de Uso Empresarial",
      items: [
        "Automatización de facturación y contabilidad",
        "Clasificación automática de tickets soporte",
        "Generación de informes ejecutivos",
        "Monitoreo y alertas inteligentes"
      ]
    },
    integraciones: {
      titulo: "Integraciones Clave",
      items: [
        "Google Workspace (Docs, Sheets, Gmail)",
        "Bases de datos (PostgreSQL, MySQL)",
        "APIs REST y GraphQL internas",
        "Slack, Discord, Telegram bots"
      ]
    }
  };

  return (
    <section id="d_automatizaciones" className="px-6 py-20 md:px-8">
      <div className="section-shell mx-auto max-w-6xl rounded-3xl p-8 md:p-10">

        {/* Encabezado Principal */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg">
              Automatizaciones con IA Local
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Integro n8n con modelos de IA locales para eliminar tareas repetitivas, optimizar flujos de trabajo y reducir costos operativos.
          </p>
        </div>

        {/* Contenedor en una sola columna con espaciado vertical entre filas */}
        <div className="flex flex-col gap-12 w-full">

          {/* ================= FILA 1: EL PROYECTO ================= */}
          <div className="relative w-full flex justify-center">
            {/* Se cambió max-w-4xl para que no se desparrame en pantallas gigantes, pero se vea imponente */}
            <div className="relative w-full max-w-4xl h-[690px] bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-[8px] border-gray-800">
              <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative border border-gray-700">
                {proyectoPrincipal ? (
                  <Proyectos
                    titulo={proyectoPrincipal.titulo}
                    descripcion={proyectoPrincipal.descripcion}
                    imagenes={proyectoPrincipal.imagenes ? proyectoPrincipal.imagenes.map((img: string) => convertirGSUrl(img)) : null}
                    repositorio={proyectoPrincipal.repositorio ?? ""}
                    tipo="automatizacion"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    Cargando automatización...
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -z-10 w-72 h-72 bg-blue-200 blur-[120px] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* ================= FILA 2: STACK DE AUTOMATIZACIÓN ================= */}
          <div className="w-full max-w-4xl mx-auto bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bot className="text-yellow-500" /> Stack de Automatización
            </h3>
            {proyectoPrincipal && (
              <Herramientas
                lenguajes={proyectoPrincipal.lenguajes}
                frameworks={proyectoPrincipal.frameworks}
                librerias={proyectoPrincipal.librerias}
                tipo="automatizacion"
              />
            )}
          </div>

          {/* ================= FILA 3: AGRUPACIÓN DE CATEGORÍAS (GRID) ================= */}
          {/* grid-cols-1 en móvil, md:grid-cols-2 en tablets, lg:grid-cols-4 en desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

            {/* Categoría 1 */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Workflow className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-800">{automatizacionesData.orquestacion.titulo}</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {automatizacionesData.orquestacion.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Categoría 2 */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-800">{automatizacionesData.iaLocal.titulo}</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {automatizacionesData.iaLocal.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Categoría 3 */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-800">{automatizacionesData.casosUso.titulo}</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {automatizacionesData.casosUso.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Categoría 4 */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <h4 className="font-semibold text-gray-800">{automatizacionesData.integraciones.titulo}</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {automatizacionesData.integraciones.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}