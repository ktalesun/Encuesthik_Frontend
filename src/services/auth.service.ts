import apiClient from '../api/axios';
import { LoginRequest, LoginResponse } from '../types';

class AuthService {
	/**
	 * Iniciar sesión
	 */
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await apiClient.post<LoginResponse>(
			'/auth/login',
			credentials
		);

		// Guardar token y usuario en localStorage
		if (response.data.access_token) {
			localStorage.setItem('token', response.data.access_token);
			localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
		}

		return response.data;
	}

	/**
	 * Cerrar sesión
	 */
	logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('usuario');
	}

	/**
	 * Obtener token actual
	 */
	getToken(): string | null {
		return localStorage.getItem('token');
	}

	/**
	 * Obtener usuario actual
	 */
	getCurrentUser(): any | null {
		const usuario = localStorage.getItem('usuario');
		return usuario ? JSON.parse(usuario) : null;
	}

	/**
	 * Verificar si el usuario está autenticado
	 */
	isAuthenticated(): boolean {
		return !!this.getToken();
	}
}

export default new AuthService();
