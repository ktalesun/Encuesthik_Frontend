import apiClient from '../api/axios';
import { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario } from '../types';

class UsuariosService {
	/**
	 * Listar todos los usuarios
	 */
	async listar(): Promise<Usuario[]> {
		const response = await apiClient.get<Usuario[]>('/usuarios');
		return response.data;
	}

	/**
	 * Obtener usuario por ID
	 */
	async obtenerPorId(id: string): Promise<Usuario> {
		const response = await apiClient.get<Usuario>(`/usuarios/${id}`);
		return response.data;
	}

	/**
	 * Crear nuevo usuario
	 */
	async crear(data: CreateUsuarioRequest): Promise<Usuario> {
		const response = await apiClient.post<Usuario>('/usuarios', data);
		return response.data;
	}

	/**
	 * Actualizar usuario
	 */
	async actualizar(id: string, data: UpdateUsuarioRequest): Promise<Usuario> {
		const response = await apiClient.put<Usuario>(`/usuarios/${id}`, data);
		return response.data;
	}

	/**
	 * Actualizar estado de usuario
	 */
	async actualizarEstado(
		id: string,
		estado: 'activo' | 'inactivo'
	): Promise<Usuario> {
		const response = await apiClient.patch<Usuario>(`/usuarios/${id}/estado`, {
			estado,
		});
		return response.data;
	}

	/**
	 * Eliminar usuario
	 */
	async eliminar(id: string): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(
			`/usuarios/${id}`
		);
		return response.data;
	}
}

export default new UsuariosService();
