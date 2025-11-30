import apiClient from '../api/axios';
import { CreateEmpresaRequest, Empresa, UpdateEmpresaRequest } from '../types';

class EmpresasService {
	/**
	 * Listar todas las empresas
	 */
	async listar(): Promise<Empresa[]> {
		const response = await apiClient.get<Empresa[]>('/empresas');
		return response.data;
	}

	/**
	 * Obtener empresa por ID
	 */
	async obtenerPorId(id: string): Promise<Empresa> {
		const response = await apiClient.get<Empresa>(`/empresas/${id}`);
		return response.data;
	}

	/**
	 * Crear nueva empresa
	 */
	async crear(data: CreateEmpresaRequest): Promise<Empresa> {
		const response = await apiClient.post<Empresa>('/empresas', data);
		return response.data;
	}

	/**
	 * Actualizar empresa
	 */
	async actualizar(id: string, data: UpdateEmpresaRequest): Promise<Empresa> {
		const response = await apiClient.put<Empresa>(`/empresas/${id}`, data);
		return response.data;
	}

	/**
	 * Actualizar estado de empresa
	 */
	async actualizarEstado(
		id: string,
		estado: 'activa' | 'inactiva'
	): Promise<Empresa> {
		const response = await apiClient.patch<Empresa>(`/empresas/${id}/estado`, {
			estado,
		});
		return response.data;
	}

	/**
	 * Eliminar empresa
	 */
	async eliminar(id: string): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(
			`/empresas/${id}`
		);
		return response.data;
	}
}

export default new EmpresasService();
