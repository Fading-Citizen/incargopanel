'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CogIcon, UserIcon, BellIcon, ShieldCheckIcon, MapPinIcon, TruckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('company')

  const tabs = [
    { id: 'company', name: 'Empresa', icon: BuildingOfficeIcon },
    { id: 'users', name: 'Usuarios', icon: UserIcon },
    { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
    { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
    { id: 'locations', name: 'Ubicaciones', icon: MapPinIcon },
    { id: 'vehicles', name: 'Tipos de Vehículo', icon: TruckIcon },
  ]

  const users = [
    { id: '1', name: 'Juan Carlos Admin', email: 'admin@incargo.co', role: 'admin', status: 'active', lastLogin: '2024-08-29 09:30' },
    { id: '2', name: 'María Operaciones', email: 'm.operaciones@incargo.co', role: 'operator', status: 'active', lastLogin: '2024-08-29 08:15' },
    { id: '3', name: 'Carlos Supervisor', email: 'c.supervisor@incargo.co', role: 'operator', status: 'active', lastLogin: '2024-08-28 16:45' },
    { id: '4', name: 'Ana Reportes', email: 'a.reportes@incargo.co', role: 'viewer', status: 'inactive', lastLogin: '2024-08-25 14:20' },
  ]

  const locations = [
    { id: '1', name: 'Terminal Principal Bogotá', address: 'Calle 80 # 69-15', city: 'Bogotá', type: 'terminal', status: 'active' },
    { id: '2', name: 'Bodega Central Medellín', address: 'Carrera 50 # 8-20', city: 'Medellín', type: 'warehouse', status: 'active' },
    { id: '3', name: 'Puerto Buenaventura', address: 'Zona Portuaria Km 5', city: 'Buenaventura', type: 'port', status: 'active' },
    { id: '4', name: 'Centro Distribución Cali', address: 'Calle 70 # 23-45', city: 'Cali', type: 'distribution', status: 'active' },
    { id: '5', name: 'Taller Mantenimiento', address: 'Autopista Norte Km 15', city: 'Bogotá', type: 'maintenance', status: 'maintenance' },
  ]

  const vehicleTypes = [
    { id: '1', name: 'Turbo', capacity: '8 Ton', description: 'Vehículos ligeros para entregas rápidas', active: true },
    { id: '2', name: 'Sencillo', capacity: '5 Ton', description: 'Vehículos de una sola unidad', active: true },
    { id: '3', name: 'Dobletroque', capacity: '28 Ton', description: 'Camiones de doble eje trasero', active: true },
    { id: '4', name: 'Mini-mula 2 Ejes', capacity: '12 Ton', description: 'Unidades compactas de dos ejes', active: true },
    { id: '5', name: 'Mini-mula 3 Ejes', capacity: '18 Ton', description: 'Mayor capacidad con maniobrabilidad', active: true },
    { id: '6', name: 'Mula 2 Ejes', capacity: '24 Ton', description: 'Camiones especializados', active: true },
    { id: '7', name: 'Mula 3 Ejes', capacity: '34 Ton', description: 'Máxima capacidad de carga', active: true },
    { id: '8', name: 'Refrigerado', capacity: '15 Ton', description: 'Control de temperatura 2-8°C', active: true },
    { id: '9', name: 'Plataforma Abierta', capacity: '25 Ton', description: 'Para cargas voluminosas', active: true },
    { id: '10', name: 'Contenedor Especial', capacity: '30 Ton', description: 'Cargas delicadas o irregulares', active: false },
  ]

  const getLocationIcon = (type: string) => {
    switch(type) {
      case 'terminal': return '🚛'
      case 'warehouse': return '🏬'
      case 'port': return '⚓'
      case 'distribution': return '📦'
      case 'maintenance': return '🔧'
      default: return '📍'
    }
  }

  const getLocationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'terminal': 'Terminal',
      'warehouse': 'Bodega',
      'port': 'Puerto',
      'distribution': 'Centro de Distribución',
      'maintenance': 'Taller'
    }
    return labels[type] || type
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'admin': 'Administrador',
      'operator': 'Operador',
      'viewer': 'Visualizador'
    }
    return labels[role] || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-red-100 text-red-800',
      'operator': 'bg-blue-100 text-blue-800',
      'viewer': 'bg-gray-100 text-gray-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-500 mt-1">
            Administra la configuración general de INCARGO
          </p>
        </div>

        {/* Tabs Navigation */}
        <Card>
          <CardHeader>
            <div className="flex space-x-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Company Settings */}
        {activeTab === 'company' && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                    <Input defaultValue="INCARGO" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIT</label>
                    <Input defaultValue="900123456-7" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Principal</label>
                    <Input defaultValue="+57 321 562 5901" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
                    <Input defaultValue="operaciones@incargo.co" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Principal</label>
                    <Input defaultValue="Carrera 15 # 93-07, Bogotá D.C." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
                    <Input defaultValue="Tu socio confiable en soluciones de Logística y transporte" />
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Gestión de Usuarios</CardTitle>
                  <Button className="bg-green-600 hover:bg-green-700">Nuevo Usuario</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Último Acceso</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getRoleColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {user.status === 'active' ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{user.lastLogin}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Editar</Button>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                {user.status === 'active' ? 'Desactivar' : 'Activar'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Servicios Completados</h4>
                      <p className="text-sm text-gray-500">Notificar cuando un servicio se marca como completado</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Vehículos en Mantenimiento</h4>
                      <p className="text-sm text-gray-500">Alertas cuando un vehículo requiere mantenimiento</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Documentos por Vencer</h4>
                      <p className="text-sm text-gray-500">SOAT y revisión técnica próximos a vencer (30 días)</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Nuevas Cotizaciones</h4>
                      <p className="text-sm text-gray-500">Notificar cuando se recibe una nueva solicitud de cotización</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Reportes Semanales</h4>
                      <p className="text-sm text-gray-500">Enviar resumen semanal de operaciones por email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">Guardar Configuración</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Locations Management */}
        {activeTab === 'locations' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ubicaciones y Sedes</CardTitle>
                  <Button className="bg-green-600 hover:bg-green-700">Nueva Ubicación</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {locations.map((location) => (
                    <Card key={location.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getLocationIcon(location.type)}</span>
                          <div>
                            <CardTitle className="text-base">{location.name}</CardTitle>
                            <p className="text-sm text-gray-500">{getLocationTypeLabel(location.type)}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">{location.address}</p>
                          <p className="text-sm font-medium text-gray-900">{location.city}</p>
                          <Badge className={location.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {location.status === 'active' ? 'Operativo' : 'Mantenimiento'}
                          </Badge>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">Editar</Button>
                          <Button variant="outline" size="sm" className="flex-1">Mapa</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vehicle Types */}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tipos de Vehículos</CardTitle>
                  <Button className="bg-green-600 hover:bg-green-700">Nuevo Tipo</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehicleTypes.map((vehicleType) => (
                    <div key={vehicleType.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-gray-900">{vehicleType.name}</h4>
                          <Badge className={vehicleType.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {vehicleType.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{vehicleType.description}</p>
                        <p className="text-sm text-gray-500">Capacidad máxima: {vehicleType.capacity}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={vehicleType.active ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}
                        >
                          {vehicleType.active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Sesión (minutos)</label>
                    <Input defaultValue="60" type="number" className="w-32" />
                    <p className="text-sm text-gray-500 mt-1">Tiempo antes de cerrar sesión automáticamente</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intentos de Login Máximos</label>
                    <Input defaultValue="5" type="number" className="w-32" />
                    <p className="text-sm text-gray-500 mt-1">Número de intentos antes de bloquear cuenta</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Autenticación de Dos Factores</h4>
                      <p className="text-sm text-gray-500">Requerir verificación adicional para administradores</p>
                    </div>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Log de Actividades</h4>
                      <p className="text-sm text-gray-500">Registrar todas las acciones de usuarios</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  </div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">Actualizar Seguridad</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
