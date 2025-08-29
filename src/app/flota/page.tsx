'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { VehicleModal } from '@/components/modals'
import { useVehicles } from '@/hooks'
import { 
  TruckIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function FlotaPage() {
  const { vehicles, loading, error, createVehicle, updateVehicle, deleteVehicle } = useVehicles()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<any>(null)

  const handleCreateVehicle = async (data: any) => {
    await createVehicle(data)
    setIsModalOpen(false)
  }

  const handleEditVehicle = async (data: any) => {
    await updateVehicle({ ...data, id: editingVehicle.id })
    setEditingVehicle(null)
  }

  const handleDeleteVehicle = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      await deleteVehicle(id)
    }
  }

  const openEditModal = (vehicle: any) => {
    setEditingVehicle(vehicle)
  }

  const closeEditModal = () => {
    setEditingVehicle(null)
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || vehicle.estado === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'disponible': 'bg-green-100 text-green-800',
      'en_ruta': 'bg-blue-100 text-blue-800',
      'mantenimiento': 'bg-yellow-100 text-yellow-800',
      'fuera_servicio': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'disponible': 'Disponible',
      'en_ruta': 'En Ruta',
      'mantenimiento': 'Mantenimiento',
      'fuera_servicio': 'Fuera de Servicio'
    }
    return labels[status] || status
  }

  const isDocumentExpiring = (date: string, days: number = 30) => {
    const expiryDate = new Date(date)
    const warningDate = new Date()
    warningDate.setDate(warningDate.getDate() + days)
    return expiryDate <= warningDate
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando vehículos...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Flota</h1>
            <p className="text-gray-500 mt-1">
              Administra todos los vehículos de INCARGO
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Vehículo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TruckIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Vehículos</p>
                  <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vehicles.filter(v => v.estado === 'disponible').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">→</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Ruta</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vehicles.filter(v => v.estado === 'en_ruta').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">⚠</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mantenimiento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vehicles.filter(v => v.estado === 'mantenimiento').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por placa, conductor o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="disponible">Disponible</option>
                  <option value="en_ruta">En Ruta</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="fuera_servicio">Fuera de Servicio</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Vehicles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TruckIcon className="h-8 w-8 text-green-600" />
                    <div>
                      <CardTitle className="text-lg">{vehicle.placa}</CardTitle>
                      <p className="text-sm text-gray-500">{vehicle.tipo}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(vehicle.estado)}>
                    {getStatusLabel(vehicle.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Conductor:</span>
                    <span className="text-gray-600">{vehicle.conductor}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Marca:</span>
                    <span className="text-gray-600">{vehicle.marca} {vehicle.modelo}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Año:</span>
                    <span className="text-gray-600">{vehicle.año}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Capacidad:</span>
                    <span className="text-gray-600">{vehicle.capacidad_toneladas} Ton</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">{vehicle.ubicacion_actual}</span>
                  </div>
                </div>

                {/* Document Status */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">SOAT:</span>
                    <div className="flex items-center">
                      {isDocumentExpiring(vehicle.soat_vence) && (
                        <ClockIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={isDocumentExpiring(vehicle.soat_vence) ? 'text-red-600' : 'text-gray-600'}>
                        {formatDate(vehicle.soat_vence)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Técnica:</span>
                    <div className="flex items-center">
                      {isDocumentExpiring(vehicle.tecno_vence) && (
                        <ClockIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={isDocumentExpiring(vehicle.tecno_vence) ? 'text-red-600' : 'text-gray-600'}>
                        {formatDate(vehicle.tecno_vence)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Kilometraje:</span>
                    <span className="text-gray-600">{vehicle.kilometraje.toLocaleString()} km</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(vehicle)}
                    className="flex-1"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron vehículos</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Comienza agregando tu primer vehículo'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Agregar Vehículo
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Vehicle Modal */}
        <VehicleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateVehicle}
          mode="create"
        />

        {/* Edit Vehicle Modal */}
        {editingVehicle && (
          <VehicleModal
            isOpen={!!editingVehicle}
            onClose={closeEditModal}
            onSubmit={handleEditVehicle}
            initialData={editingVehicle}
            mode="edit"
          />
        )}
      </div>
    </DashboardLayout>
  )
}
