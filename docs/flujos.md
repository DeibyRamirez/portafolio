# Flujos de datos

Diagramas y secuencias que explican como se mueve la informacion entre MongoDB, el sitio web, la API REST, Firebase Storage y la app movil.

---

## 1. Flujo general del sistema

```mermaid
flowchart TB
    subgraph Persistencia
        MDB[(MongoDB Atlas\nDB: Portafolio)]
        FB[(Firebase Storage\nimagenes gs://)]
    end

    subgraph Backend Next.js
        DATA[app/lib/data/*]
        API[app/api/*]
        PAGE[app/page.tsx]
    end

    subgraph Clientes
        WEB[Sitio web\nnavegador]
        FLUTTER[App Flutter]
    end

    MDB <-->|driver nativo| DATA
    DATA --> PAGE
    DATA --> API
    PAGE --> WEB
    API --> FLUTTER
    FB -.->|rutas gs:// en documentos| MDB
    FB -.->|URLs publicas| WEB
    FB -.->|upload + URLs| FLUTTER
```

---

## 2. Flujo del sitio web (SSR)

El sitio **no consume la API HTTP**. Lee MongoDB directamente en el servidor.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant N as Next.js Server
    participant D as app/lib/data
    participant M as MongoDB

    U->>N: GET /
    par Consultas paralelas
        N->>D: getProyectos()
        D->>M: find({}) proyectos
        M-->>D: documentos[]
        N->>D: getCertificados()
        D->>M: find({}) certificados
        M-->>D: documentos[]
    end
    D-->>N: proyectos[], certificados[]
    N->>N: filtrarProyectosPorTipo por seccion
    N->>N: convertirGSUrl en ContenedorProyectoCategoria
    N-->>U: HTML renderizado
```

### Pasos detallados

1. **`app/page.tsx`** ejecuta `Promise.all([getProyectos(), getCertificados()])`.
2. Cada seccion recibe solo los proyectos de su `tipo`:
   - `DesarrolloMovil` ← `"movil"`
   - `DesarrolloWeb` ← `"web"`
   - etc.
3. **`ContenedorProyectoCategoria`** gestiona tabs si hay 2+ proyectos del mismo tipo.
4. **`convertirGSUrl()`** transforma `gs://` → HTTPS antes de mostrar imagenes.
5. **`Logros`** recibe `certificados[]` y convierte cada `imagen`.

---

## 3. Flujo de lectura via API (app movil / externo)

```mermaid
sequenceDiagram
    participant F as App Flutter
    participant A as GET /api/proyectos
    participant D as getProyectos()
    participant M as MongoDB

    F->>A: GET /api/proyectos
    A->>D: getProyectos()
    D->>M: find({})
    M-->>D: documentos[]
    D-->>D: map _id → id
    D-->>A: DesarrolloInterface[]
    A-->>F: JSON 200
    F->>F: convertirGSUrl para mostrar imagenes
    F->>F: filtrar por tipo en cliente
```

### Puntos importantes

- **Sin autenticacion** en GET.
- La API retorna **todos** los proyectos; el filtro por `tipo` se hace en el cliente.
- No hay paginacion — el volumen es bajo (portafolio personal).
- Las imagenes vienen como `gs://`; Flutter debe convertirlas para `Image.network()`.

---

## 4. Flujo de escritura via API (crear proyecto)

```mermaid
sequenceDiagram
    participant F as App Flutter
    participant FB as Firebase Storage
    participant A as POST /api/proyectos
    participant V as validate.ts
    participant D as createProyecto()
    participant M as MongoDB
    participant W as Sitio web

    F->>FB: Subir imagen (SDK Firebase)
    FB-->>F: gs://bucket/path/imagen.png
    F->>A: POST + Bearer API_KEY + JSON body
    A->>A: verificarApiKey()
    A->>V: validarProyectoInput(body)
    V-->>A: ok / error 400
    A->>D: createProyecto(data)
    D->>M: insertOne()
    M-->>D: insertedId
    D-->>A: proyecto con id
    A->>A: revalidatePath("/")
    A-->>F: JSON 201
    Note over W: Proxima visita a / muestra el nuevo proyecto
```

### Orden obligatorio para imagenes

1. Subir archivo a Firebase Storage.
2. Obtener ruta `gs://...`.
3. Incluir esa ruta en `imagenes[]` o `imagen` del body JSON.
4. La API **no acepta** multipart/form-data ni binarios.

---

## 5. Flujo de actualizacion y eliminacion

### Actualizar (PATCH)

```text
App → PATCH /api/proyectos/:id + API_KEY + campos parciales
    → verificarApiKey
    → validarProyectoUpdateInput
    → updateProyecto (solo $set de campos enviados)
    → revalidatePath("/")
    → 200 + proyecto actualizado
```

### Eliminar (DELETE)

```text
App → DELETE /api/proyectos/:id + API_KEY
    → verificarApiKey
    → deleteProyecto
    → revalidatePath("/")
    → 200 { message: "Proyecto eliminado correctamente" }
```

> La API **no elimina** archivos de Firebase Storage. Si borras un proyecto, las imagenes pueden quedar huerfanas en Firebase (limpieza manual opcional).

---

## 6. Flujo de imagenes Firebase

```text
Almacenamiento (MongoDB)          Visualizacion (clientes)
─────────────────────────         ─────────────────────────
gs://bucket/proyectos/web/a.png
        │
        ▼
convertirGSUrl(gsurl)
        │
        ▼
https://firebasestorage.googleapis.com/v0/b/bucket/o/proyectos%2Fweb%2Fa.png?alt=media
        │
        ├──► next/image (sitio web)
        └──► Image.network (Flutter)
```

**Bucket del proyecto:** `portafoliodeibyramirez.firebasestorage.app`

**Logica de conversion** (identica en web y Flutter):

1. Quitar prefijo `gs://portafoliodeibyramirez.firebasestorage.app/`.
2. Reemplazar `/` por `%2F` y espacios por `%20`.
3. Armar URL con template de Firebase Storage REST API + `?alt=media`.

---

## 7. Flujo multi-proyecto por seccion

Cuando una categoria tiene varios proyectos (ej. 3 proyectos `tipo: "web"`):

```text
getProyectos()
    → filtrarProyectosPorTipo(..., "web")  → [proyA, proyB, proyC]
    → DesarrolloWeb recibe el array
    → ContenedorProyectoCategoria
           │
           ├── Tab "proyA" | Tab "proyB" | Tab "proyC"
           │
           └── Context { proyecto activo, imagenes HTTPS }
                    │
                    ├── Proyectos (card + modal)
                    └── Herramientas (acordeon)
```

Al cambiar tab, solo cambia el estado client-side; **no hay nuevo fetch**.

---

## 8. Flujo de errores en la API

```mermaid
flowchart TD
    REQ[Request entrante] --> METHOD{Metodo HTTP}
    METHOD -->|GET| READ[get* / get*ById]
    METHOD -->|POST PUT PATCH DELETE| AUTH{verificarApiKey}
    AUTH -->|fail| E401[401 Unauthorized]
    AUTH -->|ok| BODY[Parse JSON body]
    BODY --> VALID{validar*Input}
    VALID -->|fail| E400[400 Bad Request]
    VALID -->|ok| CRUD[create / update / delete]
    READ --> FOUND{existe?}
    FOUND -->|no| E404[404 Not Found]
    FOUND -->|si| OK200[200 OK]
    CRUD --> DBOK{exito DB?}
    DBOK -->|no| E500[500 Internal Error]
    DBOK -->|si| OK[200 / 201 OK]
```

---

## 9. Flujo CI/CD (build sin MongoDB)

```text
GitHub Actions
    → pnpm install
    → pnpm lint
    → pnpm build
         │
         └── page.tsx llama getProyectos() / getCertificados()
              │
              └── MONGODB_URI no configurada en CI
                   → catch error → retorna []
                   → build exitoso con secciones vacias
```

Ver detalle en [CI/CD](./ci-cd.md).

---

## 10. Comparativa: web vs API vs Flutter

| Aspecto | Sitio web | API REST | App Flutter |
| --- | --- | --- | --- |
| Acceso a datos | Directo `lib/data` | HTTP JSON | HTTP JSON |
| Lectura | SSR en servidor | GET publico | GET publico |
| Escritura | No (solo via API) | POST/PUT/PATCH/DELETE + key | Igual que API |
| Imagenes | `convertirGSUrl` en React | Retorna `gs://` | Debe convertir en Dart |
| Filtro por tipo | `page.tsx` en servidor | Cliente filtra | Cliente filtra |
| Auth | N/A | API key en escritura | API key en escritura |

---

## Documentos relacionados

- [Modelos](./modelos.md) — campos y tipos
- [Logica](./logica.md) — funciones y validacion
- [API REST](./api.md) — contrato HTTP
- [Guia Flutter](./flutter-guia.md) — implementacion en Dart
