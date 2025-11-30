import  React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Download, FileSpreadsheet, FileText, Filter, TrendingUp } from 'lucide-react';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ReportsScreenProps {
  onNavigate: (screen: 'dashboard' | 'editor' | 'reports') => void;
}

const mockData = [
  { name: 'Excelente', value: 145, percentage: 59 },
  { name: 'Bueno', value: 68, percentage: 28 },
  { name: 'Regular', value: 24, percentage: 10 },
  { name: 'Malo', value: 8, percentage: 3 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const timelineData = [
  { date: '15 Oct', responses: 23 },
  { date: '20 Oct', responses: 45 },
  { date: '25 Oct', responses: 67 },
  { date: '01 Nov', responses: 89 },
  { date: '05 Nov', responses: 110 },
  { date: '10 Nov', responses: 245 },
];

export default function ReportsScreen({ onNavigate }: ReportsScreenProps) {
  const [selectedCompany, setSelectedCompany] = useState('empresa1');
  const [selectedSurvey, setSelectedSurvey] = useState('survey1');

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
                <h1 className="text-2xl">Reportes y Análisis</h1>
                <p className="text-slate-600">Visualiza y exporta los resultados de las encuestas</p>
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
                <Label>Empresa</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empresa1">Empresa Demo S.A.</SelectItem>
                    <SelectItem value="empresa2">Corporación XYZ</SelectItem>
                    <SelectItem value="empresa3">Tech Solutions Ltd.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Encuesta</Label>
                <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="survey1">Satisfacción del Cliente 2024</SelectItem>
                    <SelectItem value="survey2">Clima Laboral - Q4</SelectItem>
                    <SelectItem value="survey3">Evaluación de Producto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exportar Resultados</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Respuestas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">245</div>
              <div className="flex items-center gap-1 mt-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12% vs anterior</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tasa de Finalización</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">87%</div>
              <Progress value={87} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Tiempo Promedio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl">3m 45s</div>
              <p className="text-slate-600 mt-2">Por respuesta</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Satisfacción Global</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-green-600">4.2/5</div>
              <p className="text-slate-600 mt-2">⭐⭐⭐⭐</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Respuestas</CardTitle>
              <CardDescription>¿Cómo calificaría nuestro servicio?</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Respuestas</CardTitle>
              <CardDescription>Respuestas acumuladas en el tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="responses" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Resultados Detallados por Pregunta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Question 1 */}
              <div>
                <h3 className="mb-4">1. ¿Cómo calificaría nuestro servicio?</h3>
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
                    {mockData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index] }}
                            />
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell>{item.value}</TableCell>
                        <TableCell>{item.percentage}%</TableCell>
                        <TableCell className="w-1/3">
                          <Progress value={item.percentage} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              {/* Question 2 */}
              <div>
                <h3 className="mb-4">2. ¿Qué podríamos mejorar?</h3>
                <div className="space-y-2 bg-slate-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    "Mejorar los tiempos de respuesta en el servicio al cliente"
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    "La plataforma web podría ser más intuitiva"
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    "Ampliar el horario de atención"
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    "Ofrecer más opciones de pago"
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    "Mejorar la aplicación móvil"
                  </div>
                </div>
                <div className="mt-2 text-slate-600">
                  Total de respuestas de texto: 187
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Opciones de Exportación</CardTitle>
            <CardDescription>Descarga los resultados en diferentes formatos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileSpreadsheet className="w-6 h-6" />
                <span>Exportar a Excel</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span>Exportar a PDF</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="w-6 h-6" />
                <span>Exportar a CSV</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
