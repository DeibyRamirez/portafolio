# API REST del Portafolio

Documentacion de los endpoints HTTP expuestos por Next.js Route Handlers en `app/api/*`.

Esta API permite **leer** proyectos y certificados de forma publica, y **crear, actualizar y eliminar** contenido de forma autenticada — ideal para una app movil de administracion o integraciones externas.

## Base URL

| Entorno | URL base |
| --- | --- |
| Local | `http://localhost:3000/api` |
| Produccion (Vercel) | `https://TU-DOMINIO.vercel.app/api` |

La variable `NEXT_PUBLIC_API_URL` define la base para clientes internos. En la app movil puedes configurar la URL de produccion directamente.

## Autenticacion

| Operacion | Autenticacion |
| --- | --- |
| `GET` (lectura) | **Publica** — no requiere credenciales |
| `POST`, `PUT`, `PATCH`, `DELETE` (escritura) | **Requiere API key** |

### Configurar la API key

1. Genera una clave segura (minimo 32 caracteres aleatorios).
2. Agregala en Vercel → Settings → Environment Variables como `PORTFOLIO_API_KEY`.
3. En local, agregala en `.env.local`:

```env
PORTFOLIO_API_KEY=tu_clave_secreta_aqui
```

### Enviar la API key en las solicitudes

Opcion A — header `Authorization` (recomendado):

```http
Authorization: Bearer tu_clave_secreta_aqui
```

Opcion B — header `X-API-Key`:

```http
X-API-Key: tu_clave_secreta_aqui
```

Si la clave falta, es incorrecta o `PORTFOLIO_API_KEY` no esta configurada en el servidor, la API responde **401 Unauthorized**.

## Formato de respuestas

### Exito

Retorna el recurso o array directamente en JSON con codigo **200** (o **201** en creacion).

```json
{
  "id": "674a1b2c3d4e5f6789012345",
  "titulo": "Mi Proyecto",
  "descripcion": "...",
  "tipo": "web",
  "imagenes": ["gs://..."],
  "lenguajes": ["TypeScript"],
  "frameworks": ["Next.js"],
  "librerias": ["TailwindCSS"]
}
```

### Error

```json
{
  "message": "Descripcion del error"
}
```

| Codigo | Significado |
| --- | --- |
| 400 | Datos invalidos en el body |
| 401 | API key ausente o incorrecta |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

## Proyectos

### Listar proyectos

```http
GET /api/proyectos
```

**Respuesta 200:** array de proyectos.

```bash
curl https://TU-DOMINIO.vercel.app/api/proyectos
```

### Obtener proyecto por ID

```http
GET /api/proyectos/:id
```

```bash
curl https://TU-DOMINIO.vercel.app/api/proyectos/674a1b2c3d4e5f6789012345
```

### Crear proyecto

```http
POST /api/proyectos
Content-Type: application/json
Authorization: Bearer TU_API_KEY
```

**Body (JSON):**

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `titulo` | string | Si | Nombre del proyecto |
| `descripcion` | string | Si | Descripcion detallada |
| `tipo` | string | No | Categoria: `movil`, `web`, `game_dev`, `ciberseguridad`, `automatizacion` |
| `imagenes` | string[] | No | Rutas `gs://` de Firebase Storage |
| `repositorio` | string | No | URL del repositorio (GitHub, etc.) |
| `lenguajes` | string[] | No | Lenguajes usados |
| `frameworks` | string[] | No | Frameworks usados |
| `librerias` | string[] | No | Librerias usadas |

**Ejemplo:**

```bash
curl -X POST https://TU-DOMINIO.vercel.app/api/proyectos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY" \
  -d '{
    "titulo": "App de Inventario",
    "descripcion": "Sistema movil para gestion de inventario.",
    "tipo": "movil",
    "imagenes": ["gs://portafoliodeibyramirez.firebasestorage.app/proyectos/movil/app.png"],
    "repositorio": "https://github.com/usuario/inventario",
    "lenguajes": ["Dart"],
    "frameworks": ["Flutter"],
    "librerias": ["Provider"]
  }'
```

**Respuesta 201:** proyecto creado con `id` generado.

### Actualizar proyecto

```http
PUT /api/proyectos/:id
PATCH /api/proyectos/:id
Content-Type: application/json
Authorization: Bearer TU_API_KEY
```

Envia solo los campos que deseas modificar. `PUT` y `PATCH` se comportan igual (actualizacion parcial).

```bash
curl -X PATCH https://TU-DOMINIO.vercel.app/api/proyectos/674a1b2c3d4e5f6789012345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY" \
  -d '{"titulo": "App de Inventario v2", "frameworks": ["Flutter", "Riverpod"]}'
```

**Respuesta 200:** proyecto actualizado.

### Eliminar proyecto

```http
DELETE /api/proyectos/:id
Authorization: Bearer TU_API_KEY
```

```bash
curl -X DELETE https://TU-DOMINIO.vercel.app/api/proyectos/674a1b2c3d4e5f6789012345 \
  -H "Authorization: Bearer TU_API_KEY"
```

**Respuesta 200:**

```json
{ "message": "Proyecto eliminado correctamente" }
```

---

## Certificados

### Listar certificados

```http
GET /api/certificados
```

```bash
curl https://TU-DOMINIO.vercel.app/api/certificados
```

### Obtener certificado por ID

```http
GET /api/certificados/:id
```

### Crear certificado

```http
POST /api/certificados
Content-Type: application/json
Authorization: Bearer TU_API_KEY
```

**Body (JSON):**

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `titulo` | string | Si | Nombre del certificado o curso |
| `imagen` | string | Si | Ruta `gs://` de la imagen en Firebase |
| `institucion` | string | No | Plataforma emisora (Coursera, Google, etc.) |
| `fecha` | string | No | Ano o fecha de obtencion |

**Ejemplo:**

```bash
curl -X POST https://TU-DOMINIO.vercel.app/api/certificados \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_API_KEY" \
  -d '{
    "titulo": "AWS Cloud Practitioner",
    "imagen": "gs://portafoliodeibyramirez.firebasestorage.app/certificados/aws.png",
    "institucion": "Amazon Web Services",
    "fecha": "2025"
  }'
```

**Respuesta 201:** certificado creado con `id` generado.

### Actualizar certificado

```http
PUT /api/certificados/:id
PATCH /api/certificados/:id
Authorization: Bearer TU_API_KEY
```

### Eliminar certificado

```http
DELETE /api/certificados/:id
Authorization: Bearer TU_API_KEY
```

---

## Imagenes (Firebase Storage)

La API **no sube archivos** directamente. Las imagenes se gestionan en Firebase Storage y la API guarda las rutas `gs://` en MongoDB.

### Flujo recomendado para la app movil

1. Subir la imagen a Firebase Storage desde la app (SDK de Firebase).
2. Obtener la ruta `gs://bucket/path/archivo.png`.
3. Enviar esa ruta en el campo `imagen` o `imagenes[]` al crear/actualizar via API.

El sitio web convierte automaticamente `gs://` a URL publica HTTPS en runtime.

---

## Integracion con app movil

### Lectura (sin autenticacion)

```typescript
const BASE_URL = "https://TU-DOMINIO.vercel.app/api";

async function obtenerProyectos() {
  const res = await fetch(`${BASE_URL}/proyectos`);
  if (!res.ok) throw new Error("Error al cargar proyectos");
  return res.json();
}
```

### Escritura (con API key)

```typescript
const BASE_URL = "https://TU-DOMINIO.vercel.app/api";
const API_KEY = "tu_clave_secreta"; // almacenar de forma segura en la app

async function crearProyecto(datos: object) {
  const res = await fetch(`${BASE_URL}/proyectos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(datos),
  });

  if (res.status === 401) throw new Error("API key invalida");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}
```

> **Seguridad:** no embebas la API key en el codigo fuente de una app publica. Usa variables de entorno del build, un backend intermedio o autenticacion de usuario antes de exponer operaciones de escritura.

---

## Resumen de endpoints

| Metodo | Ruta | Auth | Descripcion |
| --- | --- | --- | --- |
| GET | `/api/proyectos` | No | Listar proyectos |
| GET | `/api/proyectos/:id` | No | Obtener proyecto |
| POST | `/api/proyectos` | Si | Crear proyecto |
| PUT | `/api/proyectos/:id` | Si | Actualizar proyecto |
| PATCH | `/api/proyectos/:id` | Si | Actualizar proyecto (parcial) |
| DELETE | `/api/proyectos/:id` | Si | Eliminar proyecto |
| GET | `/api/certificados` | No | Listar certificados |
| GET | `/api/certificados/:id` | No | Obtener certificado |
| POST | `/api/certificados` | Si | Crear certificado |
| PUT | `/api/certificados/:id` | Si | Actualizar certificado |
| PATCH | `/api/certificados/:id` | Si | Actualizar certificado (parcial) |
| DELETE | `/api/certificados/:id` | Si | Eliminar certificado |

## Codigo fuente relacionado

| Archivo | Responsabilidad |
| --- | --- |
| `app/api/proyectos/route.ts` | GET list + POST create |
| `app/api/proyectos/[id]/route.ts` | GET by id, PUT/PATCH, DELETE |
| `app/api/certificados/route.ts` | GET list + POST create |
| `app/api/certificados/[id]/route.ts` | GET by id, PUT/PATCH, DELETE |
| `app/lib/data/proyectos.ts` | Operaciones MongoDB de proyectos |
| `app/lib/data/certificados.ts` | Operaciones MongoDB de certificados |
| `app/lib/api/auth.ts` | Verificacion de API key |
| `app/lib/api/validate.ts` | Validacion de bodies JSON |
| `app/lib/api/responses.ts` | Respuestas HTTP estandarizadas |
