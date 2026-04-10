# Etapa 1: Instalación de dependencias
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalamos pnpm globalmente
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Etapa 2: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm

# 1. Definimos que aceptaremos un argumento llamado MONGO_URI
ARG MONGO_URI

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 2. Convertimos ese argumento en una variable de entorno para el build
ENV MONGO_URI=$MONGO_URI
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build
# Etapa 3: Ejecución (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Seguridad: Creamos un usuario sin privilegios
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiamos solo lo estrictamente necesario para correr la app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]