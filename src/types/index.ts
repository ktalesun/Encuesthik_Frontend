// ==========================================
// TIPOS BASE
// ==========================================

export interface Empresa {
	id_empresa: string;
	nombre: string;
	nit: string;
	fecha_inicio: string;
	fecha_expiracion: string;
	estado: 'activa' | 'inactiva';
	created_at: string;
	updated_at: string;
}

export interface Rol {
	id_rol: string;
	nombre: string;
	permisos: string[];
	created_at: string;
	updated_at: string;
}

export interface Usuario {
	id_usuario: string;
	nombre: string;
	email: string;
	estado: 'activo' | 'inactivo';
	empresa_id: string;
	rol_id: string;
	empresa?: Empresa;
	rol?: Rol;
	created_at: string;
	updated_at: string;
}

export type TipoPregunta =
	| 'texto'
	| 'opcion_unica'
	| 'si_no'
	| 'numerica'
	| 'estrellas';

export interface Pregunta {
	id_pregunta: string;
	texto: string;
	tipo: TipoPregunta;
	opciones?: string[];
	rango?: { min: number; max: number };
	requerida: boolean;
	orden: number;
	encuesta_id: string;
	created_at: string;
	updated_at: string;
}

export type EstadoEncuesta =
	| 'borrador'
	| 'publicada'
	| 'inactiva'
	| 'archivada';

export interface Encuesta {
	id_encuesta: string;
	titulo: string;
	descripcion: string;
	fecha_inicio: string;
	fecha_fin: string;
	estado: EstadoEncuesta;
	url_publica: string;
	empresa_id: string;
	empresa?: Empresa;
	preguntas?: Pregunta[];
	created_at: string;
	updated_at: string;
}

export interface RespuestaItem {
	pregunta_id: string;
	respuesta: string | number | boolean;
}

export interface DatosTercero {
	nombre?: string;
	email?: string;
	telefono?: string;
	[key: string]: any;
}

export interface Respuesta {
	id_respuesta: string;
	encuesta_id: string;
	respuestas_json: RespuestaItem[];
	datos_tercero?: DatosTercero;
	created_at: string;
}

// ==========================================
// TIPOS DE AUTENTICACIÓN
// ==========================================

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	usuario: Usuario;
}

export interface AuthState {
	token: string | null;
	usuario: Usuario | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

// ==========================================
// TIPOS DE REPORTES
// ==========================================

export interface EstadisticaRespuesta {
	valor: string | number;
	frecuencia: number;
	porcentaje: number;
}

export interface EstadisticaPregunta {
	pregunta_id: string;
	pregunta_texto: string;
	tipo: TipoPregunta;
	total_respuestas: number;
	respuestas: EstadisticaRespuesta[];
}

export interface EstadisticasEncuesta {
	encuesta_id: string;
	titulo: string;
	total_respuestas: number;
	fecha_inicio: string;
	fecha_fin: string;
	preguntas: EstadisticaPregunta[];
}

export interface FiltrosReporte {
	empresa_id?: string;
	encuesta_id?: string;
	fecha_inicio?: string;
	fecha_fin?: string;
}

// ==========================================
// TIPOS DE REQUESTS
// ==========================================

export interface CreateEmpresaRequest {
	nombre: string;
	nit: string;
	fecha_inicio: string;
	fecha_expiracion: string;
	estado: 'activa' | 'inactiva';
}

export interface UpdateEmpresaRequest {
	nombre?: string;
	nit?: string;
	fecha_inicio?: string;
	fecha_expiracion?: string;
	estado?: 'activa' | 'inactiva';
}

export interface CreateUsuarioRequest {
	nombre: string;
	email: string;
	password: string;
	empresa_id: string;
	rol_id: string;
}

export interface UpdateUsuarioRequest {
	nombre?: string;
	email?: string;
	password?: string;
	rol_id?: string;
}

export interface CreateRolRequest {
	nombre: string;
	permisos: string[];
}

export interface UpdateRolRequest {
	nombre?: string;
	permisos?: string[];
}

export interface CreateEncuestaRequest {
	titulo: string;
	descripcion: string;
	fecha_inicio: string;
	fecha_fin: string;
	empresa_id: string;
	preguntas: Omit<
		Pregunta,
		'id_pregunta' | 'encuesta_id' | 'created_at' | 'updated_at'
	>[];
}

export interface UpdateEncuestaRequest {
	titulo?: string;
	descripcion?: string;
	fecha_inicio?: string;
	fecha_fin?: string;
	estado?: EstadoEncuesta;
}

export interface CreateRespuestaRequest {
	encuesta_id: string;
	respuestas: RespuestaItem[];
	terceros?: DatosTercero;
}

// ==========================================
// TIPOS DE ERROR
// ==========================================

export interface ApiError {
	statusCode: number;
	message: string | string[];
	error: string;
}

// ==========================================
// TIPOS DE UTILIDADES
// ==========================================

export interface PaginationParams {
	page?: number;
	limit?: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}
