'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { CreateClientData } from '@/lib/services'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateClientData) => Promise<void>
  initialData?: Partial<CreateClientData>
  mode: 'create' | 'edit'
}

export function ClientModal({ isOpen, onClose, onSubmit, initialData, mode }: ClientModalProps) {
  const [formData, setFormData] = useState<CreateClientData>({
    nombre_empresa: initialData?.nombre_empresa || '',
    nit: initialData?.nit || '',
    contacto_principal: initialData?.contacto_principal || '',
    telefono: initialData?.telefono || '',
    email: initialData?.email || '',
    direccion: initialData?.direccion || '',
    ciudad: initialData?.ciudad || '',
    tipo_cliente: initialData?.tipo_cliente || 'corporativo',
    estado: initialData?.estado || 'activo',
    servicios_contratados: initialData?.servicios_contratados || [],
    limite_credito: initialData?.limite_credito || 0,
    saldo_pendiente: initialData?.saldo_pendiente || 0
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting client:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateClientData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceToggle = (service: string) => {
    const currentServices = formData.servicios_contratados
    const updatedServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service]
    handleChange('servicios_contratados', updatedServices)
  }

  const serviceOptions = [
    'Transporte de Carga',
    'Transporte de Pasajeros',
    'Almacenamiento',
    'Alquiler de Vehículos',
    'Proyectos Logísticos'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {mode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa *</label>
                  <Input
                    value={formData.nombre_empresa}
                    onChange={(e) => handleChange('nombre_empresa', e.target.value)}
                    placeholder="Empresa ABC S.A.S."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIT *</label>
                  <Input
                    value={formData.nit}
                    onChange={(e) => handleChange('nit', e.target.value)}
                    placeholder="900123456-7"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contacto Principal *</label>
                  <Input
                    value={formData.contacto_principal}
                    onChange={(e) => handleChange('contacto_principal', e.target.value)}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cliente</label>
                  <select
                    value={formData.tipo_cliente}
                    onChange={(e) => handleChange('tipo_cliente', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="corporativo">Corporativo</option>
                    <option value="pyme">PYME</option>
                    <option value="particular">Particular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <Input
                    value={formData.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    placeholder="+57 310 123 4567"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="contacto@empresa.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                  <select
                    value={formData.ciudad}
                    onChange={(e) => handleChange('ciudad', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Seleccionar ciudad</option>
                    <option value="Bogotá">Bogotá</option>
                    <option value="Medellín">Medellín</option>
                    <option value="Cali">Cali</option>
                    <option value="Barranquilla">Barranquilla</option>
                    <option value="Cartagena">Cartagena</option>
                    <option value="Buenaventura">Buenaventura</option>
                    <option value="Manizales">Manizales</option>
                    <option value="Pereira">Pereira</option>
                    <option value="Ibagué">Ibagué</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleChange('estado', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                  <Input
                    value={formData.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                    placeholder="Carrera 15 # 93-07"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Servicios Contratados */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Servicios Contratados</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.servicios_contratados.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Información Financiera */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Financiera</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Crédito</label>
                  <Input
                    type="number"
                    value={formData.limite_credito}
                    onChange={(e) => handleChange('limite_credito', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saldo Pendiente</label>
                  <Input
                    type="number"
                    value={formData.saldo_pendiente}
                    onChange={(e) => handleChange('saldo_pendiente', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
