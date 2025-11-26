import Image from "next/image";
import Certificado from "./Certificado";
import { Award, BookOpen, GraduationCap } from "lucide-react";
import { convertirGSUrl } from "./Conversion";

export default async function Logros() {

  const API = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API}/certificados`, { cache: 'no-store' });
  const certificados = await response.json();
  
  return (
    <section id="logros" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg">
              Logros y Certificaciones
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Certificaciones y reconocimientos que avalan mis conocimientos y experiencia.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full text-yellow-500">
                <Award className="w-8 h-8" />
              </div>
            </div>
            {/* Aquí mostramos la cantidad */}
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {certificados.length}
            </h3>
            <p className="text-gray-600">Certificaciones obtenidas</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full text-yellow-500">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">1</h3>
            <p className="text-gray-600">Años de experiencia</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full text-yellow-500">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">1</h3>
            <p className="text-gray-600">Títulos profesionales</p>
          </div>
        </div>

        {/* Certificados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(certificados) && certificados.length > 0 ? (
            certificados.map((cert) => (
              <Certificado
                key={cert.id ?? cert.titulo}
                titulo={cert.titulo}
                imagen={convertirGSUrl(cert.imagen)}
                institucion={cert.institucion}
                fecha={cert.fecha}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No hay certificaciones disponibles.
            </div>
          )}

          <div className="bg-gray-50 rounded-xl shadow-md p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-yellow-500 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">¿Quieres ver más?</h3>
            <p className="text-gray-500 mb-4 text-center">Tengo más certificaciones en mi perfil de LinkedIn</p>
            <a 
              href="https://www.linkedin.com/in/deiby-ramirez-67a273255/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 flex items-center gap-2"
            >
              Ver LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
