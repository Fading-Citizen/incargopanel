'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getStatusColor, getStatusLabel, formatDateTime } from '@/lib/utils'

interface RecentService {
  id: string
  client: string
  type: string
  origin: string
  destination: string
  status: string
  date: string
  value: string
}

export function RecentActivity() {
  // Mock data - en producción esto vendría de Supabase
  const recentServices: RecentService[] = [
    {
      id: '1',
      client: 'Almacenes Éxito',
      type: 'Transporte Nacional',
      origin: 'Bogotá',
      destination: 'Medellín',
      status: 'in_progress',
      date: '2024-08-29T10:30:00Z',
      value: '$2,500,000'
    },
    {
      id: '2',
      client: 'Grupo Nutresa',
      type: 'Carga de Mercancía',
      origin: 'Cali',
      destination: 'Barranquilla',
      status: 'completed',
      date: '2024-08-29T08:15:00Z',
      value: '$1,800,000'
    },
    {
      id: '3',
      client: 'Bavaria',
      type: 'Proyecto Logístico',
      origin: 'Bogotá',
      destination: 'Cartagena',
      status: 'confirmed',
      date: '2024-08-29T14:45:00Z',
      value: '$4,200,000'
    },
    {
      id: '4',
      client: 'Tecnoquímicas',
      type: 'Vehículos Rodados',
      origin: 'Medellín',
      destination: 'Bucaramanga',
      status: 'quote',
      date: '2024-08-28T16:20:00Z',
      value: '$950,000'
    },
    {
      id: '5',
      client: 'Postobón',
      type: 'Bodegaje',
      origin: 'Cali',
      destination: 'Pereira',
      status: 'in_progress',
      date: '2024-08-28T11:30:00Z',
      value: '$680,000'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentServices.map((service) => (
            <div key={service.id} className="flex items-center space-x-4 p-3 rounded-lg border">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {service.client}
                  </p>
                  <Badge className={getStatusColor(service.status)}>
                    {getStatusLabel(service.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {service.type} • {service.origin} → {service.destination}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    {formatDateTime(service.date)}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {service.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
