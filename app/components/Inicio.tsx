import { ArrowRight, Github, Linkedin, Mail, } from "lucide-react";
import Image from "next/image";

export default function Inicio() {
  return (
    <section id="inicio" className="min-h-screen py-20 px-6 flex flex-col md:flex-row items-center justify-center gap-12 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Imagen de perfil con animación */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 group">
        <div className="absolute inset-0 rounded-full bg-yellow-500 blur-md opacity-30 group-hover:opacity-50 transition-all duration-500"></div>
        <Image
          src="/yo_fondo.jpeg"
          alt="Foto de Perfil"
          width={320}
          height={320}
          className="relative z-10 rounded-full border-4 border-white shadow-2xl object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>

      {/* Contenido principal */}
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Hola, soy <span className="text-yellow-500">Deiby Ramirez</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
          Ingeniero de Software y Computación
        </h2>
        <p className="text-lg text-gray-600">
          Especializado en desarrollo de aplicaciones móviles y web con tecnologías modernas. 
          Apasionado por crear soluciones innovadoras que generen impacto.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 pt-4">
          <a 
            href="#d_movil" 
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-yellow-500/30"
          >
            Ver proyectos <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Redes sociales */}
        <div className="flex gap-4 pt-6">
          <a href="https://github.com/DeibyRamirez" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-yellow-500">
            <Github className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/deiby-ramirez-67a273255" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-yellow-500">
            <Linkedin className="w-6 h-6" />
          </a>
          <a href="mailto:deibyalejandroramirez13@gmail.com" className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-yellow-500">
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Efecto decorativo */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#d_movil" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}