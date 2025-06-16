import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface CertificadoProps {
  titulo: string;
  imagen: string;
  institucion?: string;
  fecha?: string;
}

export default function Certificado({ titulo, imagen, institucion = "Institución", fecha = "Fecha" }: CertificadoProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imagen}
          alt="Imagen de Certificado"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
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