# 🚀 Portafolio Web FullStack

Este proyecto es un **portafolio web profesional** desarrollado con tecnologías modernas del ecosistema JavaScript, permitiendo gestionar proyectos, certificados y recursos multimedia almacenados en Firebase Storage.

---

## 🧩 Tecnologías Utilizadas

| Tecnología           | Uso                                                          |
| -------------------- | ------------------------------------------------------------ |
| **Next.js**          | Framework principal para el frontend y backend (API routes). |
| **React**            | Construcción de componentes y UI.                            |
| **Node.js**          | Entorno de ejecución para el backend.                        |
| **TypeScript**       | Tipado estático para mayor escalabilidad y seguridad.        |
| **MongoDB**          | Base de datos NoSQL para proyectos y certificados.           |
| **Firebase Storage** | Almacenamiento de imágenes y archivos del portafolio.        |

---

## 📌 Descripción General

Este proyecto implementa un sistema modular en Next.js que combina:

- Conexión a base de datos MongoDB
- Rutas API internas
- Transformación de URLs de Firebase Storage
- Consumo de API desde el frontend
- UI moderna, responsiva y optimizada

Todo esto para mostrar información del portafolio en tiempo real.

---

# 🧠 Detalles Técnicos del Desarrollo

## 1. 🔌 Conexión a MongoDB — `database.ts`

El archivo `database.ts` se encarga de:

- Establecer una conexión única hacia MongoDB usando Mongoose.
- Evitar reconexiones múltiples mediante un cliente persistente.
- Proveer un cliente listo para usarse en todas las rutas API.

Esto permite manejar las consultas de forma eficiente y escalable.

---

## 2. 📁 Rutas API — Carpeta `/app/api/`

En la carpeta `app/api` se crearon rutas estructuradas así:

/app/api/proyectos/route.ts
/app/api/certificados/route.ts

csharp
Copiar código

Cada handler:

- Procesa solicitudes HTTP (`GET`)
- Ejecuta la lógica correspondiente
- Interactúa con MongoDB
- Devuelve los datos en formato JSON

Ejemplo de estructura:

```ts
export async function GET() {
  await connectToDB();
  const data = await Modelo.find();
  return Response.json(data);
}
3. ⚙️ Configuración — next.config.js
Se modificó el archivo de configuración de Next.js para:

Permitir la carga de imágenes desde Firebase Storage.

Habilitar el uso de next/image con dominios externos.

Configurar remotePatterns para URLs de Firebase.

Ejemplo:

ts
Copiar código
remotePatterns: [
  {
    protocol: "https",
    hostname: "firebasestorage.googleapis.com",
    pathname: "/v0/b/portafoliodeibyramirez.firebasestorage.app/o/**",
  },
],
4. 🌐 Rutas GET implementadas
Se crearon y documentaron los endpoints:

🔹 GET /api/proyectos
Retorna todos los proyectos almacenados en la BD.

🔹 GET /api/certificados
Retorna todos los certificados almacenados en la BD.

Ambos:

Consultan MongoDB.

Formatean la respuesta.

Serán consumidos por el frontend.

5. 🔄 Consumo de las API con Fetch
En el frontend se consumen usando JavaScript:

ts
Copiar código
const API = process.env.NEXT_PUBLIC_API_URL;
const response = await fetch(`${API}/proyectos`, { cache: "no-store" });
const proyectos = await response.json();
Usar cache: "no-store" garantiza que siempre se obtengan datos actualizados.

6. 🔧 Conversión de URLs de Firebase Storage
Se implementó un componente (o función) encargado de convertir rutas tipo:

arduino
Copiar código
gs://bucket/proyectos/imagen.png
A URLs públicas válidas como:

bash
Copiar código
https://firebasestorage.googleapis.com/v0/b/bucket/o/proyectos%2Fimagen.png
Esto se logra mediante:

Reemplazo de espacios → %20

Conversión de / → %2F

Construcción dinámica de la URL final

Ejemplo de función:

ts
Copiar código
export function convertirGSUrl(gsUrl: string) {
  const bucket = "portafoliodeibyramirez.firebasestorage.app";
  const path = gsUrl.split(`${bucket}/`)[1].replace(/\//g, "%2F");
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${path}?alt=media`;
}
Esto permite usar <Image /> de Next.js sin errores.

📁 Estructura del Proyecto
pgsql
Copiar código
📦 project
 ┣ 📂 app
 ┃ ┣ 📂 api
 ┃ ┃ ┣ 📂 proyectos
 ┃ ┃ ┃ ┗ 📜 route.ts
 ┃ ┃ ┣ 📂 certificados
 ┃ ┃ ┃ ┗ 📜 route.ts
 ┃ ┗ 📂 componentes
 ┃     ┣ 📜 Proyectos.tsx
 ┃     ┣ 📜 Herramientas.tsx
 ┃     ┗ 📜 Conversion.ts
 ┣ 📂 lib
 ┃ ┗ 📜 database.ts
 ┣ 📜 next.config.js
 ┣ 📜 package.json
 ┣ 📜 README.md
🏁 Conclusión
Este proyecto reúne conocimientos de desarrollo FullStack, integrando:

Backend con API Routes

Frontend con React y TypeScript

Base de datos MongoDB

Almacenamiento Firebase Storage

Configuración avanzada de Next.js

Su arquitectura está construida para ser:

Escalable

Modular

Fácil de extender

Óptima para un portafolio profesional

🙌 Autor
Desarrollado por:
Deiby Ramírez — Ingeniero de Software y Computación


📦 1. Crear el archivo .env.docker

Este archivo contiene las variables de entorno que tu contenedor usará en producción o pruebas.

Ejemplo:

MONGODB_URI=TU_URI_DE_ATLAS
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PUERTO=3000


Este archivo no se sube a GitHub, ya que contiene información sensible.

Asegúrate de tenerlo en tu .gitignore:

.env*

📝 2. Dockerfile utilizado

Este Dockerfile construye una versión optimizada del proyecto Next.js:

# Imagen oficial recomendada por Next.js
FROM node:18-alpine

# Crear carpeta de la app
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --production=false

# Copiar el resto del proyecto
COPY . .

# Construir Next.js
RUN npm run build

# Exponer el puerto de la app
EXPOSE 3000

# Comando final de ejecución
CMD ["npm", "start"]

🚀 3. Construir la imagen

En la raíz del proyecto:

docker build -t portafolio .

▶️ 4. Ejecutar el contenedor

Con las variables de .env.docker:

docker run -p 3000:3000 --env-file .env.docker portafolio

🔧 5. Diferencias entre .env, .env.local y .env.docker
Archivo	Uso	Se sube a GitHub
.env	Variables generales del proyecto	❌ No
.env.local	Variables para desarrollo local	❌ No
.env.docker	Variables exclusivas para Docker	❌ No
💡 ¿Por qué usar .env.docker?

Mantiene separado el entorno local del entorno dentro del contenedor

Permite definir variables específicas para Docker

Evita usar puertos incorrectos o URLs del host

No afecta el funcionamiento habitual en npm run dev

📌 6. Comportamiento esperado

Si todo está correcto, deberías ver algo como:

▲ Next.js 15.x.x
- Local: http://localhost:3000
Conectado a MongoDB...


Y tu portafolio estará disponible en:

👉 http://localhost:3000

🎯 Conclusión

La dockerización permite que tu portafolio:

Funcione igual en cualquier sistema operativo

Tenga un entorno limpio y reproducible

Esté listo para despliegues en servicios como Railway, Dokku, Render, Fly.io o un VPS

Nota: Vercel no usa Docker para proyectos de frontend, pero aprender Docker te servirá para futuras APIs y proyectos backend.
```
