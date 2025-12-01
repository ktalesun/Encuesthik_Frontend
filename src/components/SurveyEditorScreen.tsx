import {
	ArrowLeft,
	Eye,
	GripVertical,
	Link2,
	Loader2,
	MessageSquare,
	Plus,
	QrCode,
	Save,
	Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useEncuesta } from '../hooks/useEncuestas';
import encuestasService from '../services/encuestas.service';
import { TipoPregunta } from '../types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

interface Question {
	id?: string;
	type: string;
	text: string;
	required: boolean;
	options: string[];
	rango?: { min: number; max: number };
	orden: number;
}

export default function SurveyEditorScreen() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { encuesta, isLoading } = useEncuesta(id);

	const [titulo, setTitulo] = useState('');
	const [descripcion, setDescripcion] = useState('');
	const [fechaInicio, setFechaInicio] = useState('');
	const [fechaFin, setFechaFin] = useState('');
	const [estado, setEstado] = useState<
		'borrador' | 'publicada' | 'inactiva' | 'archivada'
	>('borrador');
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isSaving, setIsSaving] = useState(false);

	// Cargar datos de la encuesta si estamos editando
	useEffect(() => {
		if (encuesta) {
			setTitulo(encuesta.titulo);
			setDescripcion(encuesta.descripcion);
			setFechaInicio(encuesta.fecha_inicio.split('T')[0]);
			setFechaFin(encuesta.fecha_fin.split('T')[0]);
			setEstado(encuesta.estado);

			if (encuesta.preguntas) {
				const mappedQuestions = encuesta.preguntas.map((p) => ({
					id: p.id_pregunta,
					type: p.tipo, // Usar directamente el tipo del backend
					text: p.texto,
					required: p.requerida,
					options: p.opciones || [],
					rango: p.rango || { min: 1, max: 5 },
					orden: p.orden,
				}));
				setQuestions(mappedQuestions);
			}
		}
	}, [encuesta]);

	const addQuestion = () => {
		const newQuestion: Question = {
			type: 'texto',
			text: 'Nueva pregunta',
			required: false,
			options: [],
			rango: { min: 1, max: 5 },
			orden: questions.length + 1,
		};
		setQuestions([...questions, newQuestion]);
	};

	const removeQuestion = (index: number) => {
		setQuestions(questions.filter((_, i) => i !== index));
	};

	const updateQuestion = (index: number, field: string, value: any) => {
		const updated = [...questions];
		updated[index] = { ...updated[index], [field]: value };
		setQuestions(updated);
	};

	const addOption = (questionIndex: number) => {
		const updated = [...questions];
		updated[questionIndex].options.push(
			`Opción ${updated[questionIndex].options.length + 1}`
		);
		setQuestions(updated);
	};

	const removeOption = (questionIndex: number, optionIndex: number) => {
		const updated = [...questions];
		updated[questionIndex].options = updated[questionIndex].options.filter(
			(_, i) => i !== optionIndex
		);
		setQuestions(updated);
	};

	const handleSave = async () => {
		if (!titulo || !descripcion || !fechaInicio || !fechaFin) {
			toast.error('Por favor completa todos los campos obligatorios');
			return;
		}

		if (questions.length === 0) {
			toast.error('Debes agregar al menos una pregunta');
			return;
		}

		try {
			setIsSaving(true);

			// Mapear preguntas al formato de la API (sin requerida ni orden)
			const preguntasAPI = questions.map((q) => {
				const tipo = q.type as TipoPregunta;

				const pregunta: any = {
					texto: q.text,
					tipo,
				};

				// Solo agregar campos opcionales si son necesarios para el tipo
				if (tipo === 'opcion_unica' && q.options && q.options.length > 0) {
					pregunta.opciones = q.options;
				}

				if ((tipo === 'numerica' || tipo === 'estrellas') && q.rango) {
					pregunta.rango = q.rango;
				}

				return pregunta;
			});
			if (id) {
				// Actualizar encuesta existente
				await encuestasService.actualizar(id, {
					titulo,
					descripcion,
					fecha_inicio: fechaInicio,
					fecha_fin: fechaFin,
					estado,
				});
				toast.success('Encuesta actualizada exitosamente');
			} else {
				// Crear nueva encuesta
				const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

				if (!usuario.empresa?.id) {
					toast.error('No se pudo obtener la información de la empresa');
					return;
				}

				console.log('Creando encuesta con datos:', {
					titulo,
					descripcion,
					fecha_inicio: fechaInicio,
					fecha_fin: fechaFin,
					empresa_id: usuario.empresa.id,
					estado,
					preguntas: preguntasAPI,
				});

				await encuestasService.crear({
					titulo,
					descripcion,
					fecha_inicio: fechaInicio,
					fecha_fin: fechaFin,
					empresa_id: usuario.empresa.id,
					estado,
					preguntas: preguntasAPI,
				});
				toast.success('Encuesta creada exitosamente');
			}
			navigate('/dashboard');
		} catch (error: any) {
			toast.error(error.message || 'Error al guardar la encuesta');
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<header className="bg-white border-b border-slate-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button variant="ghost" onClick={() => navigate('/dashboard')}>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Volver
							</Button>
							<div>
								<h1 className="text-2xl">
									{id ? 'Editar Encuesta' : 'Nueva Encuesta'}
								</h1>
								<p className="text-slate-600">Empresa Demo S.A.</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Button variant="outline" disabled>
								<Eye className="w-4 h-4 mr-2" />
								Vista Previa
							</Button>
							<Button onClick={handleSave} disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Guardando...
									</>
								) : (
									<>
										<Save className="w-4 h-4 mr-2" />
										Guardar
									</>
								)}
							</Button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Editor */}
					<div className="lg:col-span-2 space-y-6">
						{/* Survey Settings */}
						<Card>
							<CardHeader>
								<CardTitle>Configuración de la Encuesta</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="survey-title">Título de la Encuesta</Label>
									<Input
										id="survey-title"
										placeholder="Ej: Encuesta de Satisfacción 2024"
										value={titulo}
										onChange={(e) => setTitulo(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="survey-description">Descripción</Label>
									<Textarea
										id="survey-description"
										placeholder="Describe el propósito de esta encuesta..."
										rows={3}
										value={descripcion}
										onChange={(e) => setDescripcion(e.target.value)}
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="start-date">Fecha de Inicio</Label>
										<Input
											id="start-date"
											type="date"
											value={fechaInicio}
											onChange={(e) => setFechaInicio(e.target.value)}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="end-date">Fecha de Finalización</Label>
										<Input
											id="end-date"
											type="date"
											value={fechaFin}
											onChange={(e) => setFechaFin(e.target.value)}
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="estado">Estado de la Encuesta</Label>
									<Select
										value={estado}
										onValueChange={(value: any) => setEstado(value)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona el estado" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="borrador">📝 Borrador</SelectItem>
											<SelectItem value="publicada">✅ Publicada</SelectItem>
											<SelectItem value="inactiva">⏸️ Inactiva</SelectItem>
											<SelectItem value="archivada">📦 Archivada</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-sm text-slate-500">
										{estado === 'borrador' &&
											'La encuesta no será visible públicamente'}
										{estado === 'publicada' &&
											'La encuesta estará disponible para responder'}
										{estado === 'inactiva' &&
											'La encuesta no aceptará nuevas respuestas'}
										{estado === 'archivada' && 'La encuesta está archivada'}
									</p>
								</div>
							</CardContent>
						</Card>

						{/* Questions */}
						<div className="space-y-4">
							{questions.map((question, index) => (
								<Card key={index}>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="flex items-start gap-3 flex-1">
												<GripVertical className="w-5 h-5 text-slate-400 mt-1 cursor-move" />
												<div className="flex-1 space-y-3">
													<div className="flex items-center gap-2">
														<span className="text-slate-500">
															Pregunta {index + 1}
														</span>
														{question.required && (
															<Badge variant="secondary">Obligatoria</Badge>
														)}
													</div>
													<Input
														value={question.text}
														onChange={(e) =>
															updateQuestion(index, 'text', e.target.value)
														}
														placeholder="Escribe tu pregunta aquí"
													/>
												</div>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeQuestion(index)}
											>
												<Trash2 className="w-4 h-4 text-red-600" />
											</Button>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<Label>Tipo de Pregunta</Label>
											<Select
												value={question.type}
												onValueChange={(value) =>
													updateQuestion(index, 'type', value)
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="texto">Texto Libre</SelectItem>
													<SelectItem value="opcion_unica">
														Opción Única
													</SelectItem>
													<SelectItem value="si_no">Sí/No</SelectItem>
													<SelectItem value="numerica">
														Escala Numérica
													</SelectItem>
													<SelectItem value="estrellas">
														Calificación con Estrellas
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{question.type === 'opcion_unica' && (
											<div className="space-y-2">
												<Label>Opciones de Respuesta</Label>
												{question.options.map((option, optIndex) => (
													<div
														key={optIndex}
														className="flex items-center gap-2"
													>
														<Input
															value={option}
															onChange={(e) => {
																const newOptions = [...question.options];
																newOptions[optIndex] = e.target.value;
																updateQuestion(index, 'options', newOptions);
															}}
														/>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => removeOption(index, optIndex)}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												))}
												<Button
													variant="outline"
													size="sm"
													onClick={() => addOption(index)}
												>
													<Plus className="w-4 h-4 mr-2" />
													Agregar Opción
												</Button>
											</div>
										)}

										{(question.type === 'numerica' ||
											question.type === 'estrellas') && (
											<div className="space-y-2">
												<Label>Rango de Calificación</Label>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label>Mínimo</Label>
														<Input
															type="number"
															value={question.rango?.min || 0}
															onChange={(e) => {
																const newRango = {
																	...question.rango,
																	min: Number(e.target.value),
																	max: question.rango?.max || 5,
																};
																updateQuestion(index, 'rango', newRango);
															}}
														/>
													</div>
													<div className="space-y-2">
														<Label>Máximo</Label>
														<Input
															type="number"
															value={question.rango?.max || 5}
															onChange={(e) => {
																const newRango = {
																	min: question.rango?.min || 0,
																	max: Number(e.target.value),
																};
																updateQuestion(index, 'rango', newRango);
															}}
														/>
													</div>
												</div>
												<p className="text-sm text-slate-500">
													{question.type === 'estrellas'
														? 'Número de estrellas a mostrar (ej: 0-5 o 1-5)'
														: 'Rango de valores permitidos (ej: 0-10 para NPS)'}
												</p>
											</div>
										)}

										<div className="flex items-center gap-2">
											<Switch
												checked={question.required}
												onCheckedChange={(checked) =>
													updateQuestion(index, 'required', checked)
												}
											/>
											<Label>Respuesta obligatoria</Label>
										</div>
									</CardContent>
								</Card>
							))}

							<Button
								variant="outline"
								className="w-full"
								onClick={addQuestion}
							>
								<Plus className="w-4 h-4 mr-2" />
								Agregar Pregunta
							</Button>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* WhatsApp Integration */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MessageSquare className="w-5 h-5 text-green-600" />
									Integración WhatsApp
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<Label>Habilitar WhatsApp</Label>
									<Switch />
								</div>
								<Separator />
								<div className="space-y-2">
									<Label>Número de WhatsApp Business</Label>
									<Input placeholder="+1 234 567 8900" />
								</div>
								<p className="text-slate-600 text-sm">
									Las respuestas enviadas por WhatsApp se integrarán
									automáticamente con la base de datos
								</p>
							</CardContent>
						</Card>

						{/* Links & QR */}
						<Card>
							<CardHeader>
								<CardTitle>Enlaces y Compartir</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									variant="outline"
									className="w-full justify-start"
									disabled
								>
									<Link2 className="w-4 h-4 mr-2" />
									Generar Enlace Largo
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									disabled
								>
									<Link2 className="w-4 h-4 mr-2" />
									Generar Enlace Corto
								</Button>
								<Button
									variant="outline"
									className="w-full justify-start"
									disabled
								>
									<QrCode className="w-4 h-4 mr-2" />
									Generar Código QR
								</Button>
							</CardContent>
						</Card>

						{/* Quick Stats */}
						<Card>
							<CardHeader>
								<CardTitle>Información</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between">
									<span className="text-slate-600">Total de Preguntas</span>
									<span>{questions.length}</span>
								</div>
								<Separator />
								<div className="flex justify-between">
									<span className="text-slate-600">Preguntas Obligatorias</span>
									<span>{questions.filter((q) => q.required).length}</span>
								</div>
								<Separator />
								<div className="flex justify-between">
									<span className="text-slate-600">Estado</span>
									<Badge>
										{id ? encuesta?.estado || 'Borrador' : 'Borrador'}
									</Badge>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
