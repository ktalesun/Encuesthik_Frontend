import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './guards/ProtectedRoute';
import PublicRoute from './guards/PublicRoute';

// Pages
import DashboardScreen from './components/DashboardScreen';
import LoginScreen from './components/LoginScreen';
import PublicSurveyScreen from './components/PublicSurveyScreen';
import ReportsScreen from './components/ReportsScreen';
import SurveyEditorScreen from './components/SurveyEditorScreen';

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					{/* Public Routes */}
					<Route
						path="/login"
						element={
							<PublicRoute>
								<LoginScreen />
							</PublicRoute>
						}
					/>

					{/* Public Survey Route (no authentication required) */}
					<Route
						path="/encuestas/public/:empresaId/:encuestaId"
						element={<PublicSurveyScreen />}
					/>

					{/* Protected Routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<DashboardScreen />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/encuestas/nueva"
						element={
							<ProtectedRoute requiredPermiso="encuestas.crear">
								<SurveyEditorScreen />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/encuestas/:id/editar"
						element={
							<ProtectedRoute requiredPermiso="encuestas.editar">
								<SurveyEditorScreen />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/reportes"
						element={
							<ProtectedRoute requiredPermiso="reportes.ver">
								<ReportsScreen />
							</ProtectedRoute>
						}
					/>

					{/* Redirect root to dashboard */}
					<Route path="/" element={<Navigate to="/dashboard" replace />} />

					{/* 404 */}
					<Route
						path="*"
						element={
							<div className="min-h-screen flex items-center justify-center">
								<div className="text-center">
									<h1 className="text-4xl mb-4">404</h1>
									<p className="text-slate-600">Página no encontrada</p>
								</div>
							</div>
						}
					/>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}
