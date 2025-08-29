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
      return []
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    try {
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
      const { data, error } = await supabase
        .from('servicios')
        .insert([{
          ...serviceData,
          estado: 'pendiente'
        }])
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

  async getServicesByDateRange(startDate: string, endDate: string): Promise<Service[]> {
    try {
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

  async completeService(id: string, completionDate?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('servicios')
        .update({
          estado: 'completado',
          fecha_completado: completionDate || new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error completing service:', error)
      return false
    }
  }

  async cancelService(id: string, reason?: string): Promise<boolean> {
    try {
      const updateData: any = { estado: 'cancelado' }
      if (reason) {
        updateData.observaciones = reason
      }

      const { error } = await supabase
        .from('servicios')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error canceling service:', error)
      return false
    }
  }

  async assignVehicle(serviceId: string, vehicleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('servicios')
        .update({ vehiculo_id: vehicleId })
        .eq('id', serviceId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning vehicle:', error)
      return false
    }
  }

  async getActiveServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .in('estado', ['pendiente', 'en_proceso'])
        .order('fecha_inicio', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active services:', error)
      return []
    }
  }

  async getOverdueServices(): Promise<Service[]> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('servicios')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal),
          vehiculo:vehiculos(placa, tipo)
        `)
        .in('estado', ['pendiente', 'en_proceso'])
        .lt('fecha_estimada', today)
        .order('fecha_estimada', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching overdue services:', error)
      return []
    }
  }
}

export const serviceManager = new ServiceManager()
