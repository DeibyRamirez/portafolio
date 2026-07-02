# Modelos de datos

Este documento describe las entidades del portafolio: como se guardan en MongoDB, como se tipan en TypeScript y que reglas aplican al crear o actualizar registros via API.

## Resumen de entidades

| Entidad | Coleccion MongoDB | Interface principal | Uso |
| --- | --- | --- | --- |
| Proyecto | `proyectos` | `DesarrolloInterface` | Secciones tecnicas del portafolio |
| Certificado | `certificados` | `CertificadoInterface` | Seccion Logros |

Las interfaces de presentacion (`ProyectosInterface`, `HerramientasInterface`) son subconjuntos usados solo por componentes UI del sitio web.

---

## Proyecto

### Archivo de tipos

- **Datos + API:** `app/models/Desarrollos.tsx` → `DesarrolloInterface`
- **UI (card):** `app/models/Proyectos.tsx` → `ProyectosInterface`
- **UI (acordeon):** `app/models/Herramientas.tsx` → `HerramientasInterface`
- **Input API create:** `app/lib/api/validate.ts` → `ProyectoInput`
- **Input API update:** `app/lib/api/validate.ts` → `ProyectoUpdateInput`

### Documento MongoDB (`Portafolio.proyectos`)

```json
{
  "_id": { "$oid": "674a1b2c3d4e5f6789012345" },
  "titulo": "Plataforma Web: Electro Quiz",
  "descripcion": "Aplicacion educativa para practicar electronica.",
  "repositorio": "https://github.com/usuario/electro-quiz",
  "tipo": "web",
  "lenguajes": ["TypeScript", "JavaScript"],
  "frameworks": ["Next.js"],
  "librerias": ["TailwindCSS", "Radix UI"],
  "imagenes": [
    "gs://portafoliodeibyramirez.firebasestorage.app/proyectos/web/captura1.png"
  ]
}
```

### Campos

| Campo | Tipo | Requerido (create) | Descripcion |
| --- | --- | --- | --- |
| `_id` | ObjectId | Auto | Generado por MongoDB. Expuesto como `id` (string) en la API |
| `titulo` | string | Si | Nombre visible del proyecto |
| `descripcion` | string | Si | Texto descriptivo largo |
| `tipo` | enum | No* | Categoria tecnica (ver tabla abajo) |
| `imagenes` | string[] | No | Rutas `gs://` en Firebase Storage. Default: `[]` |
| `repositorio` | string | No | URL del repo (GitHub, GitLab, etc.) |
| `lenguajes` | string[] | No | Lenguajes de programacion. Default: `[]` |
| `frameworks` | string[] | No | Frameworks usados. Default: `[]` |
| `librerias` | string[] | No | Librerias/paquetes. Default: `[]` |

\* `tipo` no es obligatorio al crear, pero sin el el proyecto no aparece en ninguna seccion del sitio web.

### Valores de `tipo`

| Valor | Seccion del sitio | ID ancla |
| --- | --- | --- |
| `movil` | Desarrollo Movil | `#d_movil` |
| `web` | Desarrollo Web | `#d_web` |
| `game_dev` | Game Dev | `#game_dev` |
| `automatizacion` | Automatizaciones | `#automatizaciones` |
| `ciberseguridad` | Ciberseguridad | `#ciberseguridad` |

Constante en codigo: `TIPOS_PROYECTO` en `app/lib/api/validate.ts`.

### Interface TypeScript (`DesarrolloInterface`)

```typescript
export interface DesarrolloInterface {
  id?: string;
  tipo?: "movil" | "web" | "game_dev" | "ciberseguridad" | "automatizacion";
  titulo: string;
  descripcion: string;
  imagenes: string[];
  repositorio?: string;
  lenguajes: string[];
  frameworks: string[];
  librerias: string[];
}
```

### Mapeo MongoDB → API

Funcion `mapProyecto()` en `app/lib/data/proyectos.ts`:

| MongoDB | API / TypeScript |
| --- | --- |
| `_id` | `id` (string) |
| campos ausentes en arrays | `[]` |
| resto de campos | copia directa |

### Reglas de validacion (API)

Aplicadas en `validarProyectoInput()` y `validarProyectoUpdateInput()`:

- `titulo` y `descripcion` no pueden estar vacios (solo espacios).
- `tipo` debe ser uno de los 5 valores permitidos.
- `imagenes`, `lenguajes`, `frameworks`, `librerias` deben ser arrays de strings.
- En update: al menos un campo editable debe enviarse.

---

## Certificado

### Archivo de tipos

- **Datos + API:** `app/models/Certificados.tsx` → `CertificadoInterface`
- **Input API create:** `CertificadoInput`
- **Input API update:** `CertificadoUpdateInput`

### Documento MongoDB (`Portafolio.certificados`)

```json
{
  "_id": { "$oid": "674a1b2c3d4e5f6789012346" },
  "titulo": "Data Analysis with Python",
  "imagen": "gs://portafoliodeibyramirez.firebasestorage.app/certificados/python-data.png",
  "institucion": "Coursera",
  "fecha": "2024"
}
```

### Campos

| Campo | Tipo | Requerido (create) | Descripcion |
| --- | --- | --- | --- |
| `_id` | ObjectId | Auto | Expuesto como `id` (string) |
| `titulo` | string | Si | Nombre del curso o certificacion |
| `imagen` | string | Si | Ruta `gs://` de la imagen del certificado |
| `institucion` | string | No | Plataforma o entidad emisora |
| `fecha` | string | No | Ano o fecha en texto libre (ej. `"2024"`, `"Mar 2025"`) |

### Interface TypeScript (`CertificadoInterface`)

```typescript
export interface CertificadoInterface {
  id?: string;
  titulo: string;
  imagen: string;
  institucion?: string;
  fecha?: string;
}
```

### Mapeo MongoDB → API

Funcion `mapCertificado()` en `app/lib/data/certificados.ts`:

| MongoDB | API |
| --- | --- |
| `_id` | `id` |
| resto | copia directa |

### Reglas de validacion (API)

- `titulo` e `imagen` requeridos y no vacios en create.
- `institucion` y `fecha` opcionales, deben ser string si se envian.
- En update: al menos un campo editable.

---

## Interfaces de presentacion (solo UI web)

Estas interfaces **no se usan en la API** ni en la capa de datos. Son props simplificadas para componentes React.

### `ProyectosInterface`

Usada por `app/pages/Proyectos.tsx` (card con modal e imagenes).

```typescript
export interface ProyectosInterface {
  titulo: string;
  descripcion: string;
  imagenes: string[] | null;
  repositorio: string;
  tipo: "movil" | "web" | "game_dev" | "ciberseguridad" | "automatizacion";
}
```

Nota: `imagenes` aqui ya vienen convertidas a URL HTTPS (no `gs://`).

### `HerramientasInterface`

Usada por `app/pages/Herramientas.tsx` (acordeon de tecnologias).

```typescript
export interface HerramientasInterface {
  lenguajes: string[];
  frameworks: string[];
  librerias: string[];
  tipo: "movil" | "web" | "game_dev" | "ciberseguridad" | "automatizacion";
}
```

Los datos provienen del mismo `DesarrolloInterface`; el contenedor de categoria los pasa al componente.

---

## Imagenes: formato `gs://` y estructura en Storage

MongoDB almacena rutas de Firebase Storage, no URLs HTTP.

### Estructura de carpetas

```text
proyectos/{tipo}/{titulo}/{titulo}_n.ext
certificados/{titulo}/{titulo}_n.ext
```

Ejemplo:

```text
gs://portafoliodeibyramirez.firebasestorage.app/proyectos/automatizacion/Automatizacion PQR Correos Electronicos/Automatizacion PQR Correos Electronicos_1.png
```

- `{tipo}`: categoria (`movil`, `web`, `game_dev`, `automatizacion`, `ciberseguridad`).
- `{titulo}`: nombre exacto del proyecto o certificado (con espacios si los tiene).
- `{titulo}_n`: numeracion de imagenes empezando en 1.

La API genera estas rutas automaticamente al recibir archivos via `multipart/form-data`.

Conversion a URL publica (web y Flutter deben replicar esta logica):

```text
https://firebasestorage.googleapis.com/v0/b/portafoliodeibyramirez.firebasestorage.app/o/proyectos%2Fweb%2Fcaptura.png?alt=media
```

Implementacion web: `app/components/Conversion.tsx` → `convertirGSUrl()`.

---

## Relacion entre modelos

```text
DesarrolloInterface (MongoDB + API)
        │
        ├──► ProyectosInterface   (titulo, descripcion, imagenes HTTPS, repositorio, tipo)
        │
        └──► HerramientasInterface (lenguajes, frameworks, librerias, tipo)

CertificadoInterface (MongoDB + API)
        │
        └──► props de Certificado.tsx (titulo, imagen HTTPS, institucion, fecha)
```

---

## Ejemplos JSON para la API

### Crear proyecto

```json
{
  "titulo": "App de Inventario",
  "descripcion": "Gestion de stock con Flutter y Firebase.",
  "tipo": "movil",
  "imagenes": ["gs://portafoliodeibyramirez.firebasestorage.app/proyectos/movil/inventario.png"],
  "repositorio": "https://github.com/usuario/inventario",
  "lenguajes": ["Dart"],
  "frameworks": ["Flutter"],
  "librerias": ["Riverpod", "GoRouter"]
}
```

### Actualizar proyecto (parcial)

```json
{
  "titulo": "App de Inventario v2",
  "librerias": ["Riverpod", "GoRouter", "Dio"]
}
```

### Crear certificado

```json
{
  "titulo": "AWS Cloud Practitioner",
  "imagen": "gs://portafoliodeibyramirez.firebasestorage.app/certificados/aws.png",
  "institucion": "Amazon Web Services",
  "fecha": "2025"
}
```

---

## Agregar una nueva categoria tecnica

Si en el futuro agregas un nuevo valor de `tipo`:

1. Extender el union type en `DesarrolloInterface` y `TIPOS_PROYECTO`.
2. Crear seccion en `app/pages/`.
3. Filtrar en `app/page.tsx` con `filtrarProyectosPorTipo`.
4. Agregar enlace en `app/layout.tsx`.
5. Actualizar layouts en `Proyectos.tsx` y `Herramientas.tsx` si aplica.
6. Actualizar [Guia Flutter](./flutter-guia.md) y validacion en `validate.ts`.

Ver tambien: [Arquitectura — Nueva categoria](./arquitectura.md).
