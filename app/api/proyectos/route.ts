import clientePromise, { COLLECCIONES } from "@/app/lib/database";

const cliente = clientePromise;
const collection = COLLECCIONES.PROYECTOS;


export async function GET (){
    try {
        const clienteMongo = await cliente;
        const db = clienteMongo.db("Portafolio");
        const coleccionProyectos = db.collection(collection);
        const proyectos = await coleccionProyectos.find({}).toArray();
        return new Response(JSON.stringify(proyectos), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        return new Response(JSON.stringify({ message: "Error al obtener los proyectos" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}