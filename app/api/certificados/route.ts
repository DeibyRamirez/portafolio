import clientePromise, { COLLECCIONES } from "@/app/lib/database";

const cliente = clientePromise;
const collection = COLLECCIONES.CERTIFICADOS;


export async function GET (){
    try {
        const clienteMongo = await cliente;
        const db = clienteMongo.db(
            "Portafolio"
        );
        const coleccionCertificados = db.collection(collection);
        const certificados = await coleccionCertificados.find({}).toArray();
        return new Response(JSON.stringify(certificados), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error al obtener los certificados:", error);
        return new Response(JSON.stringify({ message: "Error al obtener los certificados" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}