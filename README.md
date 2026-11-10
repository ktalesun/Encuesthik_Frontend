# 🎯 Encues-Think Frontend

Sistema de gestión de encuestas empresariales construido con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Características

- ✅ **Autenticación JWT** - Login seguro con tokens
- ✅ **React Router v7** - Navegación con rutas protegidas
- ✅ **API REST integrada** - Conexión completa con backend NestJS
- ✅ **CRUD de Encuestas** - Crear, editar, eliminar y duplicar encuestas
- ✅ **Vista Pública** - Responder encuestas sin autenticación
- ✅ **Reportes y Estadísticas** - Visualización de datos con gráficos
- ✅ **Exportación** - Excel y PDF de resultados
- ✅ **Gestión de Usuarios** - Administración de permisos y roles
- ✅ **UI Moderna** - shadcn/ui components con Tailwind CSS
- ✅ **TypeScript** - Tipado completo para mejor DX

## 📦 Tecnologías

- **React 18.3** - UI Library
- **TypeScript 5.7** - Typed JavaScript
- **Vite 6.3** - Build tool & dev server
- **React Router v7** - Routing
- **Axios** - HTTP client
- **Tailwind CSS v3** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **Date-fns** - Date utilities

## 🛠️ Instalación

### Prerrequisitos

- Node.js >= 18
- pnpm >= 8 (recomendado) o npm

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/ktalesun/Encuesthik_Frontend.git
cd Encuesthik_Frontend
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001
```

4. **Iniciar el servidor de desarrollo**

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🐳 Docker

El frontend se empaqueta con un Dockerfile multi-stage: compila con Vite (`node:20-alpine`) y sirve el resultado con Nginx (`nginx:1.27-alpine`). Nginx también actúa como proxy inverso: el navegador llama a `/api/*` y Nginx lo reenvía a `http://backend:3001` usando el **nombre del servicio** dentro de la red de Docker.

### Requisitos

El compose del frontend se une a la red externa `app-network`, que crea el compose del backend (repositorio `sistema-encuestas-back`). Por eso **el backend debe estar levantado primero**:

```bash
# En el repositorio del backend
cp .env.prod.example .env.prod      # y editar las contraseñas
docker compose up -d --build
```

### Levantar el frontend

```bash
# 1. Crear el archivo de variables (NO se sube al repositorio)
cp .env.prod.example .env.prod      # BACKEND_URL=http://backend:3001

# 2. Construir la imagen y levantar el contenedor
docker compose up -d --build

# 3. Verificar
docker compose ps
```

La aplicación queda disponible en `http://localhost:3000`.

### Detener

```bash
docker compose down
```

### Integración continua

El workflow `.github/workflows/docker-build.yml` construye la imagen en cada *push* y *pull request*.

## 🔐 Autenticación

### Credenciales de Prueba

Después de ejecutar el seeder del backend:

**Administrador:**

- Email: `admin@techsolutions.com`
- Password: `Admin123!`

**Editor:**

- Email: `juan@techsolutions.com`
- Password: `Editor123!`

**Visualizador:**

- Email: `maria@innovacion.com`
- Password: `Viewer123!`

## 🌐 Rutas de la Aplicación

### Rutas Públicas

- `/login` - Inicio de sesión
- `/encuestas/public/:empresaId/:encuestaId` - Vista pública de encuesta

### Rutas Protegidas

- `/dashboard` - Panel principal
- `/encuestas/nueva` - Crear nueva encuesta
- `/encuestas/:id/editar` - Editar encuesta
- `/reportes` - Reportes y estadísticas

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Hecho con ❤️ usando React + TypeScript + Vite**
