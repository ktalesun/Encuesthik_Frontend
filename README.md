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
git clone https://github.com/Camilodev61/Encuesthik_Fronted.git
cd Encuesthik_Fronted
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
