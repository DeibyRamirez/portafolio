# Documentacion del Portafolio

Indice central de toda la documentacion tecnica del proyecto. Usa este archivo como punto de partida para entender el sistema, integrar clientes externos o continuar el desarrollo.

## Mapa de documentos

| Documento | Para quien | Contenido |
| --- | --- | --- |
| [Arquitectura](./arquitectura.md) | Desarrolladores del portafolio web | Vision general, stack, capas, patrones, seguridad |
| [Modelos](./modelos.md) | Backend y clientes (Flutter, etc.) | Esquemas MongoDB, interfaces TypeScript, reglas de campos |
| [Logica](./logica.md) | Backend | Capa de datos, validacion, autenticacion, CRUD |
| [Flujos](./flujos.md) | Todos | Diagramas y secuencias: web, API, app movil, imagenes |
| [API REST](./api.md) | Integradores / Postman | Endpoints, auth, ejemplos curl, codigos de error |
| [Guia Flutter](./flutter-guia.md) | Proyecto app movil | Integracion completa con Dart: modelos, servicio, ejemplos |
| [CI/CD](./ci-cd.md) | DevOps / mantenimiento | GitHub Actions, lint, build |

## Vision rapida del sistema

```text
                    ┌─────────────────────┐
                    │   MongoDB Atlas     │
                    │  DB: Portafolio     │
                    │  - proyectos        │
                    │  - certificados     │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
     app/lib/data/*     app/page.tsx      app/api/*
     (capa de datos)    (sitio web SSR)   (API REST)
              │                │                │
              └────────────────┴────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Firebase Storage   │
                    │  (imagenes gs://)   │
                    └─────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   App Flutter       │
                    │   (admin + lectura) │
                    └─────────────────────┘
```

## Colecciones principales

| Coleccion | Proposito | CRUD via API |
| --- | --- | --- |
| `proyectos` | Proyectos por categoria tecnica | Si |
| `certificados` | Certificaciones y logros | Si |

## Rutas de lectura vs escritura

| Operacion | Autenticacion | Uso tipico |
| --- | --- | --- |
| `GET` | Publica | Sitio web, app movil (mostrar contenido) |
| `POST`, `PUT`, `PATCH`, `DELETE` | `PORTFOLIO_API_KEY` | App movil admin, scripts internos |

## Por donde empezar

### Si vas a trabajar en el portafolio web (Next.js)

1. [Arquitectura](./arquitectura.md) — entender capas y patrones.
2. [Modelos](./modelos.md) — conocer la forma de los datos.
3. [Flujos](./flujos.md) — ver como llegan los datos a cada seccion.

### Si vas a consumir la API desde Flutter

1. **[Guia Flutter](./flutter-guia.md)** — documento principal para tu proyecto movil.
2. [API REST](./api.md) — referencia de endpoints y errores.
3. [Modelos](./modelos.md) — campos, tipos y reglas de validacion.

### Si vas a modificar el backend

1. [Logica](./logica.md) — funciones de datos, validacion y auth.
2. [API REST](./api.md) — contrato HTTP expuesto.
3. [CI/CD](./ci-cd.md) — verificar que lint y build pasen antes del merge.

## Variables de entorno

| Variable | Requerida | Descripcion |
| --- | --- | --- |
| `MONGODB_URI` | Si (produccion) | URI de MongoDB Atlas |
| `PORTFOLIO_API_KEY` | Si (escritura API) | Clave para POST/PUT/PATCH/DELETE |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Si (subida imagenes) | JSON del service account de Firebase |
| `FIREBASE_PROJECT_ID` | Alt. Firebase | Parte de credenciales separadas |
| `FIREBASE_CLIENT_EMAIL` | Alt. Firebase | Email del service account |
| `FIREBASE_PRIVATE_KEY` | Alt. Firebase | Clave privada del service account |
| `NEXT_PUBLIC_API_URL` | Opcional | Base URL interna del cliente HTTP |
| `PORT` | Opcional | Puerto local (default 3000) |

Referencia: `.env.example` en la raiz del repositorio.

## Estructura de codigo relevante

```text
app/
  api/                  # Route Handlers REST
  lib/
    api/                # Auth, validacion, respuestas
    data/               # CRUD MongoDB
    database.ts         # Conexion singleton
  models/               # Interfaces TypeScript
  pages/                # Secciones del sitio (no son rutas Next.js)
  components/           # UI reutilizable
docs/                   # Esta carpeta
```

## Convenciones del proyecto

- **Idioma del codigo:** nombres en espanol (`getProyectos`, `validarProyectoInput`).
- **Base de datos:** nombre fijo `Portafolio`, driver nativo de MongoDB (sin Mongoose).
- **Imagenes:** rutas `gs://` en MongoDB; conversion a HTTPS en el cliente que las muestra.
- **Tipado:** TypeScript estricto; interfaces en `app/models/`.
- **Pagina principal:** un solo fetch paralelo de proyectos y certificados (`app/page.tsx`).

## Mantenimiento de la documentacion

Actualiza estos documentos cuando:

- Agregues un campo a un modelo → [Modelos](./modelos.md) + [API REST](./api.md) + [Guia Flutter](./flutter-guia.md).
- Cambies un endpoint → [API REST](./api.md) + [Logica](./logica.md) + [Guia Flutter](./flutter-guia.md).
- Modifiques el flujo de datos del sitio → [Flujos](./flujos.md) + [Arquitectura](./arquitectura.md).
- Agregues una categoria tecnica → [Modelos](./modelos.md) + [Arquitectura](./arquitectura.md).
