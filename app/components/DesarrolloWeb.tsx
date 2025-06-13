import Image from "next/image";
import ProyectoW from "./ProyectoW";

export default function DesarrolloWeb() {
    return (
        <section id="d_web" className="w-full h-200 bg-gray-700 flex">
            <div className=" flex-1/2">
                <div className="m-4 w-200 h-20 ">
                    <h1 className="ml-5  text-3xl font-extrabold flex justify-start items-center">DESARROLLO WEB</h1>
                </div>
                <div className="m-4 p-40 rounded-4xl w-435 flex h-140 items-center bg-yellow-400">
                    <Image
                        src="/pc.png"
                        alt="Monitor"
                        width={700}
                        height={500}

                    />
                    {/* Proyectos */}
                    <div className="absolute top-441 left-23 w-1/2 h-1/2 flex items-center justify-center z-10">
                        <div className="w-155 h-85 bg-red-600 opacity-80 flex items-start justify-start p-4 rounded-lg shadow-lg">
                        <ProyectoW
                            titulo="Proyecto Web"
                            descripcion="Descripción del proyecto web"
                            imagen="/Proyectos/fondo_4.jpg"
                        />
                        </div>
                    </div>
                    <Image
                        src="/pc.png"
                        alt="Monitor"
                        width={700}
                        height={500}

                    />
                    {/* Herramientas */}
                    <div className="absolute top-441 left-198 w-1/2 h-1/2 flex items-center justify-center z-10">
                        <div className="w-155 h-85 bg-red-600 opacity-80 flex items-start justify-start p-4 rounded-lg shadow-lg">

                        </div>
                    </div>
                    

                </div>
                {/* Lenguajes y frameworks Web */}
                <div className=" m-4 w-435 h-20 bg-red-500">

                </div>
            </div>

        </section>

    );
}