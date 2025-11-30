import { useEffect, useState } from 'react';
import reportesService from '../services/reportes.service';
import { EstadisticasEncuesta, FiltrosReporte } from '../types';

export const useReportes = (filtros?: FiltrosReporte) => {
	const [estadisticas, setEstadisticas] = useState<EstadisticasEncuesta[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchEstadisticas = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await reportesService.obtenerEstadisticas(filtros);
			setEstadisticas(data);
		} catch (err: any) {
			setError(err.message || 'Error al cargar estadísticas');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchEstadisticas();
	}, [
		filtros?.encuesta_id,
		filtros?.empresa_id,
		filtros?.fecha_inicio,
		filtros?.fecha_fin,
	]);

	return { estadisticas, isLoading, error, refetch: fetchEstadisticas };
};
