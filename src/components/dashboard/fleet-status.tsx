'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getVehicleTypeLabel, getStatusColor, getStatusLabel } from '@/lib/utils'

interface Vehicle {
  id: string
  plate: string
  type: string
  driver: string
  status: string
  location: string
}

export function FleetStatus() {
  // Mock data - en producción esto vendría de Supabase
  const vehicles: Vehicle[] = [
    {
      id: '1',
      plate: 'ABC-123',
      type: 'mula-3',
      driver: 'Carlos Rodríguez',
      status: 'in_transit',
      location: 'Bogotá - Medellín'
    },
    {
      id: '2',
      plate: 'DEF-456',
      type: 'turbo',
      driver: 'María González',
      status: 'available',
      location: 'Terminal Cali'
    },
    {
      id: '3',
      plate: 'GHI-789',
      type: 'refrigerado',
      driver: 'Juan Pérez',
      status: 'maintenance',
      location: 'Taller Central'
    },
    {
      id: '4',
      plate: 'JKL-012',
      type: 'dobletroque',
      driver: 'Ana López',
      status: 'in_transit',
      location: 'Medellín - Barranquilla'
    },
    {
      id: '5',
      plate: 'MNO-345',
      type: 'sencillo',
      driver: 'Pedro Martínez',
      status: 'available',
      location: 'Terminal Bogotá'
    }
  ]

  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de la Flota</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{statusCounts.available || 0}</p>
            <p className="text-sm text-gray-500">Disponibles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{statusCounts.in_transit || 0}</p>
            <p className="text-sm text-gray-500">En Tránsito</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.maintenance || 0}</p>
            <p className="text-sm text-gray-500">Mantenimiento</p>
          </div>
        </div>

        {/* Vehicle list */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Vehículos Recientes</h4>
          {vehicles.slice(0, 5).map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{vehicle.plate}</span>
                  <span className="text-sm text-gray-500">
                    {getVehicleTypeLabel(vehicle.type)}
                  </span>
                  <Badge className={getStatusColor(vehicle.status)}>
                    {getStatusLabel(vehicle.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {vehicle.driver} • {vehicle.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
