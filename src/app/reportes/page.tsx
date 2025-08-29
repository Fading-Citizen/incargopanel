'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { ChartBarIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import { useState } from 'react'

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  
  // Mock data para reportes
  const monthlyRevenue = [
    { month: 'Ene', revenue: 2400000, services: 45, clients: 12 },
    { month: 'Feb', revenue: 1800000, services: 38, clients: 10 },
    { month: 'Mar', revenue: 3200000, services: 52, clients: 15 },
    { month: 'Abr', revenue: 2800000, services: 48, clients: 13 },
    { month: 'May', revenue: 3600000, services: 58, clients: 18 },
    { month: 'Jun', revenue: 4200000, services: 65, clients: 20 },
    { month: 'Jul', revenue: 3800000, services: 61, clients: 17 },
    { month: 'Ago', revenue: 4500000, services: 72, clients: 22 },
  ]

  const serviceTypeData = [
    { name: 'Transporte Nacional', value: 35, revenue: 15400000, color: '#10B981' },
    { name: 'Carga de Mercancía', value: 28, revenue: 12200000, color: '#3B82F6' },
    { name: 'Proyectos Logísticos', value: 18, revenue: 8900000, color: '#8B5CF6' },
    { name: 'Vehículos Rodados', value: 12, revenue: 5300000, color: '#F59E0B' },
    { name: 'Bodegaje', value: 7, revenue: 2800000, color: '#EF4444' },
  ]

  const vehicleUtilization = [
    { type: 'Mula 3 Ejes', utilizacion: 85, disponibles: 45, enUso: 38, mantenimiento: 7 },
    { type: 'Dobletroque', utilizacion: 78, disponibles: 32, enUso: 25, mantenimiento: 7 },
    { type: 'Refrigerado', utilizacion: 92, disponibles: 25, enUso: 23, mantenimiento: 2 },
    { type: 'Turbo', utilizacion: 65, disponibles: 58, enUso: 38, mantenimiento: 20 },
    { type: 'Mini-mula', utilizacion: 70, disponibles: 40, enUso: 28, mantenimiento: 12 },
    { type: 'Sencillo', utilizacion: 55, disponibles: 35, enUso: 19, mantenimiento: 16 },
  ]

  const clientPerformance = [
    { client: 'Almacenes Éxito', servicios: 45, ingresos: 15600000, satisfaccion: 4.8 },
    { client: 'Grupo Nutresa', servicios: 38, ingresos: 12400000, satisfaccion: 4.9 },
    { client: 'Bavaria', servicios: 32, ingresos: 11200000, satisfaccion: 4.7 },
    { client: 'Tecnoquímicas', servicios: 28, ingresos: 9800000, satisfaccion: 4.6 },
    { client: 'Postobón', servicios: 25, ingresos: 8900000, satisfaccion: 4.5 },
  ]

  const routeAnalysis = [
    { ruta: 'Bogotá - Medellín', frecuencia: 85, ingresos: 8500000, tiempoPromedio: 9.5 },
    { ruta: 'Medellín - Cali', frecuencia: 72, ingresos: 7200000, tiempoPromedio: 7.2 },
    { ruta: 'Bogotá - Cali', frecuencia: 68, ingresos: 6800000, tiempoPromedio: 11.5 },
    { ruta: 'Cali - Barranquilla', frecuencia: 45, ingresos: 4500000, tiempoPromedio: 14.8 },
    { ruta: 'Bogotá - Cartagena', frecuencia: 38, ingresos: 3800000, tiempoPromedio: 18.2 },
  ]

  const formatRevenue = (value: number) => {
    return `$${(value / 1000000).toFixed(1)}M`
  }

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
            <p className="text-gray-500 mt-1">
              Análisis detallado del rendimiento empresarial
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <PrinterIcon className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Período de Análisis</CardTitle>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="weekly">Última Semana</option>
                <option value="monthly">Últimos 8 Meses</option>
                <option value="yearly">Último Año</option>
              </select>
            </div>
          </CardHeader>
        </Card>

        {/* Revenue and Services Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatRevenue} />
                  <Tooltip formatter={(value: number) => [formatRevenue(value), 'Ingresos']} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Servicios por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="services" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="clients" stroke="#8B5CF6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Service Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Tipo de Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingresos por Tipo de Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceTypeData.map((service, index) => (
                  <div key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: service.color }}
                      ></div>
                      <span className="text-sm font-medium">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatCurrency(service.revenue)}</div>
                      <div className="text-xs text-gray-500">{service.value} servicios</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Utilización de Flota por Tipo de Vehículo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilizacion" fill="#10B981" name="% Utilización" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Client Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Servicios</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ingresos</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfacción</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rendimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {clientPerformance.map((client, index) => (
                    <tr key={client.client} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{client.client}</td>
                      <td className="py-3 px-4 text-gray-600">{client.servicios}</td>
                      <td className="py-3 px-4 font-medium text-green-600">{formatCurrency(client.ingresos)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-gray-900">{client.satisfaccion}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(client.satisfaccion / 5) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Route Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Rutas Principales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ruta</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Frecuencia</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ingresos</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tiempo Promedio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Rentabilidad</th>
                  </tr>
                </thead>
                <tbody>
                  {routeAnalysis.map((route, index) => (
                    <tr key={route.ruta} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{route.ruta}</td>
                      <td className="py-3 px-4 text-gray-600">{route.frecuencia} viajes</td>
                      <td className="py-3 px-4 font-medium text-green-600">{formatCurrency(route.ingresos)}</td>
                      <td className="py-3 px-4 text-gray-600">{route.tiempoPromedio} hrs</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min((route.frecuencia / 85) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Eficiencia Operativa</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">87.3%</div>
              <p className="text-xs text-gray-500">+2.1% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tiempo Promedio Entrega</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2.3 días</div>
              <p className="text-xs text-gray-500">-0.5 días vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Satisfacción Cliente</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">4.7/5</div>
              <p className="text-xs text-gray-500">+0.2 vs mes anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Crecimiento Mensual</CardTitle>
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">+15.8%</div>
              <p className="text-xs text-gray-500">Ingresos vs mes anterior</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
