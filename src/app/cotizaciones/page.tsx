'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getStatusColor, getStatusLabel, formatCurrency, formatDate } from '@/lib/utils'
import { DocumentTextIcon, PlusIcon, MagnifyingGlassIcon, PaperAirplaneIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Quote {
  id: string
  client: string
  serviceType: string
  origin: string
  destination: string
  cargoDetails: string
  weight: number
  volume: number
  quotedPrice: number
  status: string
  validUntil: string
  createdAt: string
  contactPerson: string
  email: string
  phone: string
  estimatedDays: number
  notes?: string
}

export default function CotizacionesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Mock data - en producción esto vendría de Supabase
  const quotes: Quote[] = [
    {
      id: '1',
      client: 'Almacenes Éxito S.A.',
      serviceType: 'Transporte Nacional',
      origin: 'Bogotá',
      destination: 'Barranquilla',
      cargoDetails: 'Productos alimentarios no perecederos - 45 pallets',
      weight: 28.5,
      volume: 65.2,
      quotedPrice: 3200000,
      status: 'sent',
      validUntil: '2024-09-15',
      createdAt: '2024-08-25',
      contactPerson: 'Ana María Rodríguez',
      email: 'a.rodriguez@exito.com',
      phone: '+57 301 234 5678',
      estimatedDays: 2,
      notes: 'Cliente solicita entrega antes del 1 de septiembre'
    },
    {
      id: '2',
      client: 'Industrias Químicas S.A.S.',
      serviceType: 'Carga de Mercancía',
      origin: 'Medellín',
      destination: 'Cali',
      cargoDetails: 'Productos químicos industriales - Carga peligrosa clase 8',
      weight: 15.8,
      volume: 28.4,
      quotedPrice: 2800000,
      status: 'pending',
      validUntil: '2024-09-10',
      createdAt: '2024-08-28',
      contactPerson: 'Carlos Mendoza',
      email: 'cmendoza@iqsas.com',
      phone: '+57 304 567 8901',
      estimatedDays: 1,
      notes: 'Requiere vehículo especializado para carga peligrosa'
    },
    {
      id: '3',
      client: 'Constructora ABC Ltda.',
      serviceType: 'Proyecto Logístico',
      origin: 'Bogotá',
      destination: 'Múltiples ciudades',
      cargoDetails: 'Materiales de construcción para 5 obras simultáneas',
      weight: 120.0,
      volume: 280.5,
      quotedPrice: 8500000,
      status: 'accepted',
      validUntil: '2024-09-05',
      createdAt: '2024-08-20',
      contactPerson: 'María Elena Torres',
      email: 'matorres@constructoraabc.com',
      phone: '+57 310 789 0123',
      estimatedDays: 7,
      notes: 'Proyecto confirmado - proceder con programación'
    },
    {
      id: '4',
      client: 'Farmacéuticos Unidos S.A.',
      serviceType: 'Transporte Refrigerado',
      origin: 'Cali',
      destination: 'Bucaramanga',
      cargoDetails: 'Medicamentos que requieren cadena de frío 2-8°C',
      weight: 12.3,
      volume: 18.7,
      quotedPrice: 4200000,
      status: 'rejected',
      validUntil: '2024-08-30',
      createdAt: '2024-08-22',
      contactPerson: 'Dr. Jorge Herrera',
      email: 'jherrera@farmunidos.com',
      phone: '+57 315 456 7890',
      estimatedDays: 1,
      notes: 'Cliente considera precio elevado - evaluar nueva propuesta'
    },
    {
      id: '5',
      client: 'Textiles del Valle S.A.S.',
      serviceType: 'Bodegaje',
      origin: 'Pereira',
      destination: 'Pereira',
      cargoDetails: 'Almacenamiento temporal de textiles - 3 meses',
      weight: 85.0,
      volume: 450.0,
      quotedPrice: 1800000,
      status: 'expired',
      validUntil: '2024-08-25',
      createdAt: '2024-08-10',
      contactPerson: 'Sandra López',
      email: 'slopez@textilesvalle.com',
      phone: '+57 318 234 5678',
      estimatedDays: 90,
      notes: 'Cotización expirada - cliente no respondió'
    },
    {
      id: '6',
      client: 'Automotriz Colombia S.A.',
      serviceType: 'Vehículos Rodados',
      origin: 'Bogotá',
      destination: 'Cartagena',
      cargoDetails: 'Transporte de 8 vehículos nuevos en madrina',
      weight: 24.0,
      volume: 95.0,
      quotedPrice: 3600000,
      status: 'pending',
      validUntil: '2024-09-12',
      createdAt: '2024-08-29',
      contactPerson: 'Luis Alberto Ramírez',
      email: 'lramirez@autocolombia.com',
      phone: '+57 320 345 6789',
      estimatedDays: 3,
      notes: 'Urgente - para entrega en concesionario'
    }
  ]

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = 
      quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statusCounts = quotes.reduce((acc, quote) => {
    acc[quote.status] = (acc[quote.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalValue = quotes.reduce((sum, quote) => sum + quote.quotedPrice, 0)
  const activeQuotesValue = quotes
    .filter(q => ['pending', 'sent'].includes(q.status))
    .reduce((sum, quote) => sum + quote.quotedPrice, 0)

  const isExpiringSoon = (validUntil: string) => {
    const expiry = new Date(validUntil)
    const today = new Date()
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return expiry <= sevenDaysFromNow && expiry >= today
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Cotizaciones</h1>
            <p className="text-gray-500 mt-1">
              Administra cotizaciones y propuestas comerciales
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Nueva Cotización
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Cotizaciones</CardTitle>
              <DocumentTextIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{quotes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pendientes</CardTitle>
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Enviadas</CardTitle>
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.sent || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Aceptadas</CardTitle>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.accepted || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Valor Activo</CardTitle>
              <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(activeQuotesValue)}</div>
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
                  placeholder="Buscar por cliente, servicio, ruta o contacto..."
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
                <option value="pending">Pendiente</option>
                <option value="sent">Enviada</option>
                <option value="accepted">Aceptada</option>
                <option value="rejected">Rechazada</option>
                <option value="expired">Expirada</option>
              </select>
            </div>
          </CardHeader>
        </Card>

        {/* Quotes Grid */}
        <div className="grid gap-6">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{quote.client}</CardTitle>
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusLabel(quote.status)}
                      </Badge>
                      {isExpiringSoon(quote.validUntil) && (
                        <Badge className="bg-orange-100 text-orange-800">
                          ⏰ Expira pronto
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{quote.serviceType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(quote.quotedPrice)}</p>
                    <p className="text-sm text-gray-500">Cotización #{quote.id.padStart(6, '0')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Route */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Ruta</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{quote.origin}</span>
                        <span>→</span>
                        <span>{quote.destination}</span>
                      </div>
                    </div>

                    {/* Cargo Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Detalles de Carga</h4>
                      <p className="text-sm text-gray-600">{quote.cargoDetails}</p>
                      <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                        <span>Peso: {quote.weight} Ton</span>
                        <span>Volumen: {quote.volume} m³</span>
                        <span>Estimado: {quote.estimatedDays} días</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {quote.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Notas</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{quote.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Contacto</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="font-medium">{quote.contactPerson}</p>
                        <p>{quote.email}</p>
                        <p>{quote.phone}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Fechas</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Creada:</span>
                          <span>{formatDate(quote.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Válida hasta:</span>
                          <span className={isExpired(quote.validUntil) ? 'text-red-600 font-medium' : ''}>
                            {formatDate(quote.validUntil)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      {quote.status === 'pending' && (
                        <>
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                            Enviar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Editar
                          </Button>
                        </>
                      )}
                      
                      {quote.status === 'sent' && (
                        <>
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Aceptar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      
                      {quote.status === 'accepted' && (
                        <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                          Crear Servicio
                        </Button>
                      )}
                      
                      {(['rejected', 'expired'].includes(quote.status)) && (
                        <Button variant="outline" size="sm" className="w-full">
                          Nueva Cotización
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
