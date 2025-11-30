import { useEffect, useState } from 'react';
import usuariosService from '../services/usuarios.service';
import { Usuario } from '../types';

export const useUsuarios = () => {
	const [usuarios, setUsuarios] = useState<Usuario[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUsuarios = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await usuariosService.listar();
			setUsuarios(data);
		} catch (err: any) {
			setError(err.message || 'Error al cargar usuarios');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsuarios();
	}, []);

	return { usuarios, isLoading, error, refetch: fetchUsuarios };
};
