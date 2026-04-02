"use client";

import { ArrowRight, Github, Linkedin, Mail, FileText } from "lucide-react";
import Image from "next/image";
import BotonCV from "./BotonCV";
import { useState } from "react";

export const Cv = "cv-deiby.pdf";

export default function Inicio() {

  const [showCV, setShowCV] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="inicio" className="relative min-h-screen px-6 py-20 md:px-8">
      <div className="section-shell mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 rounded-3xl p-8 md:flex-row md:p-12">
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

      <div className="max-w-2xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">Portafolio profesional</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Hola, soy <span className="text-yellow-500">Deiby Ramirez</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
          Ingeniero de Software y Computación
        </h2>
        <p className="text-lg text-gray-600">
          Este repositorio presenta mi trabajo con una estructura clara por lineas tecnicas: desarrollo movil,
          desarrollo web, game dev y un nuevo frente de ciberseguridad para los siguientes proyectos.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <a
            href="#arquitectura"
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 flex items-center gap-2 font-medium shadow-lg hover:shadow-yellow-500/30"
          >
            Ver estructura <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="flex gap-4 pt-6">
          <a href="https://github.com/DeibyRamirez" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-yellow-500">
            <Github className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com/in/deiby-ramirez-67a273255" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-yellow-500">
            <Linkedin className="w-6 h-6" />
          </a>

          <div className="relative flex flex-col items-center">
            {isHovered && (
              <div className="absolute bottom-full mb-2 px-3 py-1 text-xs text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap animate-in fade-in zoom-in duration-200">
                deibyalejandroramirez13@gmail.com
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
              </div>
            )}

            <a
              href="mailto:deibyalejandroramirez13@gmail.com"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-yellow-500"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <button
            onClick={() => setShowCV(true)}
            className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-700 hover:text-yellow-500 flex items-center justify-center"
            title="Ver CV"
          >
            <FileText className="w-6 h-6" />
          </button>
        </div>
      </div>

      {showCV && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl">

            <button
              onClick={() => setShowCV(false)}
              className="absolute -top-10 right-0 text-white hover:text-yellow-500 text-lg flex items-center gap-2"
            >
              Cerrar ✕
            </button>

            <div className="flex-1 overflow-hidden rounded-xl">
              <iframe
                src={Cv}
                className="w-full h-full"
                title="Curriculum Vitae"
              />
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#arquitectura" className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
      </div>
    </section>
  );
}
