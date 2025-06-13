import Image from "next/image";

interface ProyectosProps {
    titulo: string;
    descripcion: string;
    imagen: string;
    tipo: "movil" | "web";

}


export default function Proyectos({ titulo, descripcion, imagen, tipo }: ProyectosProps) {
    if (tipo === "movil") {
        return (
            <div>
                <Image
                    src={imagen}
                    alt="Imagen de Proyecto Móvil"
                    width={300}
                    height={300}
                    className="mt-5 ml-2 rounded-lg shadow-lg bg-amber-950 border border-black"
                />
                <br />
                <h1 className="ml-2 font-bold text-2xl text-black">{titulo}</h1>
                <br />
                <div className="w-80 h-80 rounded-2xl border border-black bg-white shadow-yellow-500 shadow-lg">
                    <p className="m-4 text-black">{descripcion}</p>
                </div>
                <br />

            </div>
        );
    }

    return (
        <div className="flex items-start">
            <div className="flex flex-col">
            <h1 className="m-3 font-bold text-black text-2xl">{titulo}</h1>
            <Image
                src={imagen}
                alt="Imagen de Proyecto Web"
                width={250}
                height={150}
                className="m-3 rounded-lg shadow-lg"
            />
            </div>
            <p className="ml-7 p-2 w-80 h-52 text-black border border-black rounded-2xl shadow shadow-yellow-400">
            {descripcion}
            </p>
        </div>
    );
}