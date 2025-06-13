import Image from "next/image";

interface ProyectoMProps {
    titulo: string;
    descripcion: string;
    imagen: string;

}


export default function ProyectoM({ titulo, descripcion, imagen }: ProyectoMProps) {
    return (
        <div>
            <Image
                src={imagen}
                alt="Imagen de Proyecto Móvil"
                width={300}
                height={300}
                className="mt-5 ml-2 rounded-lg shadow-lg"
            />
            <br />
            <h1 className="font-bold text-2xl">{titulo}</h1>
            <br />
            <div className="w-80 h-80 rounded-2xl border-2 border-gray-600 bg-gray-700">
                <p className="m-2">{descripcion}</p>
            </div>
            <br />

        </div>
    );
}