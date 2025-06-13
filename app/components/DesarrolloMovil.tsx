import Image from "next/image"
import ProyectoM from "./ProyectoM";


export default function DesarrolloMovil() {
    return (
        <section id="d_movil" className="w-full h-200 bg-gray-700 flex">
            <div className="m-4 w-1/3 md:h-192 flex justify-center items-center p-4 bg-amber-100 relative">
                {/* Imagen del Telefono */}
                <Image
                    src="/celular.png"
                    alt="Telefono"
                    width={400}
                    height={500}
                    className="z-0"
                />
                {/* Contenido dentro de la pantalla del teléfono */}
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center z-10">
                    <div className="w-88 h-182 bg-red-600 opacity-80 flex items-start justify-start p-4 rounded-lg shadow-lg">
                        {/* Aquí va tu contenido */}
                        <ProyectoM
                            titulo="Proyecto Móvil"
                            descripcion="Descripción del proyecto móvil"
                            imagen="/Proyectos/fondo_4.jpg"
                        />
                    </div>
                </div>
            </div>
            
            <div className="w-7xl h-200 flex flex-col">
                <div className=" m-4 flex-10 text-2x1  ">
                    <h1 className="ml-5 mt-8 text-3xl font-extrabold flex justify-start items-center ">DESARROLLO MOVIL</h1>
                </div>
                <div className="m-4 shadow-lg shadow-black border rounded-4xl flex-40 flex flex-col items-start justify-start text-left p-6 relative overflow-hidden">
                    <Image
                        src="/fondo_3.jpg"
                        alt="Fondo 3"
                        width={600}
                        height={400}
                        className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className=" m-6 relative z-10 w-full">
                        <h1 className="text-lg font-bold">Conocimientos :</h1>
                        <div>Componente para los conocimientos..</div>


                    </div>
                </div>
                {/* Lenguajes y frameworks Movil */}
                <div className=" m-4 w-6xl h-20 bg-red-500">

                </div>

            </div>
        </section>

    );
}