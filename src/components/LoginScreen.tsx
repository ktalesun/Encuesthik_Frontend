import { AlertCircle, ChartBar } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function LoginScreen() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			setError('Por favor completa todos los campos');
			return;
		}

		try {
			setIsLoading(true);
			setError(null);

			await login({ email, password });

			// Redirigir al dashboard después del login
			navigate('/dashboard');
		} catch (err: any) {
			setError(err.message || 'Credenciales inválidas');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-white p-4">
			<div className="w-full max-w-md">
				{/* Logo & Title */}
				<div className="text-center mb-12">
					<div className="inline-flex items-center gap-3 mb-3">
						<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
							<ChartBar className="w-7 h-7 text-white" />
						</div>
						<h1 className="text-4xl">Encues-Think</h1>
					</div>
					<p className="text-slate-500">Gestión de encuestas empresariales</p>
				</div>

				{/* Error Alert */}
				{error && (
					<Alert variant="destructive" className="mb-6">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Correo electrónico</Label>
							<Input
								id="email"
								type="email"
								placeholder="tu@empresa.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Contraseña</Label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>
					</div>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
					</Button>

					{/* Credenciales de prueba */}
					<div className="mt-8 p-4 bg-slate-50 rounded-lg">
						<p className="text-slate-600 mb-2">
							<strong>Credenciales de prueba:</strong>
						</p>
						<div className="space-y-1 text-sm text-slate-600">
							<p>Admin: admin@techsolutions.com / Admin123!</p>
							<p>Editor: juan@techsolutions.com / Editor123!</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
