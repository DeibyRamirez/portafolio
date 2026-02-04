"use client";
import { useState } from "react";
import { Cv } from "./Inicio";


export default function BotonCV() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* El Botón */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Ver Mi CV
      </button>

      {/* El Modal (Fondo oscuro) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
            
            {/* Cabecera del Modal */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Hoja de Vida</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Contenedor del PDF con Scroll */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src= {Cv}
                className="w-full h-full"
                title="CV de Deiby"
              />
            </div>

            {/* Pie para cerrar o descargar */}
            <div className="p-4 border-t flex justify-end gap-2">
              <a 
                href= {Cv} 
                download 
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Descargar PDF
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}