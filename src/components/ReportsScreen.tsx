import {
	ArrowLeft,
	BarChart3,
	Calendar,
	ClipboardList,
	FileSpreadsheet,
	FileText,
	Filter,
	Loader2,
	MessageSquare,
	RefreshCw,
	TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEncuestas } from '../hooks/useEncuestas';
import { useReportes } from '../hooks/useReportes';
import reportesService from '../services/reportes.service';
import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export default function ReportsScreen() {
	const navigate = useNavigate();
	const { encuestas } = useEncuestas();
	const [selectedEncuesta, setSelectedEncuesta] = useState<string>('ALL');
	const [fechaInicio, setFechaInicio] = useState<string>('');
	const [fechaFin, setFechaFin] = useState<string>('');

	const filtros = {
		...(selectedEncuesta &&
			selectedEncuesta !== 'ALL' && { encuesta_id: selectedEncuesta }),
		...(fechaInicio && { fecha_inicio: fechaInicio }),
		...(fechaFin && { fecha_fin: fechaFin }),
	};

	const { estadisticas, isLoading, error, refetch } = useReportes(
		Object.keys(filtros).length > 0 ? filtros : undefined
	);

	// Limpiar logs de debug
	// console.log('Estadísticas recibidas:', estadisticas);

	const handleExportExcel = async () => {
		if (estadisticas.length === 0) {
			toast.error('No hay datos para exportar');
			return;
		}
		try {
			const blob = await reportesService.exportarExcel(
				Object.keys(filtros).length > 0 ? filtros : undefined
			);
			const fecha = new Date().toISOString().split('T')[0];
			reportesService.descargarArchivo(blob, `reporte_${fecha}.xlsx`);
			toast.success('Reporte exportado a Excel exitosamente');
		} catch (error: any) {
			toast.error(error.message || 'Error al exportar a Excel');
		}
	};

	const handleExportPDF = async () => {
		if (estadisticas.length === 0) {
			toast.error('No hay datos para exportar');
			return;
		}
		try {
			const blob = await reportesService.exportarPDF(
				Object.keys(filtros).length > 0 ? filtros : undefined
			);
			const fecha = new Date().toISOString().split('T')[0];
			reportesService.descargarArchivo(blob, `reporte_${fecha}.pdf`);
			toast.success('Reporte exportado a PDF exitosamente');
		} catch (error: any) {
			toast.error(error.message || 'Error al exportar a PDF');
		}
	};

	const handleClearFilters = () => {
		setSelectedEncuesta('ALL');
		setFechaInicio('');
		setFechaFin('');
	};

	const totalRespuestas = estadisticas.reduce(
		(sum, enc) => sum + enc.total_respuestas,
		0
	);
	const totalPreguntas = estadisticas.reduce(
		(sum, enc) => sum + enc.preguntas.length,
		0
	);

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
								<h1 className="text-2xl">Reportes y Análisis</h1>
								<p className="text-slate-600">
									Visualiza y exporta los resultados de las encuestas
								</p>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Filtros */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Filter className="w-5 h-5" />
							Filtros
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-3 gap-4">
							{/* Filtro por encuesta */}
							<div className="space-y-2">
								<Label>Encuesta</Label>
								<Select
									value={selectedEncuesta}
									onValueChange={setSelectedEncuesta}
								>
									<SelectTrigger>
										<SelectValue placeholder="Todas las encuestas" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="ALL">Todas las encuestas</SelectItem>
										{encuestas.map((enc) => (
											<SelectItem key={enc.id_encuesta} value={enc.id_encuesta}>
												{enc.titulo}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Filtro por fecha inicio */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									Fecha Inicio
								</Label>
								<Input
									type="date"
									value={fechaInicio}
									onChange={(e) => setFechaInicio(e.target.value)}
									placeholder="Desde..."
								/>
							</div>

							{/* Filtro por fecha fin */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									Fecha Fin
								</Label>
								<Input
									type="date"
									value={fechaFin}
									onChange={(e) => setFechaFin(e.target.value)}
									placeholder="Hasta..."
								/>
							</div>
						</div>

						{/* Acciones de filtros */}
						<div className="mt-4 flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={handleClearFilters}
								disabled={
									selectedEncuesta === 'ALL' && !fechaInicio && !fechaFin
								}
							>
								Limpiar filtros
							</Button>
							<Button variant="outline" size="sm" onClick={() => refetch()}>
								<RefreshCw className="h-4 w-4 mr-2" />
								Actualizar
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Botones de exportación */}
				<div className="mb-8 flex gap-3 justify-end">
					<Button
						variant="outline"
						onClick={handleExportExcel}
						disabled={isLoading || estadisticas.length === 0}
					>
						<FileSpreadsheet className="w-4 h-4 mr-2" />
						Exportar Excel
					</Button>
					<Button
						variant="outline"
						onClick={handleExportPDF}
						disabled={isLoading || estadisticas.length === 0}
					>
						<FileText className="w-4 h-4 mr-2" />
						Exportar PDF
					</Button>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
					</div>
				) : error ? (
					<Card>
						<CardContent className="py-12 text-center">
							<h3 className="text-lg mb-2 text-red-600">
								Error al cargar datos
							</h3>
							<p className="text-slate-600 mb-4">{error}</p>
							<Button onClick={() => refetch()}>
								<RefreshCw className="h-4 w-4 mr-2" />
								Reintentar
							</Button>
						</CardContent>
					</Card>
				) : estadisticas.length === 0 ? (
					<Card>
						<CardContent className="py-12 text-center">
							<h3 className="text-lg mb-2">No hay datos disponibles</h3>
							<p className="text-slate-600">
								{selectedEncuesta !== 'ALL' || fechaInicio || fechaFin
									? 'No hay respuestas con los filtros seleccionados'
									: 'Selecciona filtros o espera a que haya respuestas'}
							</p>
						</CardContent>
					</Card>
				) : (
					<>
						{/* Resumen Global */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							<Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
								<CardHeader className="pb-3">
									<CardDescription className="flex items-center gap-2">
										<MessageSquare className="h-4 w-4 text-blue-600" />
										Respuestas Totales
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-bold text-blue-600">
										{totalRespuestas}
									</div>
									<div className="flex items-center gap-1 mt-2 text-blue-600">
										<TrendingUp className="w-4 h-4" />
										<span className="text-sm font-medium">
											{estadisticas.length}{' '}
											{estadisticas.length === 1 ? 'encuesta' : 'encuestas'}
										</span>
									</div>
								</CardContent>
							</Card>

							<Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
								<CardHeader className="pb-3">
									<CardDescription className="flex items-center gap-2">
										<ClipboardList className="h-4 w-4 text-purple-600" />
										Total Preguntas
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-bold text-purple-600">
										{totalPreguntas}
									</div>
									<p className="text-purple-600 mt-2 text-sm font-medium">
										En todas las encuestas
									</p>
								</CardContent>
							</Card>

							<Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
								<CardHeader className="pb-3">
									<CardDescription className="flex items-center gap-2">
										<BarChart3 className="h-4 w-4 text-green-600" />
										Promedio por Encuesta
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-4xl font-bold text-green-600">
										{estadisticas.length > 0
											? Math.round(totalRespuestas / estadisticas.length)
											: 0}
									</div>
									<p className="text-green-600 mt-2 text-sm font-medium">
										Respuestas/encuesta
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Resumen por encuesta */}
						{estadisticas.map((encuesta) => (
							<div key={encuesta.encuesta_id} className="mb-8">
								<h2 className="text-xl font-semibold mb-4">
									{encuesta.titulo}
								</h2>

								{/* Tarjetas de resumen */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
									<Card>
										<CardHeader className="pb-3">
											<CardDescription>Total Respuestas</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold">
												{encuesta.total_respuestas}
											</div>
											<div className="flex items-center gap-1 mt-2 text-green-600">
												<TrendingUp className="w-4 h-4" />
												<span className="text-sm">Recibidas</span>
											</div>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-3">
											<CardDescription>Preguntas</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="text-3xl font-bold">
												{encuesta.preguntas.length}
											</div>
											<p className="text-slate-600 mt-2 text-sm">
												En la encuesta
											</p>
										</CardContent>
									</Card>
									<Card>
										<CardHeader className="pb-3">
											<CardDescription>Estado</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="text-lg font-semibold capitalize">
												{'N/A'}
											</div>
											<p className="text-slate-600 mt-2 text-sm">Actual</p>
										</CardContent>
									</Card>
								</div>

								{/* Detalles por pregunta */}
								<Card>
									<CardHeader>
										<CardTitle>Resultados Detallados</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="space-y-8">
											{encuesta.preguntas.map((pregunta, index) => (
												<div key={pregunta.pregunta_id}>
													<h3 className="font-medium mb-4">
														{index + 1}. {pregunta.pregunta_texto}
													</h3>

													{pregunta.respuestas &&
													pregunta.respuestas.length > 0 ? (
														<Table>
															<TableHeader>
																<TableRow>
																	<TableHead>Opción</TableHead>
																	<TableHead>Respuestas</TableHead>
																	<TableHead>Porcentaje</TableHead>
																	<TableHead>Visualización</TableHead>
																</TableRow>
															</TableHeader>
															<TableBody>
																{pregunta.respuestas.map((resp, respIndex) => (
																	<TableRow key={respIndex}>
																		<TableCell>
																			<div className="flex items-center gap-2">
																				<div
																					className="w-3 h-3 rounded-full"
																					style={{
																						backgroundColor:
																							COLORS[respIndex % COLORS.length],
																					}}
																				/>
																				{resp.valor}
																			</div>
																		</TableCell>
																		<TableCell className="font-medium">
																			{resp.frecuencia}
																		</TableCell>
																		<TableCell>
																			{resp.porcentaje.toFixed(1)}%
																		</TableCell>
																		<TableCell className="w-1/3">
																			<Progress value={resp.porcentaje} />
																		</TableCell>
																	</TableRow>
																))}
															</TableBody>
														</Table>
													) : (
														<p className="text-slate-500 italic">
															No hay respuestas para esta pregunta
														</p>
													)}

													{index < encuesta.preguntas.length - 1 && (
														<Separator className="mt-8" />
													)}
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>
						))}
					</>
				)}
			</div>
		</div>
	);
}
