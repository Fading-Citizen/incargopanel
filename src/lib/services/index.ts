// Servicios
export { fleetService } from './fleet'
export { clientService } from './clients'
export { serviceManager } from './services'
export { quoteService } from './quotes'
export { containerService } from './containers'

// Tipos
export type { Vehicle, CreateVehicleData, UpdateVehicleData } from './fleet'
export type { Client, CreateClientData, UpdateClientData } from './clients'
export type { Service, CreateServiceData, UpdateServiceData } from './services'
export type { Quote, CreateQuoteData, UpdateQuoteData } from './quotes'
export type { Container, CreateContainerData, UpdateContainerData, ContainerTracking } from './containers'

// Importar servicios para usar internamente
import { fleetService } from './fleet'
import { clientService } from './clients'
import { serviceManager } from './services'
import { quoteService } from './quotes'
import { containerService } from './containers'
import type { Vehicle } from './fleet'
import type { Client } from './clients'
import type { Service } from './services'
import type { Quote } from './quotes'
import type { Container } from './containers'

// Servicios combinados para reportes y analytics
export class AnalyticsService {
  async getDashboardStats() {
    try {
      const [vehicles, clients, services, quotes, containers] = await Promise.all([
        fleetService.getAllVehicles(),
        clientService.getAllClients(),
        serviceManager.getAllServices(),
        quoteService.getAllQuotes(),
        containerService.getAllContainers()
      ])

      const activeVehicles = vehicles.filter((v: Vehicle) => v.estado === 'disponible' || v.estado === 'en_ruta').length
      const activeClients = clients.filter((c: Client) => c.estado === 'activo').length
      const pendingServices = services.filter((s: Service) => s.estado === 'pendiente' || s.estado === 'en_proceso').length
      const pendingQuotes = quotes.filter((q: Quote) => q.estado === 'enviada').length
      const containersInTransit = containers.filter((c: Container) => c.estado === 'en_transito' || c.estado === 'en_puerto').length

      return {
        totalVehicles: vehicles.length,
        activeVehicles,
        totalClients: clients.length,
        activeClients,
        totalServices: services.length,
        pendingServices,
        totalQuotes: quotes.length,
        pendingQuotes,
        totalContainers: containers.length,
        containersInTransit
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error)
      return null
    }
  }

  async getRevenueData(startDate: string, endDate: string) {
    try {
      const services = await serviceManager.getServicesByDateRange(startDate, endDate)
      const completedServices = services.filter((s: Service) => s.estado === 'completado')
      
      const totalRevenue = completedServices.reduce((sum: number, service: Service) => sum + service.valor_total, 0)
      const serviceCount = completedServices.length
      const averageServiceValue = serviceCount > 0 ? totalRevenue / serviceCount : 0

      return {
        totalRevenue,
        serviceCount,
        averageServiceValue,
        services: completedServices
      }
    } catch (error) {
      console.error('Error getting revenue data:', error)
      return null
    }
  }

  async getFleetUtilization() {
    try {
      const vehicles = await fleetService.getAllVehicles()
      const services = await serviceManager.getActiveServices()

      const utilizationMap = new Map()
      
      vehicles.forEach((vehicle: Vehicle) => {
        utilizationMap.set(vehicle.id, {
          vehicle,
          activeServices: 0,
          status: vehicle.estado
        })
      })

      services.forEach((service: Service) => {
        if (service.vehiculo_id && utilizationMap.has(service.vehiculo_id)) {
          const data = utilizationMap.get(service.vehiculo_id)
          data.activeServices++
        }
      })

      return Array.from(utilizationMap.values())
    } catch (error) {
      console.error('Error getting fleet utilization:', error)
      return []
    }
  }

  async getClientPerformance() {
    try {
      const clients = await clientService.getAllClients()
      const services = await serviceManager.getAllServices()

      const clientStats = new Map()

      clients.forEach(client => {
        clientStats.set(client.id, {
          client,
          totalServices: 0,
          completedServices: 0,
          totalRevenue: 0,
          pendingBalance: client.saldo_pendiente
        })
      })

      services.forEach(service => {
        if (clientStats.has(service.cliente_id)) {
          const stats = clientStats.get(service.cliente_id)
          stats.totalServices++
          stats.totalRevenue += service.valor_total
          
          if (service.estado === 'completado') {
            stats.completedServices++
          }
        }
      })

      return Array.from(clientStats.values())
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
    } catch (error) {
      console.error('Error getting client performance:', error)
      return []
    }
  }
}

export const analyticsService = new AnalyticsService()
