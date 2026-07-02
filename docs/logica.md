# Logica de negocio y capa de datos

Este documento explica **que hace el codigo** detras de la API y del sitio web: conexion a MongoDB, operaciones CRUD, validacion, autenticacion y manejo de errores.

## Capas del backend

```text
Request HTTP
     │
     ▼
app/api/*/route.ts          ← Route Handlers (entrada/salida HTTP)
     │
     ├── verificarApiKey()   ← solo escritura
     ├── validar*Input()     ← solo POST/PUT/PATCH
     │
     ▼
app/lib/data/*.ts           ← Operaciones MongoDB
     │
     ▼
app/lib/database.ts         ← Singleton MongoClient
     │
     ▼
MongoDB Atlas (DB: Portafolio)
```

El sitio web **no pasa por la API**. `app/page.tsx` importa directamente `app/lib/data/*`.

---

## Conexion a MongoDB

**Archivo:** `app/lib/database.ts`

| Aspecto | Detalle |
| --- | --- |
| Driver | `mongodb` nativo (v7+) |
| Variable | `MONGODB_URI` |
| Base de datos | `"Portafolio"` (hardcoded en capa de datos) |
| Colecciones | `proyectos`, `certificados` (constante `COLLECCIONES`) |
| Patron | Singleton con cache en `globalThis` en desarrollo (hot reload) |

Si `MONGODB_URI` no esta definida, `getMongoClient()` lanza error. Las funciones de **lectura masiva** (`getProyectos`, `getCertificados`) capturan el error y retornan `[]` para que el build de CI funcione sin base de datos.

Las operaciones de **escritura y lectura por ID** propagan el error a la API (respuesta 500).

---

## Operaciones CRUD — Proyectos

**Archivo:** `app/lib/data/proyectos.ts`

| Funcion | Descripcion | Retorno si falla |
| --- | --- | --- |
| `getProyectos()` | `find({})` — todos los proyectos | `[]` |
| `getProyectoById(id)` | `findOne({ _id })` | `null` (ID invalido o no existe) |
| `createProyecto(input)` | `insertOne()` | lanza error |
| `updateProyecto(id, input)` | `findOneAndUpdate` con `$set` parcial | `null` |
| `deleteProyecto(id)` | `deleteOne()` | `false` |
| `filtrarProyectosPorTipo(lista, tipo)` | filtro en memoria | — |

### Validacion de ObjectId

Antes de consultar por ID:

```typescript
function parseObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}
```

IDs mal formados se tratan como "no encontrado" (404 en la API), no como error de servidor.

### Create — defaults aplicados

```typescript
{
  imagenes: input.imagenes ?? [],
  lenguajes: input.lenguajes ?? [],
  frameworks: input.frameworks ?? [],
  librerias: input.librerias ?? [],
  // tipo y repositorio opcionales, pueden quedar undefined
}
```

### Update — merge parcial

Solo los campos presentes en el body se incluyen en `$set`. Si el body no tiene campos editables, se retorna el documento actual sin modificar.

---

## Operaciones CRUD — Certificados

**Archivo:** `app/lib/data/certificados.ts`

Misma estructura que proyectos:

| Funcion | Descripcion |
| --- | --- |
| `getCertificados()` | Lista completa |
| `getCertificadoById(id)` | Un documento |
| `createCertificado(input)` | Insert |
| `updateCertificado(id, input)` | Update parcial |
| `deleteCertificado(id)` | Delete |

---

## Validacion de requests

**Archivo:** `app/lib/api/validate.ts`

Toda entrada JSON de escritura pasa por funciones de validacion antes de llegar a MongoDB.

| Funcion | Usada en |
| --- | --- |
| `validarProyectoInput(body)` | `POST /api/proyectos` |
| `validarProyectoUpdateInput(body)` | `PUT/PATCH /api/proyectos/:id` |
| `validarCertificadoInput(body)` | `POST /api/certificados` |
| `validarCertificadoUpdateInput(body)` | `PUT/PATCH /api/certificados/:id` |

Patron de retorno:

```typescript
{ ok: true, data: ProyectoInput }
// o
{ ok: false, message: "El campo 'titulo' es requerido..." }
```

No hay libreria externa (Zod/Joi). La validacion es manual y explicita.

---

## Autenticacion API

**Archivo:** `app/lib/api/auth.ts`

| Metodo HTTP | Requiere auth |
| --- | --- |
| GET | No |
| POST, PUT, PATCH, DELETE | Si |

### Verificacion

1. Lee `PORTFOLIO_API_KEY` del entorno.
2. Si no existe → rechaza (401) y log de advertencia.
3. Compara con:
   - Header `Authorization: Bearer <key>`
   - Header `X-API-Key: <key>`

Funcion exportada: `verificarApiKey(request: Request): boolean`.

---

## Respuestas HTTP estandarizadas

**Archivo:** `app/lib/api/responses.ts`

| Helper | Status | Body |
| --- | --- | --- |
| `respuestaExito(data, status?)` | 200 / 201 | recurso o array |
| `respuestaError(message, status)` | 400, 500, etc. | `{ message }` |
| `respuestaNoEncontrado(recurso)` | 404 | `{ message: "Proyecto no encontrado" }` |
| `respuestaNoAutorizado()` | 401 | `{ message: "No autorizado..." }` |

---

## Revalidacion de cache

**Archivo:** `app/lib/api/revalidate.ts`

Tras cada operacion de escritura exitosa, los Route Handlers llaman:

```typescript
revalidarPortafolio(); // → revalidatePath("/")
```

Esto invalida la cache de Next.js para la pagina principal. La pagina usa `export const dynamic = "force-dynamic"`, pero la revalidacion asegura consistencia en distintos modos de despliegue.

---

## Route Handlers — flujo por operacion

### POST (crear)

```text
1. verificarApiKey(request)           → 401 si falla
2. request.json()
3. validar*Input(body)              → 400 si falla
4. create*(validacion.data)         → 201 + recurso
5. revalidarPortafolio()
```

### GET por ID

```text
1. get*ById(params.id)               → 404 si null
2. respuestaExito(recurso)           → 200
```

### PUT / PATCH (actualizar)

```text
1. verificarApiKey(request)           → 401
2. validar*UpdateInput(body)         → 400
3. update*(id, data)                 → 404 si null, 200 si ok
4. revalidarPortafolio()
```

### DELETE

```text
1. verificarApiKey(request)           → 401
2. delete*(id)                        → 404 si false, 200 + message si ok
3. revalidarPortafolio()
```

---

## Logica del sitio web (fuera de la API)

### Fetch unico en el compositor

**Archivo:** `app/page.tsx`

```typescript
const [proyectos, certificados] = await Promise.all([
  getProyectos(),
  getCertificados(),
]);
```

Una sola ronda de consultas MongoDB por request SSR.

### Filtrado por categoria

```typescript
filtrarProyectosPorTipo(proyectos, "web")
```

Filtro en memoria — no hay query MongoDB por tipo. Todos los proyectos se cargan y se reparten en secciones.

### Contenedor multi-proyecto

**Archivo:** `app/components/ContenedorProyectoCategoria.tsx`

| Proyectos del tipo | Comportamiento |
| --- | --- |
| 0 | Muestra mensaje vacio en la seccion |
| 1 | Muestra directamente, sin tabs |
| 2+ | Tabs para alternar; Context API comparte proyecto activo |

Context expone: `{ proyecto, imagenes }` donde `imagenes` ya estan convertidas a HTTPS.

### Conversion de imagenes

**Archivo:** `app/components/Conversion.tsx`

Se ejecuta en el contenedor y en `Logros.tsx` antes de pasar URLs a `<Image>` o componentes hijos.

---

## Manejo de errores — resumen

| Contexto | Comportamiento |
| --- | --- |
| `getProyectos()` / `getCertificados()` sin MongoDB | Log + retorna `[]` |
| `get*ById()` ID invalido | Retorna `null` → API 404 |
| Validacion fallida | API 400 con mensaje descriptivo |
| Auth fallida | API 401 |
| Error inesperado en Route Handler | Log + API 500 |

---

## Archivos clave — referencia rapida

| Archivo | Responsabilidad |
| --- | --- |
| `app/lib/database.ts` | Conexion MongoDB |
| `app/lib/data/proyectos.ts` | CRUD proyectos |
| `app/lib/data/certificados.ts` | CRUD certificados |
| `app/lib/api/auth.ts` | API key |
| `app/lib/api/validate.ts` | Validacion JSON |
| `app/lib/api/responses.ts` | Formato de respuestas |
| `app/lib/api/revalidate.ts` | Cache Next.js |
| `app/api/proyectos/route.ts` | GET list + POST |
| `app/api/proyectos/[id]/route.ts` | GET/PUT/PATCH/DELETE |
| `app/api/certificados/route.ts` | GET list + POST |
| `app/api/certificados/[id]/route.ts` | GET/PUT/PATCH/DELETE |

Ver contrato HTTP completo en [API REST](./api.md).

Ver modelos y campos en [Modelos](./modelos.md).

Ver secuencias visuales en [Flujos](./flujos.md).
