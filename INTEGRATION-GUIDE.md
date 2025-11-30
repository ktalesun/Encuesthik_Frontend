# 📘 Guía de Integración - Frontend con Backend

## 🎯 Arquitectura Implementada

### Estructura de Carpetas

```
src/
├── api/                    # Cliente HTTP (Axios)
├── services/              # Capa de servicios (API calls)
├── contexts/              # Estado global (Auth)
├── hooks/                 # Custom hooks (useEncuestas, useUsuarios, etc)
├── guards/                # Protección de rutas
├── types/                 # TypeScript interfaces
└── components/            # React components (UI)
```

### Flujo de Datos

```
Component → Hook → Service → API → Backend
          ↓
       Update UI
```

## 🔐 Autenticación

### 1. Login Flow

```typescript
// Usuario ingresa credenciales
LoginScreen → useAuth().login() → AuthService.login()
                                    ↓
                          POST /auth/login (backend)
                                    ↓
                       Recibe { access_token, usuario }
                                    ↓
              Guarda en localStorage + actualiza contexto
                                    ↓
                          Redirect a /dashboard
```

### 2. Token Management

El token JWT se maneja automáticamente:

```typescript
// api/axios.ts - Request Interceptor
config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
```

### 3. Protección de Rutas

```typescript
// App.tsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardScreen />
  </ProtectedRoute>
} />

// Con permiso específico
<Route path="/encuestas/nueva" element={
  <ProtectedRoute requiredPermiso="encuestas.crear">
    <SurveyEditorScreen />
  </ProtectedRoute>
} />
```

## 📊 Integración de Endpoints

### Encuestas

#### Listar Encuestas

```typescript
// Hook
const { encuestas, isLoading, error, refetch } = useEncuestas();

// Componente
{encuestas.map(encuesta => (
  <EncuestaCard key={encuesta.id_encuesta} encuesta={encuesta} />
))}
```

#### Crear Encuesta

```typescript
// SurveyEditorScreen.tsx
const handleSave = async () => {
	const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

	await encuestasService.crear({
		titulo,
		descripcion,
		fecha_inicio: fechaInicio,
		fecha_fin: fechaFin,
		empresa_id: usuario.empresa_id,
		preguntas: preguntasAPI,
	});

	navigate('/dashboard');
};
```

#### Duplicar Encuesta

```typescript
// DashboardScreen.tsx
const handleDuplicate = async (encuestaId: string) => {
	await encuestasService.duplicar(encuestaId);
	toast.success('Encuesta duplicada');
	refetch(); // Actualizar lista
};
```

#### Eliminar Encuesta

```typescript
const handleDelete = async (id: string) => {
	if (!confirm('¿Estás seguro?')) return;

	await encuestasService.eliminar(id);
	toast.success('Encuesta eliminada');
	refetch();
};
```

### Reportes

#### Obtener Estadísticas

```typescript
// ReportsScreen.tsx
const { estadisticas, isLoading } = useReportes({
  encuesta_id: selectedEncuesta
});

// Renderizar gráficos con recharts
<PieChart data={pregunta.respuestas} />
```

#### Exportar a Excel

```typescript
const handleExportExcel = async () => {
	const blob = await reportesService.exportarExcel({
		encuesta_id: selectedEncuesta,
	});

	reportesService.descargarArchivo(blob, `reporte_${fecha}.xlsx`);
	toast.success('Exportado exitosamente');
};
```

### Vista Pública (Sin Auth)

```typescript
// PublicSurveyScreen.tsx
const { empresaId, encuestaId } = useParams();

// Obtener encuesta sin token
const encuesta = await encuestasService.obtenerPublica(empresaId, encuestaId);

// Enviar respuesta sin token
await respuestasService.enviar({
	encuesta_id: encuestaId,
	respuestas: respuestasArray,
	terceros: { nombre, email },
});
```

## 🎨 Componentes UI

### Patrón de Uso

```typescript
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { toast } from 'sonner';

// En el componente
const handleAction = async () => {
  try {
    await service.action();
    toast.success('Éxito');
  } catch (error: any) {
    toast.error(error.message);
  }
};

return (
  <Card>
    <Button onClick={handleAction}>Acción</Button>
  </Card>
);
```

### Componentes Disponibles

- **Forms**: Input, Textarea, Select, Switch, RadioGroup, Checkbox
- **Layout**: Card, Separator, Tabs, Table
- **Feedback**: Alert, Toast (Sonner), Badge, Progress
- **Navigation**: Button, DropdownMenu
- **Data Display**: Table, Charts (Recharts)

## 🔄 Custom Hooks Principales

### useEncuestas

```typescript
const { encuestas, isLoading, error, refetch } = useEncuestas();

// Refetch después de cambios
refetch();
```

### useEncuesta (single)

```typescript
const { id } = useParams();
const { encuesta, isLoading, error } = useEncuesta(id);

// Para editar
useEffect(() => {
	if (encuesta) {
		setTitulo(encuesta.titulo);
		// ... cargar datos
	}
}, [encuesta]);
```

### useReportes

```typescript
const [filtros, setFiltros] = useState<FiltrosReporte>({
	encuesta_id: '',
	fecha_inicio: '2025-01-01',
});

const { estadisticas, isLoading } = useReportes(filtros);
```

## 🚨 Manejo de Errores

### Centralizado en Axios

```typescript
// api/axios.ts - Response Interceptor
if (status === 401) {
	localStorage.clear();
	window.location.href = '/login';
}

if (status === 403) {
	toast.error('Sin permisos');
}

if (status >= 500) {
	toast.error('Error del servidor');
}
```

### En Componentes

```typescript
try {
	setIsLoading(true);
	await service.action();
	toast.success('Éxito');
} catch (error: any) {
	toast.error(error.message || 'Error desconocido');
} finally {
	setIsLoading(false);
}
```

## 📝 Tipos TypeScript

### Interfaces Principales

```typescript
// types/index.ts

interface Encuesta {
	id_encuesta: string;
	titulo: string;
	descripcion: string;
	fecha_inicio: string;
	fecha_fin: string;
	estado: 'borrador' | 'publicada' | 'inactiva' | 'archivada';
	url_publica: string;
	empresa_id: string;
	preguntas?: Pregunta[];
}

interface Pregunta {
	id_pregunta: string;
	texto: string;
	tipo: 'texto' | 'opcion_unica' | 'si_no' | 'numerica' | 'estrellas';
	opciones?: string[];
	rango?: { min: number; max: number };
	requerida: boolean;
	orden: number;
}
```

## 🎯 Mejores Prácticas Implementadas

1. **Separación de Responsabilidades**
   - Components: Solo UI y eventos
   - Hooks: Lógica de fetch y estado
   - Services: Llamadas API puras

2. **Manejo de Loading States**

   ```typescript
   {isLoading ? <Loader /> : <Content />}
   ```

3. **Optimistic Updates**

   ```typescript
   await service.delete(id);
   refetch(); // Actualizar inmediatamente
   ```

4. **Toast Notifications**

   ```typescript
   toast.success('Éxito');
   toast.error('Error');
   ```

5. **TypeScript Estricto**
   - Todos los props tipados
   - Interfaces para API responses
   - No any (excepto en catches)

## 🔧 Debugging

### Ver Network Requests

```typescript
// api/axios.ts
console.log('Request:', config);
console.log('Response:', response);
```

### Ver Estado de Auth

```typescript
// Cualquier componente
const { usuario, isAuthenticated } = useAuth();
console.log({ usuario, isAuthenticated });
```

### Ver Errores de API

Los errores se muestran automáticamente en:

1. Toast notifications (UI)
2. Console (desarrollo)
3. Response interceptor logs

## 📌 Checklist de Integración

- [x] ✅ Axios configurado con base URL
- [x] ✅ Interceptores de request/response
- [x] ✅ AuthContext con login/logout
- [x] ✅ Servicios para todos los endpoints
- [x] ✅ Custom hooks para fetch de datos
- [x] ✅ Rutas protegidas con guards
- [x] ✅ Manejo de errores centralizado
- [x] ✅ Toast notifications
- [x] ✅ Loading states
- [x] ✅ TypeScript types
- [x] ✅ Vista pública de encuestas
- [x] ✅ CRUD completo de encuestas
- [x] ✅ Reportes con exportación

## 🚀 Próximos Pasos

1. **Conectar Backend**
   - Asegurarse que el backend esté corriendo en `http://localhost:3001`
   - Ejecutar seeders para datos de prueba

2. **Probar Flujo Completo**
   - Login → Dashboard → Crear Encuesta → Ver Reportes

3. **Validar Permisos**
   - Probar con diferentes roles (admin, editor, viewer)

4. **Testing**
   - Probar vista pública de encuestas
   - Validar exportación de reportes

---

**Integración completada ✅**

Toda la aplicación está lista para conectarse con el backend NestJS.
