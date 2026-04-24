# CI/CD en este portafolio

Este documento explica, con un ejemplo real del proyecto, como aplicar CI/CD en un proyecto Node/Next.js usando `pnpm`.

## Que es CI

CI significa `Integracion Continua`.

Sirve para validar automaticamente el codigo cada vez que haces un cambio. En este repositorio, la CI verifica que el proyecto:

- Instale dependencias correctamente.
- Compile sin errores con `pnpm build`.
- Pase la validacion de codigo con `pnpm lint`.

## Que es CD

CD significa `Entrega Continua` o `Despliegue Continuo`.

Sirve para llevar el proyecto a un entorno de publicacion de forma automatica o semiautomatica. Ejemplos comunes:

- Desplegar en Vercel.
- Desplegar en Netlify.
- Publicar en un servidor propio o VPS.

En este portafolio dejamos la CI lista y la CD dependera de la plataforma que uses para publicar.

## Para que se usa

- Detectar errores antes de llegar a produccion.
- Evitar subir cambios rotos al repositorio principal.
- Dar confianza al hacer merges o releases.
- Mantener una calidad minima constante en todos los proyectos.

## Que evita

- Codigo que no compila.
- Errores de sintaxis o tipado que rompen la app.
- Subir dependencias o cambios que afectan el build sin darte cuenta.
- Revisiones manuales repetitivas para problemas basicos.

## Ejemplo aplicado a este portafolio

Cada vez que alguien haga un `push` o abra un `pull request`, GitHub Actions ejecuta estas validaciones:

1. Instala dependencias con `pnpm install --frozen-lockfile`.
2. Ejecuta `pnpm lint`.
3. Ejecuta `pnpm build`.

Si una de esas etapas falla, la solicitud no se considera lista para integrarse.

## Flujo recomendado

1. Crear una rama nueva.
2. Desarrollar el cambio.
3. Probar localmente.
4. Abrir un pull request.
5. Dejar que CI valide el cambio.
6. Hacer merge solo si todo pasa.

## Como lo voy a aplicar desde ahora

En mis proyectos voy a trabajar con esta regla:

- Todo cambio importante pasa por una rama.
- Todo pull request debe ejecutar CI.
- No se mezcla codigo que no compile.
- El build y el lint son parte del proceso normal, no una revision final opcional.

## Archivo de workflow

- `.github/workflows/ci.yml`

## En resumen

CI/CD no es solo automatizacion. Es una forma de trabajar con menos errores, mas orden y mayor confianza al publicar.
