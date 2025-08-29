'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function RevenueChart() {
  // Mock data - en producción esto vendría de Supabase
  const data = [
    { month: 'Ene', revenue: 2400000 },
    { month: 'Feb', revenue: 1800000 },
    { month: 'Mar', revenue: 3200000 },
    { month: 'Abr', revenue: 2800000 },
    { month: 'May', revenue: 3600000 },
    { month: 'Jun', revenue: 4200000 },
    { month: 'Jul', revenue: 3800000 },
    { month: 'Ago', revenue: 4500000 },
  ]

  const formatRevenue = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por Mes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatRevenue} />
            <Tooltip 
              formatter={(value: number) => [formatRevenue(value), 'Ingresos']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
