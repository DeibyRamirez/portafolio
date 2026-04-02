# Portafolio Profesional - Deiby Ramirez

Portafolio FullStack construido con Next.js para presentar proyectos de forma profesional, escalable y preparada para nuevas lineas tecnicas.

## Tabla de contenido

- [Resumen](#resumen)
- [Novedades del frontend](#novedades-del-frontend)
- [Stack tecnologico](#stack-tecnologico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Estructura de carpetas](#estructura-de-carpetas)
- [API interna](#api-interna)
- [Variables de entorno](#variables-de-entorno)
- [Ejecucion local](#ejecucion-local)
- [Docker](#docker)
- [Roadmap](#roadmap)

## Resumen

Este repositorio implementa un portafolio web con estas caracteristicas clave:

- Organizacion por secciones tecnicas (movil, web, game dev y ciberseguridad).
- Integracion con MongoDB para proyectos y certificados.
- Consumo de datos en tiempo real mediante API routes internas.
- Render moderno con Next.js App Router y componentes reutilizables.

## Novedades del frontend

Se aplico una mejora de estructura visual y de informacion para que el portafolio se vea mas profesional y sea facil de escalar.

### Cambios principales

- Nueva narrativa de pagina: `Inicio -> Arquitectura -> Areas tecnicas -> Logros`.
- Seccion nueva **Arquitectura** para explicar la vision y escalabilidad del repositorio.
- Seccion nueva **Ciberseguridad** lista para incorporar labs, writeups y proyectos.
- Header optimizado:
  - Desktop con menu compacto y dropdown `Secciones` al pasar el mouse.
  - Movil con menu reducido y lista desplegable.
- Estilos globales refinados con variables CSS de marca y contenedor visual reutilizable (`section-shell`).

### Archivos actualizados

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/components/Inicio.tsx`
- `app/components/DesarrolloMovil.tsx`
- `app/components/DesarrolloWeb.tsx`
- `app/components/GameDev.tsx`
- `app/components/Logros.tsx`
- `app/components/Arquitectura.tsx`
- `app/components/Ciberseguridad.tsx`

## Stack tecnologico

| Tecnologia | Uso |
| --- | --- |
| Next.js 15 | Framework principal (App Router + API routes) |
| React 19 | Construccion de componentes UI |
| TypeScript | Tipado estatico y mantenibilidad |
| Tailwind CSS v4 | Sistema de estilos y utilidades |
| MongoDB + Mongoose | Persistencia de datos |
| Firebase Storage | Almacenamiento de imagenes/recursos |
| Lucide React | Iconografia |

## Arquitectura del proyecto

### 1) Capa de datos

- Conexion centralizada a MongoDB desde `app/lib/database.ts`.
- Modelos consultados por API routes internas.

### 2) Capa API

- Endpoints internos en `app/api/*`.
- Respuestas JSON consumidas por el frontend.

### 3) Capa presentacion

- Componentes modulares en `app/components/*`.
- Secciones desacopladas para crecimiento por categoria.
- Integracion de recursos multimedia y tarjetas de proyecto.

### 4) Utilidades

- `app/lib/api.ts`: utilidades para construir URL base y consumir API de forma segura.
- `app/components/Conversion.tsx`: conversion de rutas `gs://` a URL publica de Firebase.

## Estructura de carpetas

```text
app/
  api/
    certificados/route.ts
    proyectos/route.ts
  components/
    Arquitectura.tsx
    Ciberseguridad.tsx
    DesarrolloMovil.tsx
    DesarrolloWeb.tsx
    GameDev.tsx
    Herramientas.tsx
    Inicio.tsx
    Logros.tsx
    Proyectos.tsx
  lib/
    api.ts
    database.ts
  globals.css
  layout.tsx
  page.tsx
public/
README.md
```

## API interna

### `GET /api/proyectos`

Retorna el listado de proyectos (movil, web, game dev, etc.) para pintar cada seccion del portafolio.

### `GET /api/certificados`

Retorna certificados y logros para la seccion de validacion profesional.

## Variables de entorno

Crea un archivo `.env.local` con valores equivalentes a:

```env
MONGODB_URI=TU_URI_DE_MONGODB
NEXT_PUBLIC_API_URL=http://localhost:3000/api
PORT=3000
```

> Nota: evita subir archivos `.env*` al repositorio.

## Ejecucion local

```bash
npm install
npm run dev
```

Abrir en navegador: `http://localhost:3000`

Build de produccion:

```bash
npm run build
npm start
```

## Docker

### Construir imagen

```bash
docker build -t portafolio .
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

## Roadmap

- Agregar multiples proyectos por categoria con filtros.
- Publicar seccion de ciberseguridad con laboratorios y writeups.
- Mejorar SEO tecnico (metadata extendida, Open Graph y schema).
- Incorporar CI para calidad (`build`, `lint`, `type-check`).

---

Desarrollado por **Deiby Ramirez**.
