# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# VITE_API_URL se pasa como build arg para que quede bakeado en el bundle.
# Con nginx-proxy usamos /api; con puertos expuestos usa http://localhost:3001.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

# ── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# La imagen nginx procesa automáticamente los templates de esta carpeta
# con envsubst al arrancar, reemplazando ${BACKEND_URL} por la variable de entorno.
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
