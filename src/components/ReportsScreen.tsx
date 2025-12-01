import {
	ArrowLeft,
	FileSpreadsheet,
	FileText,
	Filter,
	Loader2,
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
	const [selectedEncuesta, setSelectedEncuesta] = useState<string>('all');

	const { estadisticas, isLoading } = useReportes(
		selectedEncuesta && selectedEncuesta !== 'all'
			? { encuesta_id: selectedEncuesta }
			: undefined
	);

	// Debug: ver qué datos estamos recibiendo
	console.log('Estadísticas recibidas:', estadisticas);

	const handleExportExcel = async () => {
		try {
			const blob = await reportesService.exportarExcel(
				selectedEncuesta && selectedEncuesta !== 'all'
					? { encuesta_id: selectedEncuesta }
					: undefined
			);
			const fecha = new Date().toISOString().split('T')[0];
			reportesService.descargarArchivo(blob, `reporte_${fecha}.xlsx`);
			toast.success('Reporte exportado a Excel exitosamente');
		} catch (error: any) {
			toast.error(error.message || 'Error al exportar a Excel');
		}
	};

	const handleExportPDF = async () => {
		try {
			const blob = await reportesService.exportarPDF(
				selectedEncuesta && selectedEncuesta !== 'all'
					? { encuesta_id: selectedEncuesta }
					: undefined
			);
			const fecha = new Date().toISOString().split('T')[0];
			reportesService.descargarArchivo(blob, `reporte_${fecha}.pdf`);
			toast.success('Reporte exportado a PDF exitosamente');
		} catch (error: any) {
			toast.error(error.message || 'Error al exportar a PDF');
		}
	};

	const encuestaActual =
		estadisticas && estadisticas.length > 0 ? estadisticas[0] : null;

	console.log('Encuesta actual:', encuestaActual);

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
				{/* Filters */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Filter className="w-5 h-5" />
							Filtros
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label>Encuesta</Label>
								<Select
									value={selectedEncuesta}
									onValueChange={setSelectedEncuesta}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona una encuesta" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todas las encuestas</SelectItem>
										{encuestas.map((enc) => (
											<SelectItem key={enc.id_encuesta} value={enc.id_encuesta}>
												{enc.titulo}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2 md:col-span-2">
								<Label>Exportar Resultados</Label>
								<div className="flex gap-2">
									<Button
										variant="outline"
										className="flex-1"
										onClick={handleExportExcel}
									>
										<FileSpreadsheet className="w-4 h-4 mr-2" />
										Excel
									</Button>
									<Button
										variant="outline"
										className="flex-1"
										onClick={handleExportPDF}
									>
										<FileText className="w-4 h-4 mr-2" />
										PDF
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
					</div>
				) : !encuestaActual ? (
					<Card>
						<CardContent className="py-12 text-center">
							<h3 className="text-lg mb-2">No hay datos disponibles</h3>
							<p className="text-slate-600">
								Selecciona una encuesta o espera a que haya respuestas
							</p>
						</CardContent>
					</Card>
				) : (
					<>
						{/* Summary Cards */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
							<Card>
								<CardHeader className="pb-3">
									<CardDescription>Total Respuestas</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-3xl">
										{encuestaActual.total_respuestas}
									</div>
									<div className="flex items-center gap-1 mt-2 text-green-600">
										<TrendingUp className="w-4 h-4" />
										<span>Activa</span>
									</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-3">
									<CardDescription>Tasa de Finalización</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-3xl">-</div>
									<Progress value={0} className="mt-2" />
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-3">
									<CardDescription>Tiempo Promedio</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-3xl">-</div>
									<p className="text-slate-600 mt-2">Por respuesta</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-3">
									<CardDescription>Preguntas</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="text-3xl">
										{encuestaActual.preguntas.length}
									</div>
									<p className="text-slate-600 mt-2">Total</p>
								</CardContent>
							</Card>
						</div>

						{/* Detailed Results */}
						<Card>
							<CardHeader>
								<CardTitle>
									Resultados Detallados - {encuestaActual.titulo}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-8">
									{encuestaActual.preguntas.map((pregunta, index) => {
										console.log(`Pregunta ${index + 1}:`, pregunta);
										return (
											<div key={pregunta.pregunta_id}>
												<h3 className="mb-4">
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
																	<TableCell>{resp.frecuencia}</TableCell>
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

												{index < encuestaActual.preguntas.length - 1 && (
													<Separator className="mt-8" />
												)}
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>

						{/* Export Options */}
						<Card className="mt-8">
							<CardHeader>
								<CardTitle>Opciones de Exportación</CardTitle>
								<CardDescription>
									Descarga los resultados en diferentes formatos
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid md:grid-cols-2 gap-4">
									<Button
										variant="outline"
										className="h-20 flex-col gap-2"
										onClick={handleExportExcel}
									>
										<FileSpreadsheet className="w-6 h-6" />
										<span>Exportar a Excel</span>
									</Button>
									<Button
										variant="outline"
										className="h-20 flex-col gap-2"
										onClick={handleExportPDF}
									>
										<FileText className="w-6 h-6" />
										<span>Exportar a PDF</span>
									</Button>
								</div>
							</CardContent>
						</Card>
					</>
				)}
			</div>
		</div>
	);
}
