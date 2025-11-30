# 📊 Encuesthik Frontend

Aplicación web para gestión de encuestas, construida con React, TypeScript, Vite y Tailwind CSS.

## 🏗️ Estructura del Proyecto Recomendada

```
Encuesthik_Frontend/
├── public/                    # Archivos estáticos
│   └── assets/               # Imágenes, iconos, etc.
├── src/
│   ├── components/           # Componentes de React
│   │   ├── ui/              # Componentes UI reutilizables (shadcn/ui)
│   │   ├── layout/          # Componentes de layout (Header, Footer, Sidebar)
│   │   ├── features/        # Componentes por característica
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── surveys/     # Lista, Editor de encuestas
│   │   │   └── reports/     # Reportes y estadísticas
│   │   └── shared/          # Componentes compartidos
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilidades y helpers
│   │   └── utils.ts        # Funciones de utilidad
│   ├── types/              # Tipos TypeScript
│   ├── services/           # Servicios API
│   ├── contexts/           # Context API (para estado global)
│   ├── routes/             # Configuración de rutas (si usas React Router)
│   ├── styles/             # Estilos globales
│   │   └── globals.css
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Punto de entrada
│   └── vite-env.d.ts       # Tipos para Vite
├── .eslintrc.cjs           # Configuración ESLint
├── .prettierrc             # Configuración Prettier
├── .gitignore              # Archivos ignorados por Git
├── index.html              # HTML principal
├── package.json            # Dependencias
├── postcss.config.js       # Configuración PostCSS
├── tailwind.config.ts      # Configuración Tailwind
├── tsconfig.json           # Configuración TypeScript
├── tsconfig.node.json      # Configuración TypeScript para Vite
└── vite.config.ts          # Configuración Vite
```

## 🚀 Próximos Pasos Recomendados

### 1. Instalar dependencias faltantes
```bash
pnpm install
```

### 2. Reorganizar componentes
Mover los componentes de pantalla a su estructura recomendada:
- `LoginScreen.tsx` → `src/components/features/auth/LoginScreen.tsx`
- `DashboardScreen.tsx` → `src/components/features/dashboard/DashboardScreen.tsx`
- `SurveyEditorScreen.tsx` → `src/components/features/surveys/SurveyEditorScreen.tsx`
- `ReportsScreen.tsx` → `src/components/features/reports/ReportsScreen.tsx`

### 3. Agregar React Router (recomendado)
```bash
pnpm add react-router-dom
pnpm add -D @types/react-router-dom
```

### 4. Agregar gestión de estado (opcional)
Opciones recomendadas:
- **Zustand** (simple y ligero): `pnpm add zustand`
- **React Query** (para datos del servidor): `pnpm add @tanstack/react-query`
- **Jotai** (atoms): `pnpm add jotai`

### 5. Agregar validación de formularios
Ya tienes `react-hook-form`, puedes agregar:
```bash
pnpm add zod @hookform/resolvers
```

### 6. Variables de entorno
Crear archivo `.env` para configuración:
```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Encuesthik
```

## 📝 Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye para producción
- `pnpm lint` - Ejecuta ESLint
- `pnpm format` - Formatea código con Prettier
- `pnpm preview` - Vista previa de la build de producción

## 🎨 Tailwind CSS

El proyecto usa Tailwind CSS v4 con configuración personalizada. Los estilos están en:
- `src/index.css` - Estilos base generados por Tailwind
- `tailwind.config.ts` - Configuración de tema

## 🔧 Tecnologías

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI basados en Radix UI
- **React Hook Form** - Manejo de formularios
- **Recharts** - Gráficos y visualizaciones

## 📦 Estructura de Carpetas Detallada

### `/src/components/`
Componentes organizados por propósito:

**ui/** - Componentes de diseño reutilizables (botones, inputs, cards, etc.)  
**layout/** - Componentes de estructura (Header, Sidebar, Footer)  
**features/** - Componentes agrupados por funcionalidad  
**shared/** - Componentes compartidos entre features

### `/src/hooks/`
Custom hooks para lógica reutilizable:
- `useAuth.ts` - Autenticación
- `useSurveys.ts` - Gestión de encuestas
- `useLocalStorage.ts` - Persistencia local

### `/src/services/`
Servicios para comunicación con API:
- `api.ts` - Cliente HTTP base
- `authService.ts` - Endpoints de autenticación
- `surveyService.ts` - Endpoints de encuestas

### `/src/types/`
Definiciones de tipos TypeScript:
- `user.ts` - Tipos de usuario
- `survey.ts` - Tipos de encuesta
- `api.ts` - Tipos de respuestas API

## 🔄 Mejoras Pendientes

1. ✅ Configuración TypeScript
2. ✅ Configuración ESLint y Prettier
3. ✅ Configuración Tailwind CSS
4. ⏳ Implementar React Router
5. ⏳ Reorganizar estructura de carpetas
6. ⏳ Agregar gestión de estado global
7. ⏳ Configurar variables de entorno
8. ⏳ Agregar tests (Vitest + Testing Library)
9. ⏳ Configurar CI/CD

## 📚 Recursos

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Vite Docs](https://vite.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
