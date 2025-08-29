import { supabase } from '@/lib/supabase'

export interface Container {
  id: string
  numero_contenedor: string
  tipo: 'dry' | 'reefer' | 'open_top' | 'flat_rack' | 'tank'
  tamaño: '20ft' | '40ft' | '40ft_hc' | '45ft'
  cliente_id: string
  origen: string
  destino: string
  fecha_llegada: string
  fecha_entrega_estimada: string
  fecha_entrega_real?: string
  estado: 'en_transito' | 'en_puerto' | 'en_bodega' | 'entregado' | 'devuelto'
  ubicacion_actual: string
  temperatura_actual?: number
  temperatura_objetivo?: number
  peso_bruto: number
  peso_neto: number
  mercancia: string
  observaciones: string
  numero_bl: string
  naviera: string
  buque: string
  viaje: string
  created_at?: string
  updated_at?: string
  // Relaciones
  cliente?: {
    nombre_empresa: string
    contacto_principal: string
  }
}

export interface CreateContainerData {
  numero_contenedor: string
  tipo: 'dry' | 'reefer' | 'open_top' | 'flat_rack' | 'tank'
  tamaño: '20ft' | '40ft' | '40ft_hc' | '45ft'
  cliente_id: string
  origen: string
  destino: string
  fecha_llegada: string
  fecha_entrega_estimada: string
  ubicacion_actual: string
  temperatura_objetivo?: number
  peso_bruto: number
  peso_neto: number
  mercancia: string
  observaciones: string
  numero_bl: string
  naviera: string
  buque: string
  viaje: string
}

export interface UpdateContainerData extends Partial<CreateContainerData> {
  id: string
  fecha_entrega_real?: string
  estado?: 'en_transito' | 'en_puerto' | 'en_bodega' | 'entregado' | 'devuelto'
  temperatura_actual?: number
}

export interface ContainerTracking {
  id: string
  contenedor_id: string
  fecha_evento: string
  ubicacion: string
  descripcion: string
  temperatura?: number
  usuario: string
  created_at?: string
}

class ContainerService {
  async getAllContainers(): Promise<Container[]> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching containers:', error)
      return []
    }
  }

  async getContainerById(id: string): Promise<Container | null> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching container:', error)
      return null
    }
  }

  async getContainerByNumber(number: string): Promise<Container | null> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('numero_contenedor', number)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching container by number:', error)
      return null
    }
  }

  async createContainer(containerData: CreateContainerData): Promise<Container | null> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .insert([{
          ...containerData,
          estado: 'en_transito'
        }])
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .single()

      if (error) throw error

      // Crear evento inicial de tracking
      if (data) {
        await this.addTrackingEvent(data.id, {
          ubicacion: containerData.origen,
          descripcion: 'Contenedor registrado en el sistema',
          usuario: 'Sistema'
        })
      }

      return data
    } catch (error) {
      console.error('Error creating container:', error)
      return null
    }
  }

  async updateContainer(containerData: UpdateContainerData): Promise<Container | null> {
    try {
      const { id, ...updateData } = containerData
      const { data, error } = await supabase
        .from('contenedores')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating container:', error)
      return null
    }
  }

  async deleteContainer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contenedores')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting container:', error)
      return false
    }
  }

  async getContainersByStatus(status: string): Promise<Container[]> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('estado', status)
        .order('fecha_llegada', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching containers by status:', error)
      return []
    }
  }

  async getContainersByClient(clientId: string): Promise<Container[]> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('cliente_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching containers by client:', error)
      return []
    }
  }

  async getOverdueContainers(): Promise<Container[]> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .in('estado', ['en_transito', 'en_puerto', 'en_bodega'])
        .lt('fecha_entrega_estimada', today)
        .order('fecha_entrega_estimada', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching overdue containers:', error)
      return []
    }
  }

  async updateContainerLocation(id: string, location: string, description?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contenedores')
        .update({ ubicacion_actual: location })
        .eq('id', id)

      if (error) throw error

      // Agregar evento de tracking
      await this.addTrackingEvent(id, {
        ubicacion: location,
        descripcion: description || `Contenedor actualizado en ${location}`,
        usuario: 'Sistema'
      })

      return true
    } catch (error) {
      console.error('Error updating container location:', error)
      return false
    }
  }

  async updateContainerTemperature(id: string, temperature: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contenedores')
        .update({ temperatura_actual: temperature })
        .eq('id', id)

      if (error) throw error

      // Agregar evento de tracking con temperatura
      await this.addTrackingEvent(id, {
        ubicacion: 'Sistema',
        descripcion: `Temperatura actualizada: ${temperature}°C`,
        temperatura: temperature,
        usuario: 'Sistema'
      })

      return true
    } catch (error) {
      console.error('Error updating container temperature:', error)
      return false
    }
  }

  async deliverContainer(id: string, deliveryDate?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contenedores')
        .update({
          estado: 'entregado',
          fecha_entrega_real: deliveryDate || new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Agregar evento de entrega
      await this.addTrackingEvent(id, {
        ubicacion: 'Cliente',
        descripcion: 'Contenedor entregado exitosamente',
        usuario: 'Sistema'
      })

      return true
    } catch (error) {
      console.error('Error delivering container:', error)
      return false
    }
  }

  async addTrackingEvent(containerId: string, eventData: {
    ubicacion: string
    descripcion: string
    temperatura?: number
    usuario: string
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contenedor_tracking')
        .insert([{
          contenedor_id: containerId,
          fecha_evento: new Date().toISOString(),
          ...eventData
        }])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding tracking event:', error)
      return false
    }
  }

  async getContainerTracking(containerId: string): Promise<ContainerTracking[]> {
    try {
      const { data, error } = await supabase
        .from('contenedor_tracking')
        .select('*')
        .eq('contenedor_id', containerId)
        .order('fecha_evento', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching container tracking:', error)
      return []
    }
  }

  async getRefrigeratedContainers(): Promise<Container[]> {
    try {
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('tipo', 'reefer')
        .in('estado', ['en_transito', 'en_puerto', 'en_bodega'])
        .order('fecha_llegada', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching refrigerated containers:', error)
      return []
    }
  }

  async getContainersNearDelivery(days: number = 3): Promise<Container[]> {
    try {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)
      const dateString = futureDate.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .in('estado', ['en_transito', 'en_puerto', 'en_bodega'])
        .lte('fecha_entrega_estimada', dateString)
        .order('fecha_entrega_estimada', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching containers near delivery:', error)
      return []
    }
  }
}

export const containerService = new ContainerService()
