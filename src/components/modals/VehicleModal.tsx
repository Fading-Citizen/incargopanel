'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { CreateVehicleData } from '@/lib/services'

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateVehicleData) => Promise<void>
  initialData?: Partial<CreateVehicleData>
  mode: 'create' | 'edit'
}

export function VehicleModal({ isOpen, onClose, onSubmit, initialData, mode }: VehicleModalProps) {
  const [formData, setFormData] = useState<CreateVehicleData>({
    placa: initialData?.placa || '',
    tipo: initialData?.tipo || 'Turbo',
    modelo: initialData?.modelo || '',
    marca: initialData?.marca || '',
    año: initialData?.año || new Date().getFullYear(),
    conductor: initialData?.conductor || '',
    estado: initialData?.estado || 'disponible',
    soat_vence: initialData?.soat_vence || '',
    tecno_vence: initialData?.tecno_vence || '',
    ubicacion_actual: initialData?.ubicacion_actual || 'Terminal Principal Bogotá',
    kilometraje: initialData?.kilometraje || 0,
    capacidad_toneladas: initialData?.capacidad_toneladas || 8
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting vehicle:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof CreateVehicleData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {mode === 'create' ? 'Nuevo Vehículo' : 'Editar Vehículo'}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Placa *</label>
                <Input
                  value={formData.placa}
                  onChange={(e) => handleChange('placa', e.target.value)}
                  placeholder="ABC123"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleChange('tipo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="Turbo">Turbo (8 Ton)</option>
                  <option value="Sencillo">Sencillo (5 Ton)</option>
                  <option value="Dobletroque">Dobletroque (28 Ton)</option>
                  <option value="Mini-mula 2 Ejes">Mini-mula 2 Ejes (12 Ton)</option>
                  <option value="Mini-mula 3 Ejes">Mini-mula 3 Ejes (18 Ton)</option>
                  <option value="Mula 2 Ejes">Mula 2 Ejes (24 Ton)</option>
                  <option value="Mula 3 Ejes">Mula 3 Ejes (34 Ton)</option>
                  <option value="Refrigerado">Refrigerado (15 Ton)</option>
                  <option value="Plataforma Abierta">Plataforma Abierta (25 Ton)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                <Input
                  value={formData.marca}
                  onChange={(e) => handleChange('marca', e.target.value)}
                  placeholder="Volvo, Mercedes, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
                <Input
                  value={formData.modelo}
                  onChange={(e) => handleChange('modelo', e.target.value)}
                  placeholder="FH16, Actros, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                <Input
                  type="number"
                  value={formData.año}
                  onChange={(e) => handleChange('año', parseInt(e.target.value))}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleChange('estado', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="disponible">Disponible</option>
                  <option value="en_ruta">En Ruta</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="fuera_servicio">Fuera de Servicio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conductor *</label>
                <Input
                  value={formData.conductor}
                  onChange={(e) => handleChange('conductor', e.target.value)}
                  placeholder="Nombre del conductor"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad (Toneladas) *</label>
                <Input
                  type="number"
                  value={formData.capacidad_toneladas}
                  onChange={(e) => handleChange('capacidad_toneladas', parseFloat(e.target.value))}
                  min="1"
                  step="0.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SOAT Vence *</label>
                <Input
                  type="date"
                  value={formData.soat_vence}
                  onChange={(e) => handleChange('soat_vence', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revisión Técnica Vence *</label>
                <Input
                  type="date"
                  value={formData.tecno_vence}
                  onChange={(e) => handleChange('tecno_vence', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación Actual *</label>
                <select
                  value={formData.ubicacion_actual}
                  onChange={(e) => handleChange('ubicacion_actual', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="Terminal Principal Bogotá">Terminal Principal Bogotá</option>
                  <option value="Bodega Central Medellín">Bodega Central Medellín</option>
                  <option value="Puerto Buenaventura">Puerto Buenaventura</option>
                  <option value="Centro Distribución Cali">Centro Distribución Cali</option>
                  <option value="Taller Mantenimiento">Taller Mantenimiento</option>
                  <option value="En Ruta">En Ruta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje *</label>
                <Input
                  type="number"
                  value={formData.kilometraje}
                  onChange={(e) => handleChange('kilometraje', parseInt(e.target.value))}
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear Vehículo' : 'Actualizar Vehículo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
