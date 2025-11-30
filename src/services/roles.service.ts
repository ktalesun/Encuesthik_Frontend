import apiClient from '../api/axios';
import { CreateRolRequest, Rol, UpdateRolRequest } from '../types';

class RolesService {
	/**
	 * Listar todos los roles
	 */
	async listar(): Promise<Rol[]> {
		const response = await apiClient.get<Rol[]>('/roles');
		return response.data;
	}

	/**
	 * Obtener rol por ID
	 */
	async obtenerPorId(id: string): Promise<Rol> {
		const response = await apiClient.get<Rol>(`/roles/${id}`);
		return response.data;
	}

	/**
	 * Crear nuevo rol
	 */
	async crear(data: CreateRolRequest): Promise<Rol> {
		const response = await apiClient.post<Rol>('/roles', data);
		return response.data;
	}

	/**
	 * Actualizar rol
	 */
	async actualizar(id: string, data: UpdateRolRequest): Promise<Rol> {
		const response = await apiClient.put<Rol>(`/roles/${id}`, data);
		return response.data;
	}

	/**
	 * Agregar permiso a rol
	 */
	async agregarPermiso(id: string, permiso: string): Promise<Rol> {
		const response = await apiClient.patch<Rol>(`/roles/${id}/permisos/add`, {
			permiso,
		});
		return response.data;
	}

	/**
	 * Remover permiso de rol
	 */
	async removerPermiso(id: string, permiso: string): Promise<Rol> {
		const response = await apiClient.patch<Rol>(
			`/roles/${id}/permisos/remove`,
			{ permiso }
		);
		return response.data;
	}

	/**
	 * Eliminar rol
	 */
	async eliminar(id: string): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(
			`/roles/${id}`
		);
		return response.data;
	}
}

export default new RolesService();
