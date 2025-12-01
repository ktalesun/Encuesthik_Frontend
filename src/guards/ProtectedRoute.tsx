import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredPermiso?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredPermiso,
}) => {
	const { isAuthenticated, isLoading, hasPermiso } = useAuth();

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-slate-600">Cargando...</p>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (requiredPermiso && !hasPermiso(requiredPermiso)) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center max-w-md">
					<h2 className="text-2xl mb-2">Sin Permisos</h2>
					<p className="text-slate-600 mb-4">
						No tienes permisos para acceder a esta página
					</p>
					<p className="text-sm text-slate-500">
						Permiso requerido:{' '}
						<code className="bg-slate-100 px-2 py-1 rounded">
							{requiredPermiso}
						</code>
					</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};

export default ProtectedRoute;
