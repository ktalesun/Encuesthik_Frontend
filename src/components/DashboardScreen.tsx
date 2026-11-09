import {
	BarChart3,
	ChartBar,
	Check,
	Copy,
	Edit,
	FileText,
	Link,
	Loader2,
	LogOut,
	MessageCircle,
	MessageSquare,
	Plus,
	Trash2,
	Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useEncuestas } from '../hooks/useEncuestas';
import { useUsuarios } from '../hooks/useUsuarios';
import encuestasService from '../services/encuestas.service';
import rolesService from '../services/roles.service';
import usuariosService from '../services/usuarios.service';
import { Rol } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
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
	const {
		usuarios,
		isLoading: loadingUsuarios,
		refetch: refetchUsuarios,
	} = useUsuarios();
	const [activeTab, setActiveTab] = useState('surveys');

	// Estados para el diálogo de usuario
	const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
	const [editingUserId, setEditingUserId] = useState<string | null>(null);
	const [roles, setRoles] = useState<Rol[]>([]);
	const [userForm, setUserForm] = useState({
		nombre: '',
		email: '',
		password: '',
		rol_id: '',
	});
	const [isSavingUser, setIsSavingUser] = useState(false);

	// Estados para el diálogo de enlace público
	const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
	const [selectedEncuestaLink, setSelectedEncuestaLink] = useState('');
	const [selectedEncuestaTitulo, setSelectedEncuestaTitulo] = useState('');
	const [linkCopied, setLinkCopied] = useState(false);

	// Estados para WhatsApp
	const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false);
	const [whatsappNumber, setWhatsappNumber] = useState('');
	const [whatsappEncuestaUrl, setWhatsappEncuestaUrl] = useState('');
	const [whatsappEncuestaTitulo, setWhatsappEncuestaTitulo] = useState('');

	// Cargar roles al montar el componente
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const data = await rolesService.listar();
				setRoles(data);
			} catch (error) {
				console.error('Error al cargar roles:', error);
			}
		};
		fetchRoles();
	}, []);

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

	const handleCopyLink = (urlPublica: string, titulo: string) => {
		// Si la URL ya es absoluta (comienza con http), usarla directamente
		// Si no, construirla con el origin actual
		const fullUrl = urlPublica.startsWith('http')
			? urlPublica
			: `${window.location.origin}${urlPublica}`;
		setSelectedEncuestaLink(fullUrl);
		setSelectedEncuestaTitulo(titulo);
		setIsLinkDialogOpen(true);
		setLinkCopied(false);
	};

	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(selectedEncuestaLink);
			setLinkCopied(true);
			toast.success('Enlace copiado al portapapeles');
			setTimeout(() => setLinkCopied(false), 3000);
		} catch (error) {
			toast.error('Error al copiar el enlace');
		}
	};

	const handleOpenWhatsApp = (urlPublica: string, titulo: string) => {
		const fullUrl = urlPublica.startsWith('http')
			? urlPublica
			: `${window.location.origin}${urlPublica}`;
		setWhatsappEncuestaUrl(fullUrl);
		setWhatsappEncuestaTitulo(titulo);
		setWhatsappNumber('');
		setIsWhatsAppDialogOpen(true);
	};

	const handleSendWhatsApp = () => {
		if (!whatsappNumber.trim()) {
			toast.error('Por favor ingresa un número de teléfono');
			return;
		}

		// Limpiar el número (remover espacios, guiones, paréntesis)
		const telefonoLimpio = whatsappNumber.replace(/[^0-9]/g, '');

		if (telefonoLimpio.length < 10) {
			toast.error('Por favor ingresa un número válido (mínimo 10 dígitos)');
			return;
		}

		// Crear mensaje personalizado
		const mensaje = `Hola! 👋\n\nTe invitamos a participar en nuestra encuesta: *${whatsappEncuestaTitulo}*\n\n🔗 ${whatsappEncuestaUrl}\n\n¡Gracias por tu tiempo! 😊`;

		// Crear URL de WhatsApp
		const urlWhatsApp = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;

		// Abrir en nueva ventana
		window.open(urlWhatsApp, '_blank');

		// Cerrar modal y limpiar
		setIsWhatsAppDialogOpen(false);
		setWhatsappNumber('');
		toast.success('Abriendo WhatsApp...');
	};

	// Funciones para gestión de usuarios
	const handleOpenUserDialog = (userId?: string) => {
		if (userId) {
			const user = usuarios.find((u) => u.id_usuario === userId);
			if (user) {
				setEditingUserId(userId);
				setUserForm({
					nombre: user.nombre,
					email: user.email,
					password: '',
					rol_id: user.rol_id,
				});
			}
		} else {
			setEditingUserId(null);
			setUserForm({
				nombre: '',
				email: '',
				password: '',
				rol_id: '',
			});
		}
		setIsUserDialogOpen(true);
	};

	const handleCloseUserDialog = () => {
		setIsUserDialogOpen(false);
		setEditingUserId(null);
		setUserForm({
			nombre: '',
			email: '',
			password: '',
			rol_id: '',
		});
	};

	const handleSaveUser = async () => {
		if (!userForm.nombre || !userForm.email || !userForm.rol_id) {
			toast.error('Por favor completa todos los campos obligatorios');
			return;
		}

		if (!editingUserId && !userForm.password) {
			toast.error('La contraseña es obligatoria para nuevos usuarios');
			return;
		}

		try {
			setIsSavingUser(true);

			if (editingUserId) {
				// Actualizar usuario existente
				const updateData: any = {
					nombre: userForm.nombre,
					email: userForm.email,
					rol_id: userForm.rol_id,
				};

				// Solo incluir password si se proporcionó uno nuevo
				if (userForm.password) {
					updateData.password = userForm.password;
				}

				await usuariosService.actualizar(editingUserId, updateData);
				toast.success('Usuario actualizado exitosamente');
			} else {
				// Crear nuevo usuario
				await usuariosService.crear({
					nombre: userForm.nombre,
					email: userForm.email,
					password: userForm.password,
					rol_id: userForm.rol_id,
					empresa_id: usuario?.empresa?.id_empresa || '',
				});
				toast.success('Usuario creado exitosamente');
			}

			refetchUsuarios();
			handleCloseUserDialog();
		} catch (error: any) {
			toast.error(error.message || 'Error al guardar usuario');
		} finally {
			setIsSavingUser(false);
		}
	};

	const handleToggleUserStatus = async (
		userId: string,
		currentStatus: string
	) => {
		try {
			const newStatus = currentStatus === 'activo' ? 'inactivo' : 'activo';
			await usuariosService.actualizarEstado(userId, newStatus);
			toast.success(
				`Usuario ${newStatus === 'activo' ? 'activado' : 'desactivado'} exitosamente`
			);
			refetchUsuarios();
		} catch (error: any) {
			toast.error(error.message || 'Error al cambiar estado del usuario');
		}
	};

	const handleDeleteUser = async (userId: string, nombre: string) => {
		if (!confirm(`¿Estás seguro de eliminar al usuario "${nombre}"?`)) return;

		try {
			await usuariosService.eliminar(userId);
			toast.success('Usuario eliminado exitosamente');
			refetchUsuarios();
		} catch (error: any) {
			toast.error(error.message || 'Error al eliminar usuario');
		}
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
					<Card
						className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-purple-200 bg-gradient-to-br from-purple-50 to-white"
						onClick={() => navigate('/reportes')}
					>
						<CardHeader className="pb-3">
							<CardDescription className="flex items-center justify-between">
								<span>Respuestas Totales</span>
								<BarChart3 className="w-4 h-4 text-purple-600" />
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="text-3xl font-bold text-purple-600">
									Ver Reportes
								</div>
								<MessageSquare className="w-8 h-8 text-purple-600" />
							</div>
							<p className="text-sm text-purple-600 mt-2 font-medium">
								Click para ver estadísticas →
							</p>
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
								<Button onClick={() => handleOpenUserDialog()}>
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
										<CardAction>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() =>
														handleCopyLink(
															encuesta.url_publica,
															encuesta.titulo
														)
													}
												>
													<Link className="w-4 h-4 mr-2" />
													Copiar Enlace
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
													onClick={() =>
														handleOpenWhatsApp(
															encuesta.url_publica,
															encuesta.titulo
														)
													}
												>
													<MessageCircle className="w-4 h-4 mr-2" />
													WhatsApp
												</Button>
											</div>
										</CardAction>
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
											<Button
												variant="outline"
												size="sm"
												onClick={() => navigate('/reportes')}
											>
												<BarChart3 className="w-4 h-4 mr-2" />
												Ver Resultados
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-red-600 hover:text-red-700"
												onClick={() =>
													handleDeleteSurvey(
														encuesta.id_encuesta,
														encuesta.titulo
													)
												}
											>
												<Trash2 className="w-4 h-4 mr-2" />
												Eliminar
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
															<Switch
																checked={user.estado === 'activo'}
																onCheckedChange={() =>
																	handleToggleUserStatus(
																		user.id_usuario,
																		user.estado
																	)
																}
															/>
															<span>{user.estado}</span>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex gap-2">
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	handleOpenUserDialog(user.id_usuario)
																}
															>
																<Edit className="w-4 h-4" />
															</Button>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	handleDeleteUser(user.id_usuario, user.nombre)
																}
															>
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

			{/* Diálogo para Agregar/Editar Usuario */}
			<Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							{editingUserId ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
						</DialogTitle>
						<DialogDescription>
							{editingUserId
								? 'Actualiza la información del usuario'
								: 'Completa los datos para crear un nuevo usuario'}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="nombre">Nombre Completo *</Label>
							<Input
								id="nombre"
								placeholder="Juan Pérez"
								value={userForm.nombre}
								onChange={(e) =>
									setUserForm({ ...userForm, nombre: e.target.value })
								}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="email">Correo Electrónico *</Label>
							<Input
								id="email"
								type="email"
								placeholder="juan@empresa.com"
								value={userForm.email}
								onChange={(e) =>
									setUserForm({ ...userForm, email: e.target.value })
								}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="password">
								Contraseña{' '}
								{editingUserId ? '(dejar vacío para no cambiar)' : '*'}
							</Label>
							<Input
								id="password"
								type="password"
								placeholder={
									editingUserId ? 'Nueva contraseña' : 'Contraseña segura'
								}
								value={userForm.password}
								onChange={(e) =>
									setUserForm({ ...userForm, password: e.target.value })
								}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="rol">Rol *</Label>
							<Select
								value={userForm.rol_id}
								onValueChange={(value) =>
									setUserForm({ ...userForm, rol_id: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona un rol" />
								</SelectTrigger>
								<SelectContent>
									{roles.map((rol) => (
										<SelectItem key={rol.id_rol} value={rol.id_rol}>
											{rol.nombre}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={handleCloseUserDialog}>
							Cancelar
						</Button>
						<Button onClick={handleSaveUser} disabled={isSavingUser}>
							{isSavingUser ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Guardando...
								</>
							) : (
								<>{editingUserId ? 'Actualizar' : 'Crear'} Usuario</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Diálogo para Enlace Público */}
			<Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Enlace Público de la Encuesta</DialogTitle>
						<DialogDescription>
							Comparte este enlace para que las personas puedan responder:{' '}
							<strong>{selectedEncuestaTitulo}</strong>
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="flex items-center gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
							<div className="flex-1 overflow-hidden">
								<p className="text-sm text-slate-600 mb-1">
									URL de la encuesta:
								</p>
								<p className="text-sm font-mono break-all text-blue-600">
									{selectedEncuestaLink}
								</p>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopyToClipboard}
								className="shrink-0"
							>
								{linkCopied ? (
									<>
										<Check className="w-4 h-4 mr-2 text-green-600" />
										Copiado
									</>
								) : (
									<>
										<Copy className="w-4 h-4 mr-2" />
										Copiar
									</>
								)}
							</Button>
						</div>

						<div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
							<MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
							<div className="text-sm text-blue-900">
								<p className="font-medium mb-1">¿Cómo usar este enlace?</p>
								<ul className="list-disc list-inside space-y-1 text-blue-800">
									<li>Compártelo por correo, WhatsApp o redes sociales</li>
									<li>No requiere inicio de sesión para responder</li>
									<li>Las respuestas se guardarán automáticamente</li>
								</ul>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsLinkDialogOpen(false)}
						>
							Cerrar
						</Button>
						<Button onClick={handleCopyToClipboard}>
							<Copy className="w-4 h-4 mr-2" />
							Copiar Enlace
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Diálogo para enviar por WhatsApp */}
			<Dialog
				open={isWhatsAppDialogOpen}
				onOpenChange={setIsWhatsAppDialogOpen}
			>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<MessageCircle className="w-5 h-5 text-green-600" />
							Enviar por WhatsApp
						</DialogTitle>
						<DialogDescription>
							Ingresa el número de teléfono para enviar la encuesta:{' '}
							<strong>{whatsappEncuestaTitulo}</strong>
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="whatsapp-number">
								Número de WhatsApp (incluye código de país)
							</Label>
							<Input
								id="whatsapp-number"
								type="tel"
								placeholder="Ej: 573001234567"
								value={whatsappNumber}
								onChange={(e) => setWhatsappNumber(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSendWhatsApp();
									}
								}}
							/>
							<p className="text-xs text-slate-500">
								Formato: código país + número (sin espacios ni guiones)
								<br />
								Ejemplo Colombia: 573001234567
							</p>
						</div>

						<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
							<p className="text-sm text-green-900 font-medium mb-2">
								Vista previa del mensaje:
							</p>
							<div className="text-xs text-green-800 bg-white p-3 rounded border border-green-100 whitespace-pre-wrap">
								Hola! 👋{'\n\n'}
								Te invitamos a participar en nuestra encuesta: *
								{whatsappEncuestaTitulo}*{'\n\n'}
								🔗 {whatsappEncuestaUrl}
								{'\n\n'}
								¡Gracias por tu tiempo! 😊
							</div>
						</div>

						<div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
							<MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
							<div className="text-xs text-blue-900">
								<p className="font-medium mb-1">Nota importante:</p>
								<p>
									Se abrirá WhatsApp Web o la aplicación con el mensaje
									pre-escrito. Solo necesitas hacer clic en "Enviar".
								</p>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsWhatsAppDialogOpen(false)}
						>
							Cancelar
						</Button>
						<Button
							onClick={handleSendWhatsApp}
							className="bg-green-600 hover:bg-green-700"
						>
							<MessageCircle className="w-4 h-4 mr-2" />
							Abrir WhatsApp
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
