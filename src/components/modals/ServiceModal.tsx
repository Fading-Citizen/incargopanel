'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { CreateServiceData } from '@/lib/services'
import { useClients } from '@/hooks/useClients'
import { useVehicles } from '@/hooks/useFleet'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateServiceData) => Promise<void>
  initialData?: Partial<CreateServiceData>
  mode: 'create' | 'edit'
}

export function ServiceModal({ isOpen, onClose, onSubmit, initialData, mode }: ServiceModalProps) {
  const [formData, setFormData] = useState<CreateServiceData>({
    cliente_id: initialData?.cliente_id || '',
    tipo_servicio: initialData?.tipo_servicio || 'transporte_carga',
    descripcion: initialData?.descripcion || '',
    origen: initialData?.origen || '',
    destino: initialData?.destino || '',
    fecha_inicio: initialData?.fecha_inicio || '',
    fecha_estimada: initialData?.fecha_estimada || '',
    vehiculo_id: initialData?.vehiculo_id || '',
    conductor: initialData?.conductor || '',
    carga_tipo: initialData?.carga_tipo || '',
    peso_kg: initialData?.peso_kg || 0,
    valor_total: initialData?.valor_total || 0,
    observaciones: initialData?.observaciones || ''
  })

  const [loading, setLoading] = useState(false)
  const { clients } = useClients()
  const { vehicles } = useVehicles()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateServiceData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      cliente_id: '',
      tipo_servicio: 'transporte_carga',
      descripcion: '',
      origen: '',
      destino: '',
      fecha_inicio: '',
      fecha_estimada: '',
      vehiculo_id: '',
      conductor: '',
      carga_tipo: '',
      peso_kg: 0,
      valor_total: 0,
      observaciones: ''
    })
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen])

  if (!isOpen) return null

  const availableVehicles = vehicles.filter(v => v.estado === 'disponible')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Crear Nuevo Servicio' : 'Editar Servicio'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cliente */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cliente *</label>
                <select
                  value={formData.cliente_id}
                  onChange={(e) => handleChange('cliente_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.nombre_empresa}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de Servicio */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Servicio *</label>
                <select
                  value={formData.tipo_servicio}
                  onChange={(e) => handleChange('tipo_servicio', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="transporte_carga">Transporte de Carga</option>
                  <option value="transporte_pasajeros">Transporte de Pasajeros</option>
                  <option value="almacenamiento">Almacenamiento</option>
                  <option value="alquiler_vehiculos">Alquiler de Vehículos</option>
                  <option value="proyectos_logisticos">Proyectos Logísticos</option>
                </select>
              </div>

              {/* Descripción */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Descripción *</label>
                <Input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  placeholder="Descripción del servicio"
                  required
                />
              </div>

              {/* Origen */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Origen *</label>
                <Input
                  type="text"
                  value={formData.origen}
                  onChange={(e) => handleChange('origen', e.target.value)}
                  placeholder="Ciudad/dirección de origen"
                  required
                />
              </div>

              {/* Destino */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Destino *</label>
                <Input
                  type="text"
                  value={formData.destino}
                  onChange={(e) => handleChange('destino', e.target.value)}
                  placeholder="Ciudad/dirección de destino"
                  required
                />
              </div>

              {/* Fecha Inicio */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Inicio *</label>
                <Input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                  required
                />
              </div>

              {/* Fecha Estimada */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Estimada *</label>
                <Input
                  type="date"
                  value={formData.fecha_estimada}
                  onChange={(e) => handleChange('fecha_estimada', e.target.value)}
                  required
                />
              </div>

              {/* Vehículo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehículo</label>
                <select
                  value={formData.vehiculo_id || ''}
                  onChange={(e) => handleChange('vehiculo_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin asignar</option>
                  {availableVehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.placa} - {vehicle.tipo} {vehicle.marca}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conductor */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Conductor *</label>
                <Input
                  type="text"
                  value={formData.conductor}
                  onChange={(e) => handleChange('conductor', e.target.value)}
                  placeholder="Nombre del conductor"
                  required
                />
              </div>

              {/* Tipo de Carga */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Carga *</label>
                <Input
                  type="text"
                  value={formData.carga_tipo}
                  onChange={(e) => handleChange('carga_tipo', e.target.value)}
                  placeholder="Tipo de mercancía"
                  required
                />
              </div>

              {/* Peso */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Peso (Kg) *</label>
                <Input
                  type="number"
                  value={formData.peso_kg}
                  onChange={(e) => handleChange('peso_kg', parseFloat(e.target.value) || 0)}
                  placeholder="Peso en kilogramos"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              {/* Valor Total */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Total (COP) *</label>
                <Input
                  type="number"
                  value={formData.valor_total}
                  onChange={(e) => handleChange('valor_total', parseFloat(e.target.value) || 0)}
                  placeholder="Valor del servicio"
                  min="0"
                  required
                />
              </div>

              {/* Observaciones */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => handleChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear Servicio' : 'Actualizar Servicio'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
