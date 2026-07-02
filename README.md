# Portafolio Profesional - Deiby Ramirez

Portafolio FullStack construido con Next.js para presentar proyectos de forma profesional, escalable y preparada para nuevas lineas tecnicas.

## Tabla de contenido

- [Resumen](#resumen)
- [Stack tecnologico](#stack-tecnologico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Estructura de carpetas](#estructura-de-carpetas)
- [API interna](#api-interna)
- [Variables de entorno](#variables-de-entorno)
- [Ejecucion local](#ejecucion-local)
- [Docker](#docker)
- [Documentacion](#documentacion)
- [Roadmap](#roadmap)

## Resumen

Este repositorio implementa un portafolio web con estas caracteristicas clave:

- Organizacion por secciones tecnicas (movil, web, game dev, automatizaciones, ciberseguridad).
- Integracion con MongoDB para proyectos y certificados.
- Fetch unico de datos en la pagina principal con filtrado por categoria.
- Selector de multiples proyectos por area tecnica.
- Render moderno con Next.js App Router y componentes reutilizables.

## Stack tecnologico

| Tecnologia | Uso |
| --- | --- |
| Next.js 15 | Framework principal (App Router + API routes) |
| React 19 | Construccion de componentes UI |
| TypeScript | Tipado estatico y mantenibilidad |
| Tailwind CSS v4 | Sistema de estilos y utilidades |
| MongoDB (driver nativo) | Persistencia de datos |
| Firebase Storage | Almacenamiento de imagenes (URLs `gs://`) |
| Lucide React | Iconografia |

## Arquitectura del proyecto

### 1) Capa de datos

- Conexion centralizada en `app/lib/database.ts`.
- Funciones reutilizables en `app/lib/data/` (`getProyectos`, `getCertificados`).
- Mapeo de documentos MongoDB a interfaces TypeScript.

### 2) Capa API

- Endpoints internos en `app/api/*` que reutilizan la capa de datos.
- Respuestas JSON para consumo externo o integraciones futuras.

### 3) Capa presentacion

- Compositor en `app/page.tsx` con fetch unico y props a secciones.
- Secciones modulares en `app/pages/*`.
- Componentes interactivos en `app/components/*`.

### 4) Utilidades

- `app/lib/api.ts`: cliente HTTP interno (`safeFetchJson`).
- `app/components/Conversion.tsx`: conversion de rutas `gs://` a URL publica de Firebase.

Documentacion completa: [`docs/arquitectura.md`](docs/arquitectura.md) · Guia Flutter: [`docs/flutter-guia.md`](docs/flutter-guia.md)

## Estructura de carpetas

```text
app/
  api/
    certificados/
      route.ts
      [id]/route.ts
    proyectos/
      route.ts
      [id]/route.ts
  components/
    ContenedorProyectoCategoria.tsx
    Conversion.tsx
  lib/
    api/
      auth.ts
      responses.ts
      validate.ts
      revalidate.ts
    api.ts
    database.ts
    data/
      certificados.ts
      proyectos.ts
  models/
  pages/
    Inicio.tsx
    Arquitectura.tsx
    DesarrolloMovil.tsx
    DesarrolloWeb.tsx
    Automatizaciones.tsx
    GameDev.tsx
    Ciberseguridad.tsx
    Logros.tsx
    Proyectos.tsx
    Herramientas.tsx
  layout.tsx
  page.tsx
docs/
  api.md
  arquitectura.md
  ci-cd.md
```

## API REST

La API expone CRUD completo sobre las colecciones `proyectos` y `certificados`.

| Operacion | Autenticacion |
| --- | --- |
| Lectura (`GET`) | Publica |
| Escritura (`POST`, `PUT`, `PATCH`, `DELETE`) | Requiere `PORTFOLIO_API_KEY` |

### Endpoints principales

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/proyectos` | Listar proyectos |
| GET | `/api/proyectos/:id` | Obtener proyecto |
| POST | `/api/proyectos` | Crear proyecto |
| PUT/PATCH | `/api/proyectos/:id` | Actualizar proyecto |
| DELETE | `/api/proyectos/:id` | Eliminar proyecto |
| GET | `/api/certificados` | Listar certificados |
| GET | `/api/certificados/:id` | Obtener certificado |
| POST | `/api/certificados` | Crear certificado |
| PUT/PATCH | `/api/certificados/:id` | Actualizar certificado |
| DELETE | `/api/certificados/:id` | Eliminar certificado |

Documentacion completa con ejemplos curl y guia para app movil: [`docs/api.md`](docs/api.md)

## Variables de entorno

Crea un archivo `.env.local` con valores equivalentes a:

```env
MONGODB_URI=TU_URI_DE_MONGODB
PORTFOLIO_API_KEY=clave_secreta_para_escritura
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PORT=3000
```

> Nota: evita subir archivos `.env*` al repositorio.

## Ejecucion local

```bash
pnpm install
pnpm dev
```

Abrir en navegador: `http://localhost:3000`

Build de produccion:

```bash
pnpm build
pnpm start
```

## Docker

### Construir imagen

```bash
docker build --build-arg MONGODB_URI=TU_URI -t portafolio .
```

### Ejecutar contenedor

```bash
docker run -p 3000:3000 --env-file .env.docker portafolio
```

Ejemplo de `.env.docker`:

```env
MONGODB_URI=TU_URI_DE_MONGODB
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PORT=3000
```

## Documentacion

Indice completo: [`docs/README.md`](docs/README.md)

| Documento | Contenido |
| --- | --- |
| [`docs/README.md`](docs/README.md) | Indice y mapa de toda la documentacion |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Flujos de datos, patrones, esquema MongoDB, capas |
| [`docs/modelos.md`](docs/modelos.md) | Esquemas MongoDB, interfaces TypeScript, validacion |
| [`docs/logica.md`](docs/logica.md) | Capa de datos, CRUD, auth, manejo de errores |
| [`docs/flujos.md`](docs/flujos.md) | Diagramas: web, API, app movil, imagenes |
| [`docs/api.md`](docs/api.md) | API REST: endpoints, autenticacion, ejemplos curl |
| [`docs/flutter-guia.md`](docs/flutter-guia.md) | **Guia Flutter:** modelos Dart, servicio, Firebase |
| [`docs/ci-cd.md`](docs/ci-cd.md) | Integracion continua con GitHub Actions |

## Roadmap

- App movil para administrar proyectos y certificados via API.
- Publicar seccion de ciberseguridad con laboratorios y writeups.
- Mejorar SEO tecnico (metadata extendida, Open Graph y schema).
- Ampliar el flujo de CI/CD con despliegue automatizado en Vercel.

---

Desarrollado por **Deiby Ramirez**.
