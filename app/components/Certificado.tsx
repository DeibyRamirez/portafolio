import Image from "next/image";

interface CertificadoProps {
    titulo: string;
    imagen: string;
}

export default function Certificado({ titulo, imagen }: CertificadoProps) {
    return (
        <div className="rounded-lg shadow-lg p-4 bg-gray-800 text-white">
            <Image
                src={imagen}
                alt="Imagen de Certificado"
                width={300}
                height={200}
                className="m-3 rounded-lg shadow-lg"
            />
            <h1 className="m-3 font-bold text-2xl">{titulo}</h1>
        </div>
    );
}