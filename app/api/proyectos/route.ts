import { COLLECCIONES, getMongoClient } from "@/app/lib/database";


export async function GET (){
    try {
        const clienteMongo = await getMongoClient();
        const db = clienteMongo.db("Portafolio");
        const coleccionProyectos = db.collection(COLLECCIONES.PROYECTOS);
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
