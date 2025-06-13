import Image from "next/image";
import Certificado from "./Certificado";

export default function Logros() {
    return (
        <section id="logros" className="w-full h-200   flex">
            <div className=" flex-1/2">
                <div className="m-4 w-100 h-20 ">
                    <h1 className="ml-5 text-3xl font-extrabold">CERTIFICADOS</h1>
                </div>
                <div className="m-4 h-170 shadow-lg shadow-black rounded-4xl flex-40 flex flex-col items-start justify-start text-left p-6 relative overflow-hidden">
                    <Image
                        src="/fondo_2.jpg"
                        alt="Fondo 2"
                        width={600}
                        height={400} 
                        className="absolute inset-0 w-full h-full object-cover z-0"/>
                    <div className="relative z-10 w-full">
                       <div className="m-3 grid grid-cols-3 gap-9">
                       <div><Certificado titulo="Certificado 1" imagen="/proyectos/fondo_4.jpg" /></div> 
                       <div><Certificado titulo="Certificado 2" imagen="/proyectos/fondo_4.jpg" /></div> 
                       <div><Certificado titulo="Certificado 3" imagen="/proyectos/fondo_4.jpg" /></div> 
                       <div><Certificado titulo="Certificado 4" imagen="/proyectos/fondo_4.jpg" /></div> 
                       <div><Certificado titulo="Certificado 5" imagen="/proyectos/fondo_4.jpg" /></div> 
                       </div>
                        
                    </div>

                </div>
            </div>
        </section>
    );
}