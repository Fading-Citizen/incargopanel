'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { CubeIcon, PlusIcon, MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Container {
  id: string
  containerNumber: string
  type: string
  status: string
  currentLocation: string
  client?: string
  service?: string
  lastInspection: string
  nextInspection: string
  dimensions: string
  maxWeight: number
}

export default function ContenedoresPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Mock data - en producción esto vendría de Supabase
  const containers: Container[] = [
    {
      id: '1',
      containerNumber: 'MSKU-123456-7',
      type: '40ft_hc',
      status: 'in_use',
      currentLocation: 'Terminal Bogotá',
      client: 'Almacenes Éxito S.A.',
      service: 'Distribución productos refrigerados',
      lastInspection: '2024-08-15',
      nextInspection: '2024-11-15',
      dimensions: '12.19 x 2.44 x 2.90 m',
      maxWeight: 28.6
    },
    {
      id: '2',
      containerNumber: 'TCLU-789012-3',
      type: '20ft',
      status: 'available',
      currentLocation: 'Puerto de Cartagena',
      lastInspection: '2024-07-20',
      nextInspection: '2024-10-20',
      dimensions: '6.06 x 2.44 x 2.59 m',
      maxWeight: 21.6
    },
    {
      id: '3',
      containerNumber: 'GESU-345678-9',
      type: '40ft',
      status: 'transit',
      currentLocation: 'En ruta Medellín - Cali',
      client: 'Bavaria S.A.',
      service: 'Transporte de bebidas',
      lastInspection: '2024-08-01',
      nextInspection: '2024-11-01',
      dimensions: '12.19 x 2.44 x 2.59 m',
      maxWeight: 26.7
    },
    {
      id: '4',
      containerNumber: 'HJMU-901234-5',
      type: 'special',
      status: 'maintenance',
      currentLocation: 'Taller Especializado',
      lastInspection: '2024-08-25',
      nextInspection: '2024-09-25',
      dimensions: 'Dimensiones variables',
      maxWeight: 30.0
    },
    {
      id: '5',
      containerNumber: 'PONU-567890-1',
      type: '20ft',
      status: 'available',
      currentLocation: 'Terminal Buenaventura',
      lastInspection: '2024-08-10',
      nextInspection: '2024-11-10',
      dimensions: '6.06 x 2.44 x 2.59 m',
      maxWeight: 21.6
    },
    {
      id: '6',
      containerNumber: 'OOLU-234567-8',
      type: '40ft_hc',
      status: 'in_use',
      currentLocation: 'Zona Franca Bogotá',
      client: 'Tecnoquímicas S.A.',
      service: 'Almacenamiento productos farmacéuticos',
      lastInspection: '2024-08-05',
      nextInspection: '2024-11-05',
      dimensions: '12.19 x 2.44 x 2.90 m',
      maxWeight: 28.6
    }
  ]

  const filteredContainers = containers.filter(container => {
    const matchesSearch = 
      container.containerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (container.client && container.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (container.service && container.service.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || container.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statusCounts = containers.reduce((acc, container) => {
    acc[container.status] = (acc[container.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getContainerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      '20ft': '20 pies estándar',
      '40ft': '40 pies estándar', 
      '40ft_hc': '40 pies High Cube',
      'special': 'Especial'
    }
    return labels[type] || type
  }

  const getContainerIcon = (type: string) => {
    switch(type) {
      case '20ft': return '📦'
      case '40ft': return '📦📦'
      case '40ft_hc': return '📦📦⬆️'
      case 'special': return '🔧📦'
      default: return '📦'
    }
  }

  const isInspectionDue = (nextInspection: string) => {
    const dueDate = new Date(nextInspection)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    return dueDate <= thirtyDaysFromNow
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Contenedores</h1>
            <p className="text-gray-500 mt-1">
              Control y seguimiento de contenedores especializados
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Registrar Contenedor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Contenedores</CardTitle>
              <CubeIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{containers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Disponibles</CardTitle>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.available || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Uso</CardTitle>
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.in_use || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Tránsito</CardTitle>
              <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{statusCounts.transit || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mantenimiento</CardTitle>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.maintenance || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número, ubicación, cliente o servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="available">Disponible</option>
                <option value="in_use">En Uso</option>
                <option value="transit">En Tránsito</option>
                <option value="maintenance">Mantenimiento</option>
              </select>
            </div>
          </CardHeader>
        </Card>

        {/* Containers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredContainers.map((container) => (
            <Card key={container.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getContainerIcon(container.type)}</span>
                    <div>
                      <CardTitle className="text-lg">{container.containerNumber}</CardTitle>
                      <p className="text-sm text-gray-500">{getContainerTypeLabel(container.type)}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(container.status)}>
                    {getStatusLabel(container.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{container.currentLocation}</span>
                </div>

                {/* Client and Service */}
                {container.client && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{container.client}</p>
                    {container.service && (
                      <p className="text-xs text-gray-500">{container.service}</p>
                    )}
                  </div>
                )}

                {/* Specifications */}
                <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dimensiones:</span>
                    <span className="text-gray-900">{container.dimensions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Peso máximo:</span>
                    <span className="text-gray-900">{container.maxWeight} Ton</span>
                  </div>
                </div>

                {/* Inspection Status */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Última inspección:</span>
                    <span className="text-gray-900">{formatDate(container.lastInspection)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Próxima inspección:</span>
                    <span className={`${isInspectionDue(container.nextInspection) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {formatDate(container.nextInspection)}
                    </span>
                  </div>
                  {isInspectionDue(container.nextInspection) && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      ⚠️ Inspección próxima a vencer
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalles
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Historial
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
