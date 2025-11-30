import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import authService from '../services/auth.service';
import { LoginRequest, Usuario } from '../types';

interface AuthContextType {
	usuario: Usuario | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (credentials: LoginRequest) => Promise<void>;
	logout: () => void;
	hasPermiso: (permiso: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Verificar si hay un usuario en localStorage al cargar
		const currentUser = authService.getCurrentUser();
		if (currentUser) {
			setUsuario(currentUser);
		}
		setIsLoading(false);
	}, []);

	const login = async (credentials: LoginRequest) => {
		try {
			const response = await authService.login(credentials);
			setUsuario(response.usuario);
		} catch (error) {
			throw error;
		}
	};

	const logout = () => {
		authService.logout();
		setUsuario(null);
	};

	const hasPermiso = (permiso: string): boolean => {
		if (!usuario || !usuario.rol) return false;
		return usuario.rol.permisos.includes(permiso);
	};

	const value: AuthContextType = {
		usuario,
		isAuthenticated: !!usuario,
		isLoading,
		login,
		logout,
		hasPermiso,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth debe ser usado dentro de un AuthProvider');
	}
	return context;
};
