import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  Link2, 
  QrCode, 
  Save,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface SurveyEditorScreenProps {
  onNavigate: (screen: 'dashboard' | 'editor' | 'reports') => void;
  survey?: any;
}

interface Question {
  id: number;
  type: string;
  text: string;
  required: boolean;
  options: string[];
}

export default function SurveyEditorScreen({ onNavigate, survey }: SurveyEditorScreenProps) {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: 'multiple-choice',
      text: '¿Cómo calificaría nuestro servicio?',
      required: true,
      options: ['Excelente', 'Bueno', 'Regular', 'Malo'],
    },
    {
      id: 2,
      type: 'text',
      text: '¿Qué podríamos mejorar?',
      required: false,
      options: [],
    },
  ]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      type: 'multiple-choice',
      text: 'Nueva pregunta',
      required: false,
      options: ['Opción 1', 'Opción 2'],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: [...q.options, `Opción ${q.options.length + 1}`] }
        : q
    ));
  };

  const removeOption = (questionId: number, optionIndex: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, options: q.options.filter((_, i) => i !== optionIndex) }
        : q
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl">
                  {survey ? 'Editar Encuesta' : 'Nueva Encuesta'}
                </h1>
                <p className="text-slate-600">Empresa Demo S.A.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Guardar
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
                    defaultValue={survey?.title}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="survey-description">Descripción</Label>
                  <Textarea 
                    id="survey-description" 
                    placeholder="Describe el propósito de esta encuesta..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Fecha de Inicio</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Fecha de Finalización</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <GripVertical className="w-5 h-5 text-slate-400 mt-1 cursor-move" />
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Pregunta {index + 1}</span>
                            {question.required && (
                              <Badge variant="secondary">Obligatoria</Badge>
                            )}
                          </div>
                          <Input 
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                            placeholder="Escribe tu pregunta aquí"
                          />
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
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
                        onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Opción Múltiple</SelectItem>
                          <SelectItem value="checkbox">Casillas de Verificación</SelectItem>
                          <SelectItem value="text">Texto Corto</SelectItem>
                          <SelectItem value="paragraph">Párrafo</SelectItem>
                          <SelectItem value="rating">Escala de Valoración</SelectItem>
                          <SelectItem value="date">Fecha</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(question.type === 'multiple-choice' || question.type === 'checkbox') && (
                      <div className="space-y-2">
                        <Label>Opciones de Respuesta</Label>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <Input 
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...question.options];
                                newOptions[optIndex] = e.target.value;
                                updateQuestion(question.id, 'options', newOptions);
                              }}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeOption(question.id, optIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addOption(question.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Opción
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={question.required}
                        onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
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
                <p className="text-slate-600">
                  Las respuestas enviadas por WhatsApp se integrarán automáticamente con la base de datos
                </p>
              </CardContent>
            </Card>

            {/* Links & QR */}
            <Card>
              <CardHeader>
                <CardTitle>Enlaces y Compartir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Link2 className="w-4 h-4 mr-2" />
                  Generar Enlace Largo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Link2 className="w-4 h-4 mr-2" />
                  Generar Enlace Corto
                </Button>
                <Button variant="outline" className="w-full justify-start">
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
                  <span>{questions.filter(q => q.required).length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-600">Estado</span>
                  <Badge>Borrador</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
