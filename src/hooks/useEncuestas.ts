import { useEffect, useState } from 'react';
import encuestasService from '../services/encuestas.service';
import { Encuesta } from '../types';

export const useEncuestas = () => {
	const [encuestas, setEncuestas] = useState<Encuesta[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchEncuestas = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await encuestasService.listar();
			setEncuestas(data);
		} catch (err: any) {
			setError(err.message || 'Error al cargar encuestas');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchEncuestas();
	}, []);

	return { encuestas, isLoading, error, refetch: fetchEncuestas };
};

export const useEncuesta = (id: string | undefined) => {
	const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) {
			setIsLoading(false);
			setEncuesta(null);
			return;
		}

		const fetchEncuesta = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await encuestasService.obtenerPorId(id);
				setEncuesta(data);
			} catch (err: any) {
				setError(err.message || 'Error al cargar la encuesta');
			} finally {
				setIsLoading(false);
			}
		};

		fetchEncuesta();
	}, [id]);

	return { encuesta, isLoading, error };
};
