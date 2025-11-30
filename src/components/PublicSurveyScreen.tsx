import { AlertCircle, ChartBar, CheckCircle2, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import encuestasService from '../services/encuestas.service';
import respuestasService from '../services/respuestas.service';
import { Encuesta, RespuestaItem } from '../types';
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';

export default function PublicSurveyScreen() {
	const { empresaId, encuestaId } = useParams<{
		empresaId: string;
		encuestaId: string;
	}>();
	const [encuesta, setEncuesta] = useState<Encuesta | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [respuestas, setRespuestas] = useState<Record<string, any>>({});
	const [terceros, setTerceros] = useState({
		nombre: '',
		email: '',
		telefono: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		if (!empresaId || !encuestaId) return;

		const fetchEncuesta = async () => {
			try {
				setIsLoading(true);
				const data = await encuestasService.obtenerPublica(
					empresaId,
					encuestaId
				);
				setEncuesta(data);
			} catch (err: any) {
				setError(err.message || 'Error al cargar la encuesta');
			} finally {
				setIsLoading(false);
			}
		};

		fetchEncuesta();
	}, [empresaId, encuestaId]);

	const handleRespuestaChange = (preguntaId: string, value: any) => {
		setRespuestas({ ...respuestas, [preguntaId]: value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!encuesta) return;

		// Validar preguntas requeridas
		const preguntasRequeridas =
			encuesta.preguntas?.filter((p) => p.requerida) || [];
		const faltantes = preguntasRequeridas.filter(
			(p) => !respuestas[p.id_pregunta]
		);

		if (faltantes.length > 0) {
			toast.error('Por favor responde todas las preguntas obligatorias');
			return;
		}

		try {
			setIsSubmitting(true);

			const respuestasArray: RespuestaItem[] = Object.entries(respuestas).map(
				([pregunta_id, respuesta]) => ({
					pregunta_id,
					respuesta,
				})
			);

			await respuestasService.enviar({
				encuesta_id: encuesta.id_encuesta,
				respuestas: respuestasArray,
				terceros: terceros.nombre || terceros.email ? terceros : undefined,
			});

			setIsSubmitted(true);
			toast.success('¡Respuesta enviada exitosamente!');
		} catch (error: any) {
			toast.error(error.message || 'Error al enviar la respuesta');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
					<p className="text-slate-600">Cargando encuesta...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
				<Card className="max-w-md w-full">
					<CardContent className="pt-6 text-center">
						<AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
						<h2 className="text-xl mb-2">Error</h2>
						<p className="text-slate-600">{error}</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (isSubmitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
				<Card className="max-w-md w-full">
					<CardContent className="pt-6 text-center">
						<CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
						<h2 className="text-2xl mb-2">¡Gracias por tu respuesta!</h2>
						<p className="text-slate-600">
							Tu opinión es muy importante para nosotros. Hemos recibido tus
							respuestas correctamente.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 py-12 px-4">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-3 mb-4">
						<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
							<ChartBar className="w-7 h-7 text-white" />
						</div>
						<h1 className="text-3xl">Encues-Think</h1>
					</div>
				</div>

				{/* Survey Form */}
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">{encuesta?.titulo}</CardTitle>
						<CardDescription>{encuesta?.descripcion}</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Datos del participante (opcional) */}
							<div className="space-y-4 pb-6 border-b">
								<h3 className="font-semibold">
									Información de contacto (opcional)
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="nombre">Nombre</Label>
										<Input
											id="nombre"
											value={terceros.nombre}
											onChange={(e) =>
												setTerceros({ ...terceros, nombre: e.target.value })
											}
											placeholder="Tu nombre"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											value={terceros.email}
											onChange={(e) =>
												setTerceros({ ...terceros, email: e.target.value })
											}
											placeholder="tu@email.com"
										/>
									</div>
								</div>
							</div>

							{/* Preguntas */}
							{encuesta?.preguntas?.map((pregunta, index) => (
								<div key={pregunta.id_pregunta} className="space-y-3">
									<Label className="text-base">
										{index + 1}. {pregunta.texto}
										{pregunta.requerida && (
											<span className="text-red-600 ml-1">*</span>
										)}
									</Label>

									{/* Pregunta de opción única */}
									{pregunta.tipo === 'opcion_unica' && (
										<RadioGroup
											value={respuestas[pregunta.id_pregunta]}
											onValueChange={(value: string) =>
												handleRespuestaChange(pregunta.id_pregunta, value)
											}
										>
											{pregunta.opciones?.map((opcion) => (
												<div
													key={opcion}
													className="flex items-center space-x-2"
												>
													<RadioGroupItem
														value={opcion}
														id={`${pregunta.id_pregunta}-${opcion}`}
													/>
													<Label htmlFor={`${pregunta.id_pregunta}-${opcion}`}>
														{opcion}
													</Label>
												</div>
											))}
										</RadioGroup>
									)}

									{/* Pregunta de texto */}
									{pregunta.tipo === 'texto' && (
										<Textarea
											value={respuestas[pregunta.id_pregunta] || ''}
											onChange={(e) =>
												handleRespuestaChange(
													pregunta.id_pregunta,
													e.target.value
												)
											}
											placeholder="Escribe tu respuesta aquí..."
											rows={3}
										/>
									)}

									{/* Pregunta sí/no */}
									{pregunta.tipo === 'si_no' && (
										<RadioGroup
											value={respuestas[pregunta.id_pregunta]?.toString()}
											onValueChange={(value: string) =>
												handleRespuestaChange(
													pregunta.id_pregunta,
													value === 'true'
												)
											}
										>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="true"
													id={`${pregunta.id_pregunta}-si`}
												/>
												<Label htmlFor={`${pregunta.id_pregunta}-si`}>Sí</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem
													value="false"
													id={`${pregunta.id_pregunta}-no`}
												/>
												<Label htmlFor={`${pregunta.id_pregunta}-no`}>No</Label>
											</div>
										</RadioGroup>
									)}

									{/* Pregunta numérica */}
									{pregunta.tipo === 'numerica' && (
										<Input
											type="number"
											min={pregunta.rango?.min}
											max={pregunta.rango?.max}
											value={respuestas[pregunta.id_pregunta] || ''}
											onChange={(e) =>
												handleRespuestaChange(
													pregunta.id_pregunta,
													Number(e.target.value)
												)
											}
											placeholder={`Entre ${pregunta.rango?.min} y ${pregunta.rango?.max}`}
										/>
									)}
								</div>
							))}

							<div className="pt-6">
								<Button
									type="submit"
									className="w-full"
									size="lg"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											Enviando...
										</>
									) : (
										'Enviar Respuesta'
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
