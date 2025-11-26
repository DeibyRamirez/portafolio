import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI no esta definido en las variables de entorno");
}

// Obtengo la URI de conexión y el puerto desde las variables de entorno
const uri = process.env.MONGO_URI;
const port = process.env.PORT;

// Esto es para mantener una instancia única del cliente de MongoDB
let cliente: MongoClient;
let clientePromise: Promise<MongoClient>;


// Este bloque de código asegura que en desarrollo no se creen múltiples conexiones
if (process.env.NODE_ENV === "development") {
    // El globalConMongo es una extensión del objeto global para almacenar la promesa del cliente
    let globalConMongo = global as typeof globalThis & {
        // Promise sirve para almacenar la promesa del cliente de MongoDB
        _mongoClientPromise?: Promise<MongoClient>;
    };


    if (!globalConMongo._mongoClientPromise) {
        cliente = new MongoClient(uri);
        globalConMongo._mongoClientPromise = cliente.connect();
        console.log(`Conectado a MongoDB en el puerto ${port} (desarrollo)`);
    }
    clientePromise = globalConMongo._mongoClientPromise;
} else {
    cliente = new MongoClient(uri);
    clientePromise = cliente.connect();
    console.log(`Conectado a MongoDB en el puerto ${port}`);
}

// Exporto la promesa del cliente de MongoDB
export default clientePromise;


// Nombres de las colecciones en la base de datos
export const COLLECCIONES = {
    PROYECTOS: "proyectos",
    CERTIFICADOS: "certificados",
}