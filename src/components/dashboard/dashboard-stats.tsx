'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TruckIcon, UsersIcon, CubeIcon, ChartBarIcon } from '@heroicons/react/24/outline'

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
  icon: React.ComponentType<{ className?: string }>
}

function StatsCard({ title, value, change, changeType, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <p className="text-xs text-gray-500">
          <span className={changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
            {change}
          </span>{' '}
          desde el mes pasado
        </p>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const stats = [
    {
      title: 'Vehículos Activos',
      value: '247',
      change: '+12%',
      changeType: 'increase' as const,
      icon: TruckIcon,
    },
    {
      title: 'Clientes Activos',
      value: '89',
      change: '+8%',
      changeType: 'increase' as const,
      icon: UsersIcon,
    },
    {
      title: 'Servicios en Progreso',
      value: '34',
      change: '+15%',
      changeType: 'increase' as const,
      icon: CubeIcon,
    },
    {
      title: 'Ingresos del Mes',
      value: '$2.4M',
      change: '+18%',
      changeType: 'increase' as const,
      icon: ChartBarIcon,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}
