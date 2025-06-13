import Image from "next/image"
import Proyectos from "./Proyectos";
import Herramientas from "./Herramientas";


export default function DesarrolloMovil() {
    return (
        <section id="d_movil" className="w-full h-200 flex">
            <div className="m-4 w-1/3 md:h-192 flex justify-center items-center p-4 relative">
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
                    <div className="w-85 h-182 bg-white flex items-start justify-start p-2 rounded-s-4xl rounded-r-4xl shadow-lg">
                        {/* Aquí va tu contenido */}
                        <Proyectos
                            titulo="Proyecto Móvil"
                            descripcion="Descripción del proyecto móvil"
                            imagen="/Proyectos/fondo_4.jpg"
                            tipo="movil"
                        />
                    </div>
                </div>
            </div>

            <div className="w-7xl h-200 flex flex-col">
                <div className=" m-4 flex-10 text-2x1  ">
                    <h1 className="ml-5 mt-8 text-3xl font-extrabold flex justify-start items-center ">DESARROLLO MOVIL</h1>
                </div>
                <div className="m-4 shadow-lg shadow-black rounded-4xl flex-40 flex flex-col items-start justify-start text-left p-6 relative overflow-hidden">
                    <Image
                        src="/fondo_3.jpg"
                        alt="Fondo 3"
                        width={600}
                        height={400}
                        className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className=" m-6 relative z-10 w-full">
                       
                        <Herramientas
                            lenguajes={["Dart"]}
                            frameworks={["Flutter"]}
                            librerias={["Provider", "Riverpod"]}
                            tipo="movil"
                        />

                    </div>
                </div>
                {/* Lenguajes y frameworks Movil */}
                <div className="flex gap-4 m-4 w-6xl h-20 rounded-2xl bg-black shadow-md shadow-black border justify-start items-center">
                    <h1 className="ml-4 text-2xl font-bold text-white">Lenguajes :</h1>
                    <Image
                        src="/iconos/dart.png"
                        alt="Dart"
                        width={70}
                        height={70}
                        className="rounded-2xl"
                    />
                    <h1 className="text-2xl font-bold text-white">Frameworks :</h1>

                    <Image
                        src="/iconos/flutter.png"
                        alt="Flutter"
                        width={70}
                        height={70}
                        className="rounded-2xl"
                    />
                </div>

            </div>
        </section>

    );
}