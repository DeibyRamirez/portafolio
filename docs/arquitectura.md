# Arquitectura y flujos de datos

Este documento explica como esta organizado el portafolio, como fluyen los datos desde MongoDB hasta la interfaz y que patrones se aplican en el codigo.

> **Indice completo de documentacion:** [`docs/README.md`](./README.md)

## Vision general

El portafolio es un **monolito Next.js 15** con App Router. Toda la aplicacion vive en un solo repositorio:

- **Frontend**: secciones modulares renderizadas en una sola pagina con navegacion por anclas.
- **Backend**: Route Handlers en `app/api/*` para exponer JSON.
- **Datos**: MongoDB Atlas con base de datos `Portafolio`.
- **Medios**: imagenes almacenadas en Firebase Storage con rutas `gs://`.

No hay panel de administracion web. El contenido se gestiona via **API REST** (desde app movil o herramientas como Postman) o directamente en MongoDB.

## Stack tecnologico

| Tecnologia | Rol |
| --- | --- |
| Next.js 15 | Framework, SSR, API routes |
| React 19 | Componentes de interfaz |
| TypeScript | Tipado estatico (`strict: true`) |
| Tailwind CSS v4 | Estilos y utilidades |
| MongoDB (driver nativo) | Persistencia de proyectos y certificados |
| Firebase Storage | Imagenes publicas (URLs convertidas en runtime) |
| Lucide React | Iconografia |
| pnpm | Gestor de paquetes |
| GitHub Actions | CI (lint + build) |
| Docker | Despliegue en contenedor |

## Base de datos MongoDB

### Base de datos: `Portafolio`

#### Coleccion `proyectos`

Cada documento representa un proyecto publicado en una categoria tecnica.

```json
{
  "_id": { "$oid": "..." },
  "titulo": "Plataforma Web: Electro Quiz",
  "descripcion": "...",
  "repositorio": "https://github.com/...",
  "tipo": "web",
  "lenguajes": ["TypeScript", "JavaScript", "CSS"],
  "frameworks": ["Next.js"],
  "librerias": ["TailwindCSS", "Radix UI", "..."],
  "imagenes": [
    "gs://portafoliodeibyramirez.firebasestorage.app/proyectos/web/..."
  ]
}
```

**Campo `tipo`** — define en que seccion aparece el proyecto:

| Valor | Seccion |
| --- | --- |
| `movil` | Desarrollo Movil |
| `web` | Desarrollo Web |
| `game_dev` | Game Dev |
| `automatizacion` | Automatizaciones |
| `ciberseguridad` | Ciberseguridad |

**Herramientas embebidas**: `lenguajes`, `frameworks` y `librerias` no son una coleccion aparte. Van dentro de cada proyecto y alimentan el componente `Herramientas`.

#### Coleccion `certificados`

```json
{
  "_id": { "$oid": "..." },
  "titulo": "Data Analysis with Python",
  "imagen": "gs://portafoliodeibyramirez.firebasestorage.app/certificados/...",
  "institucion": "Coursera",
  "fecha": "2024"
}
```

## Estructura de carpetas

```text
app/
  api/
    certificados/
      route.ts             # GET list + POST create
      [id]/route.ts        # GET by id, PUT/PATCH, DELETE
    proyectos/
      route.ts             # GET list + POST create
      [id]/route.ts        # GET by id, PUT/PATCH, DELETE
  components/
    ContenedorProyectoCategoria.tsx  # Selector multi-proyecto (client)
    Conversion.tsx                   # gs:// → URL publica Firebase
  lib/
    api/
      auth.ts              # Verificacion de API key
      responses.ts         # Respuestas HTTP estandarizadas
      validate.ts          # Validacion de bodies JSON
      revalidate.ts        # Invalidacion de cache tras escrituras
    api.ts                 # Cliente HTTP interno (fetch + safeFetchJson)
    database.ts            # Singleton MongoClient
    data/
      proyectos.ts         # CRUD + filtrarProyectosPorTipo
      certificados.ts      # CRUD de certificados
  models/                  # Interfaces TypeScript
  pages/                   # Secciones de la pagina (NO son rutas Next.js)
  layout.tsx               # Nav, footer, metadata
  page.tsx                 # Compositor: fetch unico + props
docs/
  api.md                   # Documentacion REST completa
  ci-cd.md
  arquitectura.md
```

## Capas del sistema

```text
┌─────────────────────────────────────────────────────────────┐
│  Presentacion (app/pages/*, app/components/*)               │
│  Server Components reciben datos por props                  │
│  Client Components para interaccion (modal, acordeon, tabs)  │
└───────────────────────────┬─────────────────────────────────┘
                            │ props desde page.tsx
┌───────────────────────────▼─────────────────────────────────┐
│  Capa de datos (app/lib/data/*)                               │
│  get*, create*, update*, delete*, filtrarProyectosPorTipo()   │
└───────────────────────────┬─────────────────────────────────┘
                            │ MongoClient
┌───────────────────────────▼─────────────────────────────────┐
│  MongoDB — base Portafolio                                    │
│  Colecciones: proyectos, certificados                         │
└─────────────────────────────────────────────────────────────┘

         API routes (app/api/*) reutilizan la misma capa de datos
         para consumo externo o integraciones futuras.
```

## Flujo de datos en la pagina principal

Antes, cada seccion hacia su propio `fetch` a `/api/proyectos`. Eso generaba **4 consultas duplicadas** por carga.

Ahora el flujo es:

```text
1. page.tsx ejecuta en paralelo:
   - getProyectos()
   - getCertificados()

2. page.tsx filtra proyectos por tipo y pasa props:
   - DesarrolloMovil      ← proyectos tipo "movil"
   - DesarrolloWeb        ← proyectos tipo "web"
   - Automatizaciones     ← proyectos tipo "automatizacion"
   - GameDev              ← proyectos tipo "game_dev"
   - Ciberseguridad       ← proyectos tipo "ciberseguridad"
   - Logros               ← certificados[]

3. Cada seccion usa ContenedorProyectoCategoria:
   - Si hay 1 proyecto → lo muestra directamente
   - Si hay 2+ → tabs para alternar entre proyectos
   - Al cambiar tab → actualiza Proyectos + Herramientas

4. Las imagenes gs:// se convierten a URL publica con convertirGSUrl()
```

### Diagrama simplificado

```text
MongoDB.proyectos
       │
       ▼
getProyectos()  ──► page.tsx ──► filtrarPorTipo ──► Seccion
       │                                              │
       │                                              ├── ContenedorProyectoCategoria
       │                                              │      ├── Proyectos (card + modal)
       │                                              │      └── Herramientas (acordeon)
       │
       └──► GET /api/proyectos (misma funcion, para API externa)
```

## Patrones aplicados

### 1. Fetch unico en el compositor

`app/page.tsx` centraliza la lectura de datos. Las secciones son **presentacionales** y reciben props tipadas.

Beneficio: una sola conexion a MongoDB por request, menos latencia y codigo mas predecible.

### 2. Capa de datos reutilizable

`app/lib/data/proyectos.ts` y `certificados.ts` mapean documentos MongoDB a interfaces TypeScript:

- `_id` → `id` (string)
- Arrays vacios por defecto si faltan campos
- Degradacion graceful: retorna `[]` si MongoDB no esta disponible (util en CI/build)

Las API routes importan las mismas funciones — no duplican logica de consulta.

### 3. Render props con ContenedorProyectoCategoria

Componente client que encapsula:

- Estado del proyecto seleccionado (`useState`)
- Tabs de seleccion cuando hay multiples proyectos
- Conversion de URLs de imagenes
- Context API (`useProyectoCategoria`) para compartir el proyecto activo con subcomponentes

**Importante:** en Next.js App Router no se puede pasar una funcion como `children` desde un Server Component a un Client Component (no es serializable). Por eso las secciones usan `children` como JSX estatico y consumen el contexto con `useProyectoCategoria()` en subcomponentes client.

### 4. Server vs Client Components

| Tipo | Ejemplos | Responsabilidad |
| --- | --- | --- |
| Server | `page.tsx`, secciones, `Logros` | Recibir datos, layout estatico |
| Client | `Proyectos`, `Herramientas`, `Inicio`, `ContenedorProyectoCategoria` | Interaccion, modales, acordeones, tabs |

### 5. Categoria-aware UI

`Proyectos.tsx` renderiza layouts distintos segun `tipo`:

- `movil` — carrusel vertical en mockup de telefono
- `web` — layout horizontal en mockup de PC
- `game_dev` — tema oscuro con badge de jam
- `automatizacion` — vista amplia optimizada para capturas n8n

`Herramientas.tsx` adapta titulos de secciones por tipo (p. ej. Game Dev → "Motor & Logica").

### 6. Conversion de medios Firebase

MongoDB guarda rutas `gs://bucket/path`. `Conversion.tsx` las transforma a:

```text
https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media
```

`next.config.ts` permite el dominio en `next/image`.

## API REST

La API expone CRUD completo sobre proyectos y certificados. Documentacion detallada en [`docs/api.md`](./api.md).

### Autenticacion

| Operacion | Auth |
| --- | --- |
| `GET` (lectura) | Publica — sin credenciales |
| `POST`, `PUT`, `PATCH`, `DELETE` (escritura) | Requiere header `Authorization: Bearer <PORTFOLIO_API_KEY>` o `X-API-Key` |

Si `PORTFOLIO_API_KEY` no esta configurada en el servidor, las operaciones de escritura responden **401**.

### Endpoints

| Metodo | Ruta | Funcion de datos | Auth |
| --- | --- | --- | --- |
| GET | `/api/proyectos` | `getProyectos()` | No |
| GET | `/api/proyectos/:id` | `getProyectoById()` | No |
| POST | `/api/proyectos` | `createProyecto()` | Si |
| PUT/PATCH | `/api/proyectos/:id` | `updateProyecto()` | Si |
| DELETE | `/api/proyectos/:id` | `deleteProyecto()` | Si |
| GET | `/api/certificados` | `getCertificados()` | No |
| GET | `/api/certificados/:id` | `getCertificadoById()` | No |
| POST | `/api/certificados` | `createCertificado()` | Si |
| PUT/PATCH | `/api/certificados/:id` | `updateCertificado()` | Si |
| DELETE | `/api/certificados/:id` | `deleteCertificado()` | Si |

Tras cada operacion de escritura se ejecuta `revalidatePath("/")` para refrescar la pagina principal.

`app/lib/api.ts` (`safeFetchJson`, `buildApiUrl`) queda disponible para consumo HTTP desde clientes internos. La pagina principal lee MongoDB directamente via la capa de datos.

## Variables de entorno

| Variable | Requerida | Uso |
| --- | --- | --- |
| `MONGODB_URI` | Si (produccion) | Conexion a MongoDB Atlas |
| `PORTFOLIO_API_KEY` | Si (escritura API) | Clave secreta para POST/PUT/PATCH/DELETE |
| `NEXT_PUBLIC_API_URL` | Opcional | Base URL para `safeFetchJson` |
| `PORT` | Opcional | Puerto local (default 3000) |

Archivo de referencia: `.env.example`

## Como agregar contenido

### Via API (recomendado para app movil)

1. Configura `PORTFOLIO_API_KEY` en Vercel o `.env.local`.
2. Sube imagenes a Firebase Storage y obtén la ruta `gs://...`.
3. Envía `POST /api/proyectos` o `POST /api/certificados` con la API key en el header.
4. El contenido aparece automaticamente en el sitio tras la revalidacion.

Ver ejemplos completos en [`docs/api.md`](./api.md).

### Manualmente en MongoDB

#### Nuevo proyecto

1. Insertar documento en `Portafolio.proyectos` con el campo `tipo` correcto.
2. Subir imagenes a Firebase Storage y guardar rutas `gs://...` en `imagenes[]`.
3. Completar `lenguajes`, `frameworks`, `librerias` para la seccion de herramientas.
4. Recargar la pagina — aparecera en la seccion correspondiente.
5. Si hay varios proyectos del mismo tipo, el selector de tabs se activa automaticamente.

#### Nuevo certificado

1. Insertar documento en `Portafolio.certificados`.
2. La seccion Logros lo renderiza automaticamente.

### Nueva categoria tecnica

1. Agregar valor en `DesarrolloInterface.tipo`.
2. Crear seccion en `app/pages/`.
3. Filtrar en `page.tsx` con `filtrarProyectosPorTipo`.
4. Agregar enlace en `layout.tsx` (desktop y movil).
5. Opcional: layout especifico en `Proyectos.tsx` y `Herramientas.tsx`.

## Seguridad

- Lectura publica (`GET`) sin autenticacion — adecuado para portafolio.
- Escritura protegida con `PORTFOLIO_API_KEY` via header Bearer o `X-API-Key`.
- Validacion de inputs en `app/lib/api/validate.ts` antes de persistir en MongoDB.
- IDs validados con `ObjectId.isValid()` antes de consultas por ID.
- `.env*` excluido de git.
- Docker corre con usuario `nextjs` sin privilegios.
- Enlaces externos con `rel="noopener noreferrer"`.

## CI/CD

Ver documentacion detallada en [`docs/ci-cd.md`](./ci-cd.md).

El workflow ejecuta `pnpm lint` y `pnpm build`. Si MongoDB no esta configurado en CI, la app compila igual gracias al manejo de errores en la capa de datos.

## En resumen

El portafolio combina una **arquitectura modular por secciones** con una **capa de datos centralizada** y una **API REST CRUD** lista para consumo desde app movil. Los proyectos y certificados viven en MongoDB, las herramientas van embebidas en cada proyecto, y la pagina principal hace un unico fetch para alimentar todas las categorias con soporte multi-proyecto.

## Documentos relacionados

| Documento | Contenido |
| --- | --- |
| [Indice docs](./README.md) | Mapa completo de documentacion |
| [Modelos](./modelos.md) | Campos, tipos y reglas de validacion |
| [Logica](./logica.md) | CRUD, auth, capa de datos |
| [Flujos](./flujos.md) | Diagramas de secuencia |
| [API REST](./api.md) | Contrato HTTP |
| [Guia Flutter](./flutter-guia.md) | Integracion app movil |
