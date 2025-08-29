import { supabase, isDemoMode } from '@/lib/supabase'
import { mockClients } from '../mockData'

export interface Client {
  id: string
  nombre_empresa: string
  nit: string
  contacto_principal: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  tipo_cliente: 'corporativo' | 'pyme' | 'particular'
  estado: 'activo' | 'inactivo' | 'suspendido'
  fecha_registro: string
  servicios_contratados: string[]
  limite_credito: number
  saldo_pendiente: number
  created_at?: string
  updated_at?: string
}

export interface CreateClientData {
  nombre_empresa: string
  nit: string
  contacto_principal: string
  telefono: string
  email: string
  direccion: string
  ciudad: string
  tipo_cliente: 'corporativo' | 'pyme' | 'particular'
  estado: 'activo' | 'inactivo' | 'suspendido'
  servicios_contratados: string[]
  limite_credito: number
  saldo_pendiente: number
}

export interface UpdateClientData extends Partial<CreateClientData> {
  id: string
}

class ClientService {
  async getAllClients(): Promise<Client[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockClients
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching clients:', error)
      return isDemoMode ? mockClients : []
    }
  }

  async getClientById(id: string): Promise<Client | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockClients.find(c => c.id === id) || null
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching client:', error)
      return null
    }
  }

  async createClient(clientData: CreateClientData): Promise<Client | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newClient: Client = {
          ...clientData,
          id: `demo-${Date.now()}`,
          fecha_registro: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockClients.unshift(newClient)
        return newClient
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('clientes')
        .insert([clientData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating client:', error)
      return null
    }
  }

  async updateClient(clientData: UpdateClientData): Promise<Client | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockClients.findIndex(c => c.id === clientData.id)
        if (index !== -1) {
          const { id, ...updateData } = clientData
          mockClients[index] = {
            ...mockClients[index],
            ...updateData,
            updated_at: new Date().toISOString()
          }
          return mockClients[index]
        }
        return null
      }

      if (!supabase) return null

      const { id, ...updateData } = clientData
      const { data, error } = await supabase
        .from('clientes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating client:', error)
      return null
    }
  }

  async deleteClient(id: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockClients.findIndex(c => c.id === id)
        if (index !== -1) {
          mockClients.splice(index, 1)
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting client:', error)
      return false
    }
  }

  async getClientsByType(type: string): Promise<Client[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockClients.filter(c => c.tipo_cliente === type)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('tipo_cliente', type)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching clients by type:', error)
      return []
    }
  }

  async getActiveClients(): Promise<Client[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockClients.filter(c => c.estado === 'activo')
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('estado', 'activo')
        .order('nombre_empresa', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active clients:', error)
      return []
    }
  }

  async searchClients(searchTerm: string): Promise<Client[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const lowerTerm = searchTerm.toLowerCase()
        return mockClients.filter(c => 
          c.nombre_empresa.toLowerCase().includes(lowerTerm) ||
          c.nit.includes(searchTerm) ||
          c.contacto_principal.toLowerCase().includes(lowerTerm)
        )
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .or(`nombre_empresa.ilike.%${searchTerm}%,nit.ilike.%${searchTerm}%,contacto_principal.ilike.%${searchTerm}%`)
        .order('nombre_empresa', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching clients:', error)
      return []
    }
  }

  async updateClientBalance(id: string, newBalance: number): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const client = mockClients.find(c => c.id === id)
        if (client) {
          client.saldo_pendiente = newBalance
          client.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('clientes')
        .update({ saldo_pendiente: newBalance })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating client balance:', error)
      return false
    }
  }

  async addServiceToClient(id: string, serviceType: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const client = mockClients.find(c => c.id === id)
        if (client && !client.servicios_contratados.includes(serviceType)) {
          client.servicios_contratados.push(serviceType)
          client.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const client = await this.getClientById(id)
      if (!client) return false

      const updatedServices = [...client.servicios_contratados]
      if (!updatedServices.includes(serviceType)) {
        updatedServices.push(serviceType)
      }

      const { error } = await supabase
        .from('clientes')
        .update({ servicios_contratados: updatedServices })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error adding service to client:', error)
      return false
    }
  }

  async getClientsWithPendingBalance(): Promise<Client[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockClients.filter(c => c.saldo_pendiente > 0)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .gt('saldo_pendiente', 0)
        .order('saldo_pendiente', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching clients with pending balance:', error)
      return []
    }
  }
}

export const clientService = new ClientService()
