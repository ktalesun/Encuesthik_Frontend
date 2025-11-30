import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Plus, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Copy, 
  Edit, 
  Trash2, 
  QrCode, 
  Link, 
  Users,
  ChartBar,
  MessageSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Switch } from './ui/switch';

interface DashboardScreenProps {
  onNavigate: (screen: 'dashboard' | 'editor' | 'reports') => void;
  onCreateSurvey: () => void;
  onEditSurvey: (survey: any) => void;
  onLogout: () => void;
}

const mockSurveys = [
  {
    id: 1,
    title: 'Satisfacción del Cliente 2024',
    status: 'Activa',
    responses: 245,
    created: '2024-10-15',
    expires: '2024-12-31',
  },
  {
    id: 2,
    title: 'Clima Laboral - Q4',
    status: 'Activa',
    responses: 89,
    created: '2024-11-01',
    expires: '2024-11-30',
  },
  {
    id: 3,
    title: 'Evaluación de Producto',
    status: 'Finalizada',
    responses: 412,
    created: '2024-09-01',
    expires: '2024-10-31',
  },
];

const mockUsers = [
  { id: 1, name: 'María González', email: 'maria@empresa.com', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'Carlos Ramírez', email: 'carlos@empresa.com', role: 'Analista', status: 'Activo' },
  { id: 3, name: 'Ana Torres', email: 'ana@empresa.com', role: 'Creador', status: 'Inactivo' },
];

export default function DashboardScreen({ onNavigate, onCreateSurvey, onEditSurvey, onLogout }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState('surveys');

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
                <p className="text-slate-600">Empresa Demo S.A.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout}>
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
                <div className="text-3xl">12</div>
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
                <div className="text-3xl">5</div>
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
                <div className="text-3xl">1,247</div>
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
                <div className="text-3xl">8</div>
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
                  <Button variant="outline" onClick={() => onNavigate('reports')}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Reportes
                  </Button>
                  <Button onClick={onCreateSurvey}>
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
            {mockSurveys.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{survey.title}</CardTitle>
                        <Badge variant={survey.status === 'Activa' ? 'default' : 'secondary'}>
                          {survey.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Creada: {survey.created} • Expira: {survey.expires} • {survey.responses} respuestas
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Opciones
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditSurvey(survey)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link className="w-4 h-4 mr-2" />
                          Copiar Enlace
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <QrCode className="w-4 h-4 mr-2" />
                          Generar QR
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditSurvey(survey)}>
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
            ))}
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
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={user.status === 'Activo'} />
                            <span>{user.status}</span>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
