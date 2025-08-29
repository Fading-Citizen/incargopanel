import { supabase, isDemoMode } from '@/lib/supabase'
import { mockServices } from '../mockData'

export interface Service {
  id: string
  cliente_id: string
  tipo_servicio: 'transporte_carga' | 'transporte_pasajeros' | 'almacenamiento' | 'alquiler_vehiculos' | 'proyectos_logisticos'
  descripcion: string
  origen: string
  destino: string
  fecha_inicio: string
  fecha_estimada: string
  fecha_completado?: string
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'
  vehiculo_id?: string
  conductor: string
  carga_tipo: string
  peso_kg: number
  valor_total: number
  observaciones: string
  created_at?: string
  updated_at?: string
  // Relaciones
  cliente?: {
    nombre_empresa: string
    contacto_principal: string
  }
  vehiculo?: {
    placa: string
    tipo: string
  }
}

export interface CreateServiceData {
  cliente_id: string
  tipo_servicio: 'transporte_carga' | 'transporte_pasajeros' | 'almacenamiento' | 'alquiler_vehiculos' | 'proyectos_logisticos'
  descripcion: string
  origen: string
  destino: string
  fecha_inicio: string
  fecha_estimada: string
  vehiculo_id?: string
  conductor: string
  carga_tipo: string
  peso_kg: number
  valor_total: number
  observaciones: string
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  id: string
  fecha_completado?: string
  estado?: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'
}

class ServiceManager {
  async getAllServices(): Promise<Service[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockServices
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching services:', error)
      return isDemoMode ? mockServices : []
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockServices.find(s => s.id === id) || null
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching service:', error)
      return null
    }
  }

  async createService(serviceData: CreateServiceData): Promise<Service | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newService: Service = {
          ...serviceData,
          id: `demo-${Date.now()}`,
          estado: 'pendiente',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockServices.unshift(newService)
        return newService
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('servicios')
        .insert([serviceData])
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating service:', error)
      return null
    }
  }

  async updateService(serviceData: UpdateServiceData): Promise<Service | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockServices.findIndex(s => s.id === serviceData.id)
        if (index !== -1) {
          const { id, ...updateData } = serviceData
          mockServices[index] = {
            ...mockServices[index],
            ...updateData,
            updated_at: new Date().toISOString()
          }
          return mockServices[index]
        }
        return null
      }

      if (!supabase) return null

      const { id, ...updateData } = serviceData
      const { data, error } = await supabase
        .from('servicios')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating service:', error)
      return null
    }
  }

  async deleteService(id: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockServices.findIndex(s => s.id === id)
        if (index !== -1) {
          mockServices.splice(index, 1)
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('servicios')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting service:', error)
      return false
    }
  }

  async getServicesByStatus(status: string): Promise<Service[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockServices.filter(s => s.estado === status)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .eq('estado', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching services by status:', error)
      return []
    }
  }

  async getServicesByClient(clientId: string): Promise<Service[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockServices.filter(s => s.cliente_id === clientId)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .eq('cliente_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching services by client:', error)
      return []
    }
  }

  async getServicesByVehicle(vehicleId: string): Promise<Service[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockServices.filter(s => s.vehiculo_id === vehicleId)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .eq('vehiculo_id', vehicleId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching services by vehicle:', error)
      return []
    }
  }

  async updateServiceStatus(id: string, status: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado'): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const service = mockServices.find(s => s.id === id)
        if (service) {
          service.estado = status
          if (status === 'completado') {
            service.fecha_completado = new Date().toISOString()
          }
          service.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const updateData: any = { estado: status }
      if (status === 'completado') {
        updateData.fecha_completado = new Date().toISOString()
      }

      const { error } = await supabase
        .from('servicios')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating service status:', error)
      return false
    }
  }

  async assignVehicleToService(serviceId: string, vehicleId: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const service = mockServices.find(s => s.id === serviceId)
        if (service) {
          service.vehiculo_id = vehicleId
          service.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('servicios')
        .update({ vehiculo_id: vehicleId })
        .eq('id', serviceId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning vehicle to service:', error)
      return false
    }
  }

  async getServicesByDateRange(startDate: string, endDate: string): Promise<Service[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockServices.filter(s => {
          const serviceDate = new Date(s.fecha_inicio)
          const start = new Date(startDate)
          const end = new Date(endDate)
          return serviceDate >= start && serviceDate <= end
        })
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .gte('fecha_inicio', startDate)
        .lte('fecha_inicio', endDate)
        .order('fecha_inicio', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching services by date range:', error)
      return []
    }
  }

  async getRevenueByPeriod(startDate: string, endDate: string): Promise<number> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const services = mockServices.filter(s => {
          const serviceDate = new Date(s.fecha_inicio)
          const start = new Date(startDate)
          const end = new Date(endDate)
          return serviceDate >= start && serviceDate <= end && s.estado === 'completado'
        })
        return services.reduce((total, service) => total + service.valor_total, 0)
      }

      if (!supabase) return 0

      const { data, error } = await supabase
        .from('servicios')
        .select('valor_total')
        .eq('estado', 'completado')
        .gte('fecha_inicio', startDate)
        .lte('fecha_inicio', endDate)

      if (error) throw error
      
      return data?.reduce((total, service) => total + service.valor_total, 0) || 0
    } catch (error) {
      console.error('Error calculating revenue:', error)
      return 0
    }
  }
}

export const serviceManager = new ServiceManager()
