import Image from "next/image";
import Certificado from "./Certificado";
import { Award, BookOpen, GraduationCap } from "lucide-react";

export default function Logros() {
  return (
    <section id="logros" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg">Logros y Certificaciones</span>
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
            <h3 className="text-3xl font-bold text-gray-900 mb-2">15+</h3>
            <p className="text-gray-600">Certificaciones obtenidas</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full text-yellow-500">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">5+</h3>
            <p className="text-gray-600">Años de experiencia</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 rounded-full text-yellow-500">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">2</h3>
            <p className="text-gray-600">Títulos profesionales</p>
          </div>
        </div>

        {/* Certificados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Certificado 
            titulo="Flutter Avanzado" 
            imagen="/proyectos/fondo_4.jpg" 
            institucion="Google Developers" 
            fecha="2023"
          />
          <Certificado 
            titulo="React Profesional" 
            imagen="/proyectos/fondo_4.jpg" 
            institucion="Meta" 
            fecha="2022"
          />
          <Certificado 
            titulo="Node.js Backend" 
            imagen="/proyectos/fondo_4.jpg" 
            institucion="Udemy" 
            fecha="2021"
          />
          <Certificado 
            titulo="Diseño UI/UX" 
            imagen="/proyectos/fondo_4.jpg" 
            institucion="Coursera" 
            fecha="2020"
          />
          <Certificado 
            titulo="JavaScript Moderno" 
            imagen="/proyectos/fondo_4.jpg" 
            institucion="Platzi" 
            fecha="2019"
          />
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