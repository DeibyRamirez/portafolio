import Image from "next/image";

interface HerramientasProps {
    lenguajes: string[];
    frameworks: string[];
    librerias: string[];
    tipo: "movil" | "web";
}

export default function Herramientas({ lenguajes, frameworks, librerias, tipo }: HerramientasProps) {
    if (tipo === "movil") {
        return (
            <div className="w-250 h-100 bg-white rounded-lg shadow-md p-6 space-y-6">
                <h1 className="text-3xl font-bold text-black">Herramientas :</h1>
                <div className=" flex gap-10 justify-center items-start">
                    <div className=" w-50 h-70  bg-white border border-black rounded-2xl shadow-yellow-400 shadow-lg">
                        <h2 className="m-2 text-xl font-semibold text-blue-600 mb-2">Lenguajes</h2>
                        <ul className=" m-4 flex flex-col gap-2">
                            {lenguajes.map((lenguaje, index) => (
                                <li
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {lenguaje}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-50 h-70  bg-white border border-black rounded-2xl shadow-yellow-400 shadow-lg ">
                        <h2 className="m-2 text-xl font-semibold text-green-600 mb-2">Frameworks</h2>
                        <ul className="m-4 flex flex-col gap-2">
                            {frameworks.map((framework, index) => (
                                <li
                                    key={index}
                                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {framework}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-50 h-70  bg-white border border-black rounded-2xl shadow-yellow-400 shadow-lg ">
                        <h2 className=" m-2 text-xl font-semibold text-purple-600 mb-2">Librerías</h2>
                        <ul className=" m-4 flex flex-col gap-2">
                            {librerias.map((libreria, index) => (
                                <li
                                    key={index}
                                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {libreria}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-152 h-82 bg-white rounded-lg shadow-md p-6 space-y-6">
            <h1 className="text-3xl font-bold text-black">Herramientas :</h1>
            <div className="flex gap-4 justify-start items-start">
                <div className="w-50 h-55 border border-black shadow shadow-yellow-500 rounded-2xl">
                    <h2 className="m-2 text-xl font-semibold text-blue-600 mb-2">Lenguajes</h2>
                    <ul className="m-4 flex flex-col gap-2">
                        {lenguajes.map((lenguaje, index) => (
                            <li
                                key={index}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {lenguaje}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-50 h-55 border border-black shadow shadow-yellow-500 rounded-2xl">
                    <h2 className="m-2 text-xl font-semibold text-green-600 mb-2">Frameworks</h2>
                    <ul className="m-4 flex flex-col gap-2">
                        {frameworks.map((framework, index) => (
                            <li
                                key={index}
                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {framework}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="w-50 h-55 border border-black shadow shadow-yellow-500 rounded-2xl">
                    <h2 className="m-2 text-xl font-semibold text-purple-600 mb-2">Librerías</h2>
                    <ul className="m-4 flex flex-col gap-2">
                        {librerias.map((libreria, index) => (
                            <li
                                key={index}
                                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {libreria}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}