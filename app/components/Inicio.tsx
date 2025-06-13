import { Search } from "lucide-react";
import Image from "next/image"
export default function Inicio() {
    return (
        <section id="inicio" className="w-full h-200 flex">
            <div className=" < m-8 w-1/3 h-192 ">

                {/* Imagen de Perfil */}
                <div className="w-full h-full flex justify-center items-center p-4">
                    <div className="relative w-48 h-48 md:w-90 md:h-90">
                        <Image
                            src="/yo_fondo.jpeg"
                            alt="Foto de Perfil"
                            fill
                            className="rounded-full border-4 border-white shadow-lg object-cover"
                            priority
                        />
                        {/* <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/70 to-transparent rounded-b-full pointer-events-none" /> */}
                    </div>
                </div>

            </div>
            <div className="w-7xl h-200 flex flex-col">
                <div className=" m-4 flex-10"></div>
                <div className="m-4 shadow-lg shadow-black rounded-4xl flex-40 flex flex-col items-start justify-start text-left p-6 relative overflow-hidden">
                    <Image
                        src="/fondo_2.jpg"
                        alt="Fondo 1"
                        width={600}
                        height={400}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="mt-35 relative z-10 w-full">
                        <h1 className="text-5xl font-extrabold mb-2 text-white drop-shadow-lg">Ingeniero de Software y Computación</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-2xl text-white drop-shadow-lg">Desarrollador de aplicaciones Moviles y Web</h2>
                            <select
                                id="contacto"
                                className="mt-2 ml-13 p-2 rounded-lg bg-red-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500  text-white"
                                defaultValue=""
                            >
                                <option value="" disabled>Contacto</option>
                                <option value="https://gmail">Gmail</option>
                                <option value="https://linkeding/deibyramirez">LinkedIn</option>
                                <option value="https://github/deibyramirez">GitHub</option>
                                <option value="https://thecheivizshop.com">Cheiviz Shop</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="m-4 h-20 border-white border-3 flex justify-strat items-center text-2xl bg-black ">
                    <a
                        className="flex justify-center items-center "
                        href="https://thecheiviz"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Search className="w-10 h-10 m-4 text-white mr-2" /> https://thecheiviz
                    </a>
                </div>
            </div>
        </section>
    );
}