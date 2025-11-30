import apiClient from '../api/axios';
import { CreateRespuestaRequest, Respuesta } from '../types';

class RespuestasService {
	/**
	 * Enviar respuesta de encuesta (público, sin autenticación)
	 */
	async enviar(data: CreateRespuestaRequest): Promise<Respuesta> {
		// Esta petición no requiere autenticación
		const response = await fetch(`${apiClient.defaults.baseURL}/respuestas`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Error al enviar respuesta');
		}

		return response.json();
	}

	/**
	 * Listar respuestas de una encuesta (requiere autenticación)
	 */
	async listarPorEncuesta(encuestaId: string): Promise<Respuesta[]> {
		const response = await apiClient.get<Respuesta[]>(`/respuestas`, {
			params: { encuesta_id: encuestaId },
		});
		return response.data;
	}

	/**
	 * Obtener respuesta por ID (requiere autenticación)
	 */
	async obtenerPorId(id: string): Promise<Respuesta> {
		const response = await apiClient.get<Respuesta>(`/respuestas/${id}`);
		return response.data;
	}
}

export default new RespuestasService();
