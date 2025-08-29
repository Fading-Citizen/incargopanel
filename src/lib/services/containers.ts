import { supabase, isDemoMode } from '@/lib/supabase'
import { mockContainers } from '../mockData'

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

class ContainerService {
  async getAllContainers(): Promise<Container[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockContainers
      }

      if (!supabase) return []

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
      return isDemoMode ? mockContainers : []
    }
  }

  async getContainerById(id: string): Promise<Container | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockContainers.find(c => c.id === id) || null
      }

      if (!supabase) return null

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

  async createContainer(containerData: CreateContainerData): Promise<Container | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newContainer: Container = {
          ...containerData,
          id: `demo-${Date.now()}`,
          estado: 'en_transito',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockContainers.unshift(newContainer)
        return newContainer
      }

      if (!supabase) return null

      const dataToInsert = {
        ...containerData,
        estado: 'en_transito' as const
      }

      const { data, error } = await supabase
        .from('contenedores')
        .insert([dataToInsert])
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating container:', error)
      return null
    }
  }

  async updateContainer(containerData: UpdateContainerData): Promise<Container | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockContainers.findIndex(c => c.id === containerData.id)
        if (index !== -1) {
          const { id, ...updateData } = containerData
          mockContainers[index] = {
            ...mockContainers[index],
            ...updateData,
            updated_at: new Date().toISOString()
          }
          return mockContainers[index]
        }
        return null
      }

      if (!supabase) return null

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
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockContainers.findIndex(c => c.id === id)
        if (index !== -1) {
          mockContainers.splice(index, 1)
          return true
        }
        return false
      }

      if (!supabase) return false

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
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockContainers.filter(c => c.estado === status)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('estado', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching containers by status:', error)
      return []
    }
  }

  async getContainersByClient(clientId: string): Promise<Container[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockContainers.filter(c => c.cliente_id === clientId)
      }

      if (!supabase) return []

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

  async updateContainerStatus(id: string, status: 'en_transito' | 'en_puerto' | 'en_bodega' | 'entregado' | 'devuelto'): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const container = mockContainers.find(c => c.id === id)
        if (container) {
          container.estado = status
          if (status === 'entregado') {
            container.fecha_entrega_real = new Date().toISOString()
          }
          container.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const updateData: any = { estado: status }
      if (status === 'entregado') {
        updateData.fecha_entrega_real = new Date().toISOString()
      }

      const { error } = await supabase
        .from('contenedores')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating container status:', error)
      return false
    }
  }

  async updateContainerLocation(id: string, location: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const container = mockContainers.find(c => c.id === id)
        if (container) {
          container.ubicacion_actual = location
          container.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('contenedores')
        .update({ ubicacion_actual: location })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating container location:', error)
      return false
    }
  }

  async updateContainerTemperature(id: string, temperature: number): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const container = mockContainers.find(c => c.id === id)
        if (container) {
          container.temperatura_actual = temperature
          container.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('contenedores')
        .update({ temperatura_actual: temperature })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating container temperature:', error)
      return false
    }
  }

  async getContainersByType(type: string): Promise<Container[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockContainers.filter(c => c.tipo === type)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('tipo', type)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching containers by type:', error)
      return []
    }
  }

  async getReeferContainers(): Promise<Container[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockContainers.filter(c => c.tipo === 'reefer')
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('tipo', 'reefer')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching reefer containers:', error)
      return []
    }
  }

  async getContainersNearDelivery(days: number = 3): Promise<Container[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + days)
        const futureDateString = futureDate.toISOString().split('T')[0]
        
        return mockContainers.filter(c => 
          c.fecha_entrega_estimada <= futureDateString && 
          c.estado !== 'entregado' && 
          c.estado !== 'devuelto'
        )
      }

      if (!supabase) return []

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)
      const futureDateString = futureDate.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .lte('fecha_entrega_estimada', futureDateString)
        .not('estado', 'in', '(entregado,devuelto)')
        .order('fecha_entrega_estimada', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching containers near delivery:', error)
      return []
    }
  }

  async searchContainers(query: string): Promise<Container[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const lowerQuery = query.toLowerCase()
        return mockContainers.filter(c => 
          c.numero_contenedor.toLowerCase().includes(lowerQuery) ||
          c.numero_bl.toLowerCase().includes(lowerQuery) ||
          c.mercancia.toLowerCase().includes(lowerQuery) ||
          c.naviera.toLowerCase().includes(lowerQuery) ||
          c.buque.toLowerCase().includes(lowerQuery)
        )
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .or(`numero_contenedor.ilike.%${query}%,numero_bl.ilike.%${query}%,mercancia.ilike.%${query}%,naviera.ilike.%${query}%,buque.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching containers:', error)
      return []
    }
  }

  async getOverdueContainers(): Promise<Container[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const today = new Date().toISOString().split('T')[0]
        return mockContainers.filter(c => 
          c.fecha_entrega_estimada < today && 
          c.estado !== 'entregado' && 
          c.estado !== 'devuelto'
        )
      }

      if (!supabase) return []

      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .lt('fecha_entrega_estimada', today)
        .not('estado', 'in', '(entregado,devuelto)')
        .order('fecha_entrega_estimada', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching overdue containers:', error)
      return []
    }
  }

  async getContainerTracking(numero: string): Promise<Container | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockContainers.find(c => c.numero_contenedor === numero) || null
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('contenedores')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal)
        `)
        .eq('numero_contenedor', numero)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error tracking container:', error)
      return null
    }
  }
}

export const containerService = new ContainerService()
