import Image from "next/image";
import Proyectos from "./Proyectos";
import Herramientas from "./Herramientas";

export default function DesarrolloWeb() {
    return (
        <section id="d_web" className="w-full h-200  flex">
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
                        <div className="w-152 h-82 bg-white  flex items-start justify-start p-4 rounded-lg shadow-lg">
                            <Proyectos
                                titulo="Proyecto Web"
                                descripcion="Descripción del proyecto web"
                                imagen="/Proyectos/fondo_4.jpg"
                                tipo="web"
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
                        <div className="w-160 h-90 flex items-start justify-start p-4 rounded-lg shadow-lg">
                       
                            <Herramientas
                                lenguajes={["HTML", "CSS", "JavaScript"]}
                                frameworks={["React", "Next.js"]}
                                librerias={["Tailwind CSS", "Chakra UI"]}
                                tipo="web"
                            />
                        </div>
                    </div>


                </div>
                {/* Lenguajes y frameworks Web */}
                <div className="flex gap-4 m-4 w-435 h-20 rounded-2xl border bg-black shadow-md shadow-black justify-start items-center">
                    <h1 className="ml-4 text-2xl font-bold text-white">Lenguajes :</h1>
                    <Image
                        src="/iconos/html.png"
                        alt="HTML"
                        width={70}
                        height={70}
                        className="rounded-2xl"
                    />
                    <h1 className="text-2xl font-bold text-white">Frameworks :</h1>

                    <Image
                        src="/iconos/laravel.png"
                        alt="Laravel"
                        width={70}
                        height={70}
                        className="rounded-2xl"
                    />
                    <Image
                        src="/iconos/react.png"
                        alt="React"
                        width={70}
                        height={70}
                        className="rounded-2xl"
                    />
                    <Image
                        src="/iconos/tailwind.png"
                        alt="Tailwind CSS"
                        width={70}
                        height={70}
                        className="rounded-2xl"
                    />
                </div>
            </div>

        </section>

    );
}