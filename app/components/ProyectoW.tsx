import Image from "next/image";

interface ProyectoWProps {
    titulo: string;
    descripcion: string;
    imagen: string;

}


export default function ProyectoW({ titulo, descripcion, imagen }: ProyectoWProps) {
    return (
        <div className="">
            <h1 className="m-3 font-bold text-2xl">{titulo}</h1>
            <Image
                src={imagen}
                alt="Imagen de Proyecto Web"
                width={300}
                height={200}
                className="m-3 rounded-lg shadow-lg"
            />
            <p className="m-3">{descripcion}</p>

        </div>
    );
}