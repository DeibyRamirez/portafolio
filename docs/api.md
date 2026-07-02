# API REST del Portafolio

Documentacion de los endpoints HTTP expuestos por Next.js Route Handlers en `app/api/*`.

> **Integracion Flutter:** guia completa con modelos Dart, servicio HTTP y ejemplos en [`flutter-guia.md`](./flutter-guia.md).

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

La API **sube imagenes directamente a Firebase Storage** cuando envias `multipart/form-data`. Tambien acepta rutas `gs://` en JSON (modo legacy).

### Estructura de carpetas en Storage

```text
proyectos/
  {tipo}/                          # movil, web, game_dev, automatizacion, ciberseguridad
    {titulo del proyecto}/         # nombre exacto del titulo
      {titulo}_1.png
      {titulo}_2.png
      ...

certificados/
  {titulo del certificado}/
    {titulo}_1.png
```

**Ejemplo real:**

```text
gs://portafoliodeibyramirez.firebasestorage.app/proyectos/automatizacion/Automatizacion PQR Correos Electronicos/Automatizacion PQR Correos Electronicos_1.png
```

### Flujo al crear un proyecto (multipart)

1. La API guarda metadata en MongoDB.
2. Crea archivos en Storage con la ruta `proyectos/{tipo}/{titulo}/{titulo}_n.ext`.
3. Actualiza MongoDB con las rutas `gs://` generadas.

Si falla la subida a Storage, **revierte** el documento en MongoDB.

### POST /api/proyectos con archivos

```http
POST /api/proyectos
Content-Type: multipart/form-data
Authorization: Bearer TU_API_KEY
```

| Campo | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `data` | string (JSON) | Si | Metadata del proyecto |
| `imagenes` | file(s) | No | Una o varias imagenes PNG/JPG/WEBP/GIF |

El campo `tipo` en `data` es **obligatorio** si envias archivos `imagenes`.

**Ejemplo curl:**

```bash
curl -X POST https://TU-DOMINIO.vercel.app/api/proyectos \
  -H "Authorization: Bearer TU_API_KEY" \
  -F 'data={"titulo":"Automatizacion PQR Correos Electronicos","descripcion":"Flujo n8n para PQR","tipo":"automatizacion","lenguajes":["JavaScript"],"frameworks":["n8n"]}' \
  -F "imagenes=@captura1.png" \
  -F "imagenes=@captura2.png"
```

**Respuesta:** proyecto con `imagenes[]` ya poblado con rutas `gs://`.

### PATCH /api/proyectos/:id con archivos

| Campo extra | Descripcion |
| --- | --- |
| `imagenes` | Nuevas imagenes a agregar al final |
| `reemplazarImagenes` | `"true"` para borrar las anteriores y renumerar desde `_1` |

### POST /api/certificados con archivo

```bash
curl -X POST https://TU-DOMINIO.vercel.app/api/certificados \
  -H "Authorization: Bearer TU_API_KEY" \
  -F 'data={"titulo":"AWS Cloud Practitioner","institucion":"AWS","fecha":"2025"}' \
  -F "imagen=@certificado.png"
```

Ruta generada: `certificados/{titulo}/{titulo}_1.png`

### Modo JSON (sin subir archivos)

Sigue funcionando enviando rutas `gs://` manualmente en `imagenes[]` o `imagen`.

### Configuracion Firebase en el servidor

Variables en Vercel / `.env.local`:

```env
# Opcion A (recomendada)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Opcion B
FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Obtén el JSON en Firebase Console → Project Settings → Service Accounts → Generate new private key.

El sitio web convierte automaticamente `gs://` a URL publica HTTPS en runtime.

Ver guia Flutter con multipart: [`flutter-guia.md`](./flutter-guia.md).

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
| `app/lib/api/multipart.ts` | Parseo multipart/form-data |
| `app/lib/firebase/storage.ts` | Subida a Firebase Storage |
| `app/lib/firebase/storage-paths.ts` | Rutas y nombres de archivos |
| `app/lib/services/recursos-con-imagenes.ts` | Orquestacion MongoDB + Storage |
| `app/lib/api/responses.ts` | Respuestas HTTP estandarizadas |
