import apiClient from '../api/axios';
import { EstadisticasEncuesta, FiltrosReporte } from '../types';

class ReportesService {
	/**
	 * Obtener estadísticas y tabulación
	 */
	async obtenerEstadisticas(
		filtros?: FiltrosReporte
	): Promise<EstadisticasEncuesta[]> {
		const response = await apiClient.get<EstadisticasEncuesta[]>(
			'/reportes/estadisticas',
			{
				params: filtros,
			}
		);
		return response.data;
	}

	/**
	 * Exportar a Excel
	 */
	async exportarExcel(filtros?: FiltrosReporte): Promise<Blob> {
		const response = await apiClient.get('/reportes/exportar/excel', {
			params: filtros,
			responseType: 'blob',
		});
		return response.data;
	}

	/**
	 * Exportar a PDF
	 */
	async exportarPDF(filtros?: FiltrosReporte): Promise<Blob> {
		const response = await apiClient.get('/reportes/exportar/pdf', {
			params: filtros,
			responseType: 'blob',
		});
		return response.data;
	}

	/**
	 * Descargar archivo (helper genérico)
	 */
	descargarArchivo(blob: Blob, nombreArchivo: string): void {
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = nombreArchivo;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}
}

export default new ReportesService();
