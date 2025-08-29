'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ClientModal } from '@/components/modals'
import { useClients } from '@/hooks'
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

export default function ClientesPage() {
  const { clients, loading, error, createClient, updateClient, deleteClient, searchClients } = useClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)

  const handleCreateClient = async (data: any) => {
    await createClient(data)
    setIsModalOpen(false)
  }

  const handleEditClient = async (data: any) => {
    await updateClient({ ...data, id: editingClient.id })
    setEditingClient(null)
  }

  const handleDeleteClient = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      await deleteClient(id)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim()) {
      searchClients(term)
    }
  }

  const openEditModal = (client: any) => {
    setEditingClient(client)
  }

  const closeEditModal = () => {
    setEditingClient(null)
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contacto_principal.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || client.tipo_cliente === filterType
    const matchesStatus = filterStatus === 'all' || client.estado === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'activo': 'bg-green-100 text-green-800',
      'inactivo': 'bg-gray-100 text-gray-800',
      'suspendido': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'activo': 'Activo',
      'inactivo': 'Inactivo',
      'suspendido': 'Suspendido'
    }
    return labels[status] || status
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'corporativo': 'bg-blue-100 text-blue-800',
      'pyme': 'bg-purple-100 text-purple-800',
      'particular': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'corporativo': 'Corporativo',
      'pyme': 'PYME',
      'particular': 'Particular'
    }
    return labels[type] || type
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando clientes...</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
            <p className="text-gray-500 mt-1">
              Administra todos los clientes de INCARGO
            </p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.filter(c => c.estado === 'activo').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Corporativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.filter(c => c.tipo_cliente === 'corporativo').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BanknotesIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Con Saldo Pendiente</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.filter(c => c.saldo_pendiente > 0).length}
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
                  placeholder="Buscar por empresa, NIT o contacto..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="corporativo">Corporativo</option>
                  <option value="pyme">PYME</option>
                  <option value="particular">Particular</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Clients Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{client.nombre_empresa}</CardTitle>
                      <p className="text-sm text-gray-500">{client.nit}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={getStatusColor(client.estado)}>
                      {getStatusLabel(client.estado)}
                    </Badge>
                    <Badge className={getTypeColor(client.tipo_cliente)}>
                      {getTypeLabel(client.tipo_cliente)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Contacto:</span>
                    <span className="text-gray-600">{client.contacto_principal}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">{client.telefono}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">{client.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Ciudad:</span>
                    <span className="text-gray-600">{client.ciudad}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Dirección:</span>
                    <span className="text-gray-600 text-xs">{client.direccion}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Servicios Contratados:</p>
                  <div className="flex flex-wrap gap-1">
                    {client.servicios_contratados.slice(0, 2).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {client.servicios_contratados.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{client.servicios_contratados.length - 2} más
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Límite Crédito:</span>
                    <span className="text-gray-600">{formatCurrency(client.limite_credito)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Saldo Pendiente:</span>
                    <span className={client.saldo_pendiente > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {formatCurrency(client.saldo_pendiente)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(client)}
                    className="flex-1"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Comienza agregando tu primer cliente'}
              </p>
              {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Agregar Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create Client Modal */}
        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateClient}
          mode="create"
        />

        {/* Edit Client Modal */}
        {editingClient && (
          <ClientModal
            isOpen={!!editingClient}
            onClose={closeEditModal}
            onSubmit={handleEditClient}
            initialData={editingClient}
            mode="edit"
          />
        )}
      </div>
    </DashboardLayout>
  )
}
