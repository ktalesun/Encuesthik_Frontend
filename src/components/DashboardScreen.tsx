import {
	BarChart3,
	ChartBar,
	Copy,
	Edit,
	FileText,
	Link,
	Loader2,
	LogOut,
	MessageSquare,
	Plus,
	QrCode,
	Settings,
	Trash2,
	Users,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useEncuestas } from '../hooks/useEncuestas';
import { useUsuarios } from '../hooks/useUsuarios';
import encuestasService from '../services/encuestas.service';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Switch } from './ui/switch';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function DashboardScreen() {
	const navigate = useNavigate();
	const { usuario, logout } = useAuth();
	const { encuestas, isLoading: loadingEncuestas, refetch } = useEncuestas();
	const { usuarios, isLoading: loadingUsuarios } = useUsuarios();
	const [activeTab, setActiveTab] = useState('surveys');

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleCreateSurvey = () => {
		navigate('/encuestas/nueva');
	};

	const handleEditSurvey = (encuestaId: string) => {
		navigate(`/encuestas/${encuestaId}/editar`);
	};

	const handleDuplicateSurvey = async (encuestaId: string) => {
		try {
			await encuestasService.duplicar(encuestaId);
			toast.success('Encuesta duplicada exitosamente');
			refetch();
		} catch (error: any) {
			toast.error(error.message || 'Error al duplicar encuesta');
		}
	};

	const handleDeleteSurvey = async (encuestaId: string, titulo: string) => {
		if (!confirm(`¿Estás seguro de eliminar la encuesta "${titulo}"?`)) return;

		try {
			await encuestasService.eliminar(encuestaId);
			toast.success('Encuesta eliminada exitosamente');
			refetch();
		} catch (error: any) {
			toast.error(error.message || 'Error al eliminar encuesta');
		}
	};

	const handleCopyLink = (urlPublica: string) => {
		const fullUrl = `${window.location.origin}${urlPublica}`;
		navigator.clipboard.writeText(fullUrl);
		toast.success('Enlace copiado al portapapeles');
	};

	// Estadísticas calculadas
	const totalEncuestas = encuestas.length;
	const encuestasActivas = encuestas.filter(
		(e) => e.estado === 'publicada'
	).length;
	const usuariosActivos = usuarios.filter((u) => u.estado === 'activo').length;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<header className="bg-white border-b border-slate-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
								<ChartBar className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl">Encues-Think</h1>
								<p className="text-slate-600">
									{usuario?.empresa?.nombre || 'Cargando...'}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Button variant="outline" size="sm">
								<Settings className="w-4 h-4 mr-2" />
								Configuración
							</Button>
							<Button variant="outline" size="sm" onClick={handleLogout}>
								<LogOut className="w-4 h-4 mr-2" />
								Salir
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Total Encuestas</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="text-3xl">{totalEncuestas}</div>
								<FileText className="w-8 h-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Encuestas Activas</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="text-3xl">{encuestasActivas}</div>
								<BarChart3 className="w-8 h-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Respuestas Totales</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="text-3xl">-</div>
								<MessageSquare className="w-8 h-8 text-purple-600" />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="pb-3">
							<CardDescription>Usuarios Activos</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="text-3xl">{usuariosActivos}</div>
								<Users className="w-8 h-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<div className="flex items-center justify-between mb-6">
						<TabsList>
							<TabsTrigger value="surveys">Encuestas</TabsTrigger>
							<TabsTrigger value="users">Usuarios Autorizados</TabsTrigger>
						</TabsList>
						<div className="flex gap-3">
							{activeTab === 'surveys' && (
								<>
									<Button
										variant="outline"
										onClick={() => navigate('/reportes')}
									>
										<BarChart3 className="w-4 h-4 mr-2" />
										Reportes
									</Button>
									<Button onClick={handleCreateSurvey}>
										<Plus className="w-4 h-4 mr-2" />
										Nueva Encuesta
									</Button>
								</>
							)}
							{activeTab === 'users' && (
								<Button>
									<Plus className="w-4 h-4 mr-2" />
									Agregar Usuario
								</Button>
							)}
						</div>
					</div>

					<TabsContent value="surveys" className="space-y-4">
						{loadingEncuestas ? (
							<div className="flex items-center justify-center py-12">
								<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
							</div>
						) : encuestas.length === 0 ? (
							<Card>
								<CardContent className="py-12 text-center">
									<FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
									<h3 className="text-lg mb-2">No hay encuestas</h3>
									<p className="text-slate-600 mb-4">
										Crea tu primera encuesta para comenzar
									</p>
									<Button onClick={handleCreateSurvey}>
										<Plus className="w-4 h-4 mr-2" />
										Nueva Encuesta
									</Button>
								</CardContent>
							</Card>
						) : (
							encuestas.map((encuesta) => (
								<Card key={encuesta.id_encuesta}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<CardTitle>{encuesta.titulo}</CardTitle>
													<Badge
														variant={
															encuesta.estado === 'publicada'
																? 'default'
																: 'secondary'
														}
													>
														{encuesta.estado}
													</Badge>
												</div>
												<CardDescription>
													Creada:{' '}
													{new Date(encuesta.created_at).toLocaleDateString()} •
													Expira:{' '}
													{new Date(encuesta.fecha_fin).toLocaleDateString()}
												</CardDescription>
											</div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="outline" size="sm">
														Opciones
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														onClick={() =>
															handleEditSurvey(encuesta.id_encuesta)
														}
													>
														<Edit className="w-4 h-4 mr-2" />
														Editar
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															handleDuplicateSurvey(encuesta.id_encuesta)
														}
													>
														<Copy className="w-4 h-4 mr-2" />
														Duplicar
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleCopyLink(encuesta.url_publica)}
													>
														<Link className="w-4 h-4 mr-2" />
														Copiar Enlace
													</DropdownMenuItem>
													<DropdownMenuItem>
														<QrCode className="w-4 h-4 mr-2" />
														Generar QR
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-red-600"
														onClick={() =>
															handleDeleteSurvey(
																encuesta.id_encuesta,
																encuesta.titulo
															)
														}
													>
														<Trash2 className="w-4 h-4 mr-2" />
														Eliminar
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleEditSurvey(encuesta.id_encuesta)}
											>
												<Edit className="w-4 h-4 mr-2" />
												Editar
											</Button>
											<Button variant="outline" size="sm">
												<BarChart3 className="w-4 h-4 mr-2" />
												Ver Resultados
											</Button>
											<Button variant="outline" size="sm">
												<QrCode className="w-4 h-4 mr-2" />
												QR Code
											</Button>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</TabsContent>

					<TabsContent value="users">
						<Card>
							<CardHeader>
								<CardTitle>Usuarios Autorizados</CardTitle>
								<CardDescription>
									Gestiona los usuarios que pueden crear y analizar encuestas
								</CardDescription>
							</CardHeader>
							<CardContent>
								{loadingUsuarios ? (
									<div className="flex items-center justify-center py-12">
										<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
									</div>
								) : (
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Nombre</TableHead>
												<TableHead>Correo</TableHead>
												<TableHead>Rol</TableHead>
												<TableHead>Estado</TableHead>
												<TableHead>Acciones</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{usuarios.map((user) => (
												<TableRow key={user.id_usuario}>
													<TableCell>{user.nombre}</TableCell>
													<TableCell>{user.email}</TableCell>
													<TableCell>
														<Badge variant="outline">
															{user.rol?.nombre || 'Sin rol'}
														</Badge>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Switch checked={user.estado === 'activo'} />
															<span>{user.estado}</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex gap-2">
															<Button variant="outline" size="sm">
																<Edit className="w-4 h-4" />
															</Button>
															<Button variant="outline" size="sm">
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
