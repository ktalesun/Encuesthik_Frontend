import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';

// Base URL del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Crear instancia de Axios
const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 15000, // 15 segundos
});

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Agregar token JWT si existe
		const token = localStorage.getItem('token');
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error: AxiosError<ApiError>) => {
		// Manejo de errores centralizado

		if (error.response) {
			const { status, data } = error.response;

			// Error 401: Token inválido o expirado
			if (status === 401) {
				localStorage.removeItem('token');
				localStorage.removeItem('usuario');

				// Redirigir al login solo si no estamos ya en login
				if (!window.location.pathname.includes('/login')) {
					window.location.href = '/login';
				}
			}

			// Error 403: Sin permisos
			if (status === 403) {
				console.error('Sin permisos para realizar esta acción');
			}

			// Error 404: Recurso no encontrado
			if (status === 404) {
				console.error('Recurso no encontrado');
			}

			// Error 500: Error del servidor
			if (status >= 500) {
				console.error('Error del servidor, intente más tarde');
			}

			// Retornar el error con la data del backend
			return Promise.reject({
				status,
				message: Array.isArray(data.message)
					? data.message.join(', ')
					: data.message,
				error: data.error,
			});
		}

		// Error de red (sin respuesta del servidor)
		if (error.request) {
			return Promise.reject({
				status: 0,
				message:
					'No se pudo conectar con el servidor. Verifique su conexión a internet.',
				error: 'Network Error',
			});
		}

		// Error desconocido
		return Promise.reject({
			status: 0,
			message: error.message || 'Error desconocido',
			error: 'Unknown Error',
		});
	}
);

export default apiClient;
