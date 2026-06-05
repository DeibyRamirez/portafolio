import { CertificadoInterface } from "../models/Certificados";

export default function Certificado({ titulo, imagen, institucion = "Institución", fecha = "Fecha" }: CertificadoInterface) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagen}
          alt={`Certificado ${titulo}`}
          className="block w-full h-auto object-contain"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h3>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{institucion}</span>
          <span>{fecha}</span>
        </div>
      </div>
    </div>
  );
}
