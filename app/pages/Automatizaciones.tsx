"use client";

import { Bot } from "lucide-react";
import Proyectos from "./Proyectos";
import { DesarrolloInterface } from "../models/Desarrollos";
import Herramientas from "./Herramientas";
import ContenedorProyectoCategoria, { useProyectoCategoria } from "../components/ContenedorProyectoCategoria";

interface AutomatizacionesProps {
  proyectos: DesarrolloInterface[];
}

const automatizacionesData = {
  orquestacion: {
    titulo: "Orquestación con n8n",
    items: [
      "Webhooks y triggers en tiempo real",
      "Schedulers para tareas programadas",
      "Condicionales y loops complejos",
      "Ejecución paralela de workflows",
    ],
  },
  iaLocal: {
    titulo: "Modelos de IA Locales",
    items: [
      "Ollama con Llama3, Mistral, Phi",
      "Embeddings para búsqueda semántica",
      "RAG con documentos internos",
      "Procesamiento sin conexión a internet",
    ],
  },
  casosUso: {
    titulo: "Casos de Uso Empresarial",
    items: [
      "Automatización de facturación y contabilidad",
      "Clasificación automática de tickets soporte",
      "Generación de informes ejecutivos",
      "Monitoreo y alertas inteligentes",
    ],
  },
  integraciones: {
    titulo: "Integraciones Clave",
    items: [
      "Google Workspace (Docs, Sheets, Gmail)",
      "Bases de datos (PostgreSQL, MySQL)",
      "APIs REST y GraphQL internas",
      "Slack, Discord, Telegram bots",
    ],
  },
};

function AutomatizacionesContenido() {
  const { proyecto, imagenes } = useProyectoCategoria();

  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="relative w-full flex justify-center">
        <div className="relative w-full max-w-4xl h-[690px] bg-gray-900 rounded-[3rem] p-4 shadow-2xl border-[8px] border-gray-800">
          <div className="w-full h-full bg-black rounded-[2rem] overflow-hidden relative border border-gray-700">
            {proyecto ? (
              <Proyectos
                titulo={proyecto.titulo}
                descripcion={proyecto.descripcion}
                imagenes={imagenes}
                repositorio={proyecto.repositorio ?? ""}
                tipo="automatizacion"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm px-4 text-center">
                No hay automatizaciones disponibles.
              </div>
            )}
          </div>
        </div>
        <div className="absolute -z-10 w-72 h-72 bg-blue-200 blur-[120px] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Bot className="text-yellow-500" /> Stack de Automatización
        </h3>
        {proyecto ? (
          <Herramientas
            lenguajes={proyecto.lenguajes}
            frameworks={proyecto.frameworks}
            librerias={proyecto.librerias}
            tipo="automatizacion"
          />
        ) : (
          <p className="text-gray-500 text-sm">Sin tecnologías disponibles por el momento.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {Object.values(automatizacionesData).map((categoria) => (
          <div
            key={categoria.titulo}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">{categoria.titulo}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {categoria.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">▹</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Automatizaciones({ proyectos }: AutomatizacionesProps) {
  return (
    <section id="d_automatizaciones" className="px-6 py-20 md:px-8">
      <div className="section-shell mx-auto max-w-6xl rounded-3xl p-8 md:p-10">
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

        <ContenedorProyectoCategoria proyectos={proyectos} tipo="automatizacion">
          <AutomatizacionesContenido />
        </ContenedorProyectoCategoria>
      </div>
    </section>
  );
}
