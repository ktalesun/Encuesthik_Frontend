import apiClient from '../api/axios';
import {
	CreateEncuestaRequest,
	Encuesta,
	EstadoEncuesta,
	UpdateEncuestaRequest,
} from '../types';

class EncuestasService {
	/**
	 * Listar todas las encuestas
	 */
	async listar(): Promise<Encuesta[]> {
		const response = await apiClient.get<Encuesta[]>('/encuestas');
		return response.data;
	}

	/**
	 * Obtener encuesta por ID
	 */
	async obtenerPorId(id: string): Promise<Encuesta> {
		const response = await apiClient.get<Encuesta>(`/encuestas/${id}`);
		return response.data;
	}

	/**
	 * Crear nueva encuesta
	 */
	async crear(data: CreateEncuestaRequest): Promise<Encuesta> {
		const response = await apiClient.post<Encuesta>('/encuestas', data);
		return response.data;
	}

	/**
	 * Actualizar encuesta
	 */
	async actualizar(id: string, data: UpdateEncuestaRequest): Promise<Encuesta> {
		const response = await apiClient.put<Encuesta>(`/encuestas/${id}`, data);
		return response.data;
	}

	/**
	 * Actualizar estado de encuesta
	 */
	async actualizarEstado(
		id: string,
		estado: EstadoEncuesta
	): Promise<Encuesta> {
		const response = await apiClient.patch<Encuesta>(
			`/encuestas/${id}/estado`,
			{ estado }
		);
		return response.data;
	}

	/**
	 * Duplicar encuesta
	 */
	async duplicar(id: string): Promise<Encuesta> {
		const response = await apiClient.post<Encuesta>(
			`/encuestas/${id}/duplicar`
		);
		return response.data;
	}

	/**
	 * Eliminar encuesta
	 */
	async eliminar(id: string): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(
			`/encuestas/${id}`
		);
		return response.data;
	}

	/**
	 * Obtener encuesta pública (sin autenticación)
	 */
	async obtenerPublica(
		empresaId: string,
		encuestaId: string
	): Promise<Encuesta> {
		// Esta petición no requiere token, usamos fetch directamente
		const response = await fetch(
			`${apiClient.defaults.baseURL}/encuestas/public/${empresaId}/${encuestaId}`
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Error al obtener la encuesta');
		}

		return response.json();
	}
}

export default new EncuestasService();
