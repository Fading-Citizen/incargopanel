'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ServiceModal } from '@/components/modals'
import { getStatusColor, getStatusLabel, formatCurrency, formatDate } from '@/lib/utils'
import { ClipboardDocumentListIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useServices } from '@/hooks/useServices'
import { useClients } from '@/hooks/useClients'

export default function ServiciosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showServiceModal, setShowServiceModal] = useState(false)
  
  const { services, loading, error, createService, updateService, deleteService } = useServices()
  const { clients } = useClients()

  // Función para manejar la creación de servicios
  const handleCreateService = async (serviceData: any) => {
    await createService(serviceData)
    setShowServiceModal(false)
  }
  
  // Filtrar servicios según búsqueda y estado
  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === '' || 
      service.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.destino.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.carga_tipo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || service.estado === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Función para obtener nombre del cliente
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client?.nombre_empresa || 'Cliente no encontrado'
  }

  // Función para mapear estados a español
  const getStatusInSpanish = (status: string) => {
    const statusMap = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'cancelado': 'Cancelado'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  // Función para obtener color del estado
  const getServiceStatusColor = (status: string) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'en_proceso': 'bg-blue-100 text-blue-800',
      'completado': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Función para obtener el conteo de estados
  const statusCounts = services.reduce((acc, service) => {
    acc[service.estado] = (acc[service.estado] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalValue = services.reduce((sum, service) => sum + service.valor_total, 0)

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'transporte_carga': 'Transporte de Carga',
      'transporte_pasajeros': 'Transporte de Pasajeros',
      'almacenamiento': 'Almacenamiento',
      'alquiler_vehiculos': 'Alquiler de Vehículos',
      'proyectos_logisticos': 'Proyectos Logísticos'
    }
    return labels[type] || type
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Servicios</h1>
            <p className="text-gray-500 mt-1">
              Administra todos los servicios y proyectos logísticos
            </p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowServiceModal(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Servicios</CardTitle>
              <ClipboardDocumentListIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{services.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Progreso</CardTitle>
              <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{statusCounts.in_progress || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmados</CardTitle>
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.confirmed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completados</CardTitle>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
              <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{formatCurrency(totalValue)}</div>
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
                  placeholder="Buscar por cliente, título, origen, destino o tipo de carga..."
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
                <option value="quote">Cotización</option>
                <option value="confirmed">Confirmado</option>
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </CardHeader>
        </Card>

        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente / Proyecto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ruta</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Carga</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Prioridad</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Fechas</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{getClientName(service.cliente_id)}</div>
                          <div className="text-sm text-gray-500">{service.descripcion}</div>
                          {service.vehiculo_id && (
                            <div className="text-xs text-blue-600">Vehículo: {service.vehiculo?.placa || service.vehiculo_id}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{getServiceTypeLabel(service.tipo_servicio)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{service.origen}</div>
                          <div className="text-gray-400">↓</div>
                          <div className="text-gray-900">{service.destino}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm text-gray-900">{service.carga_tipo}</div>
                          <div className="text-xs text-gray-500">{service.peso_kg} Kg</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getServiceStatusColor(service.estado)}>
                          {getStatusInSpanish(service.estado)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">{service.conductor}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-green-600">{formatCurrency(service.valor_total)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs">
                          <div className="text-gray-900">Inicio: {formatDate(service.fecha_inicio)}</div>
                          <div className="text-gray-900">Fin: {formatDate(service.fecha_estimada)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            Editar
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

      {/* Service Modal */}
      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onSubmit={handleCreateService}
        mode="create"
      />
    </DashboardLayout>
  )
}
