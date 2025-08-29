import { supabase, isDemoMode } from '@/lib/supabase'
import { mockQuotes } from '../mockData'

export interface Quote {
  id: string
  cliente_id: string
  numero_cotizacion: string
  tipo_servicio: 'transporte_carga' | 'transporte_pasajeros' | 'almacenamiento' | 'alquiler_vehiculos' | 'proyectos_logisticos'
  descripcion: string
  origen: string
  destino: string
  fecha_solicitud: string
  fecha_vencimiento: string
  estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'
  tipo_carga: string
  peso_estimado: number
  volumen_estimado: number
  valor_estimado: number
  descuento_porcentaje: number
  valor_final: number
  observaciones: string
  terminos_condiciones: string
  created_at?: string
  updated_at?: string
  // Relaciones
  cliente?: {
    nombre_empresa: string
    contacto_principal: string
    email: string
  }
}

export interface CreateQuoteData {
  cliente_id: string
  numero_cotizacion: string
  tipo_servicio: 'transporte_carga' | 'transporte_pasajeros' | 'almacenamiento' | 'alquiler_vehiculos' | 'proyectos_logisticos'
  descripcion: string
  origen: string
  destino: string
  fecha_solicitud: string
  fecha_vencimiento: string
  tipo_carga: string
  peso_estimado: number
  volumen_estimado: number
  valor_estimado: number
  descuento_porcentaje: number
  observaciones: string
  terminos_condiciones: string
}

export interface UpdateQuoteData extends Partial<CreateQuoteData> {
  id: string
  estado?: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'
  valor_final?: number
}

class QuoteService {
  async getAllQuotes(): Promise<Quote[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockQuotes
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching quotes:', error)
      return isDemoMode ? mockQuotes : []
    }
  }

  async getQuoteById(id: string): Promise<Quote | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockQuotes.find(q => q.id === id) || null
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching quote:', error)
      return null
    }
  }

  async createQuote(quoteData: CreateQuoteData): Promise<Quote | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newQuote: Quote = {
          ...quoteData,
          id: `demo-${Date.now()}`,
          estado: 'borrador',
          valor_final: quoteData.valor_estimado * (1 - quoteData.descuento_porcentaje / 100),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockQuotes.unshift(newQuote)
        return newQuote
      }

      if (!supabase) return null

      const valor_final = quoteData.valor_estimado * (1 - quoteData.descuento_porcentaje / 100)
      const dataToInsert = {
        ...quoteData,
        estado: 'borrador' as const,
        valor_final
      }

      const { data, error } = await supabase
        .from('cotizaciones')
        .insert([dataToInsert])
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating quote:', error)
      return null
    }
  }

  async updateQuote(quoteData: UpdateQuoteData): Promise<Quote | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockQuotes.findIndex(q => q.id === quoteData.id)
        if (index !== -1) {
          const { id, ...updateData } = quoteData
          // Recalcular valor final si cambian los valores
          if (updateData.valor_estimado !== undefined || updateData.descuento_porcentaje !== undefined) {
            const valor_estimado = updateData.valor_estimado ?? mockQuotes[index].valor_estimado
            const descuento = updateData.descuento_porcentaje ?? mockQuotes[index].descuento_porcentaje
            updateData.valor_final = valor_estimado * (1 - descuento / 100)
          }
          
          mockQuotes[index] = {
            ...mockQuotes[index],
            ...updateData,
            updated_at: new Date().toISOString()
          }
          return mockQuotes[index]
        }
        return null
      }

      if (!supabase) return null

      const { id, ...updateData } = quoteData
      
      // Recalcular valor final si cambian los valores
      if (updateData.valor_estimado !== undefined || updateData.descuento_porcentaje !== undefined) {
        const currentQuote = await this.getQuoteById(id)
        if (currentQuote) {
          const valor_estimado = updateData.valor_estimado ?? currentQuote.valor_estimado
          const descuento = updateData.descuento_porcentaje ?? currentQuote.descuento_porcentaje
          updateData.valor_final = valor_estimado * (1 - descuento / 100)
        }
      }

      const { data, error } = await supabase
        .from('cotizaciones')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating quote:', error)
      return null
    }
  }

  async deleteQuote(id: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockQuotes.findIndex(q => q.id === id)
        if (index !== -1) {
          mockQuotes.splice(index, 1)
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('cotizaciones')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting quote:', error)
      return false
    }
  }

  async getQuotesByStatus(status: string): Promise<Quote[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockQuotes.filter(q => q.estado === status)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .eq('estado', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching quotes by status:', error)
      return []
    }
  }

  async getQuotesByClient(clientId: string): Promise<Quote[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockQuotes.filter(q => q.cliente_id === clientId)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .eq('cliente_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching quotes by client:', error)
      return []
    }
  }

  async updateQuoteStatus(id: string, status: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const quote = mockQuotes.find(q => q.id === id)
        if (quote) {
          quote.estado = status
          quote.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: status })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating quote status:', error)
      return false
    }
  }

  async sendQuote(id: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const quote = mockQuotes.find(q => q.id === id)
        if (quote && quote.estado === 'borrador') {
          quote.estado = 'enviada'
          quote.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'enviada' })
        .eq('id', id)
        .eq('estado', 'borrador')

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error sending quote:', error)
      return false
    }
  }

  async approveQuote(id: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const quote = mockQuotes.find(q => q.id === id)
        if (quote && quote.estado === 'enviada') {
          quote.estado = 'aprobada'
          quote.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'aprobada' })
        .eq('id', id)
        .eq('estado', 'enviada')

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error approving quote:', error)
      return false
    }
  }

  async generateQuoteNumber(): Promise<string> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 200))
        const timestamp = Date.now()
        return `COT-${timestamp.toString().slice(-6)}`
      }

      if (!supabase) return `COT-${Date.now().toString().slice(-6)}`

      const { data, error } = await supabase
        .from('cotizaciones')
        .select('numero_cotizacion')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error

      const lastNumber = data?.[0]?.numero_cotizacion
      if (lastNumber) {
        const numberPart = parseInt(lastNumber.split('-')[1]) || 0
        return `COT-${(numberPart + 1).toString().padStart(6, '0')}`
      }
      
      return 'COT-000001'
    } catch (error) {
      console.error('Error generating quote number:', error)
      return `COT-${Date.now().toString().slice(-6)}`
    }
  }

  async getExpiredQuotes(): Promise<Quote[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const today = new Date().toISOString().split('T')[0]
        return mockQuotes.filter(q => 
          q.fecha_vencimiento < today && 
          (q.estado === 'enviada' || q.estado === 'borrador')
        )
      }

      if (!supabase) return []

      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .lt('fecha_vencimiento', today)
        .in('estado', ['enviada', 'borrador'])

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching expired quotes:', error)
      return []
    }
  }

  async markExpiredQuotes(): Promise<number> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const today = new Date().toISOString().split('T')[0]
        let count = 0
        mockQuotes.forEach(q => {
          if (q.fecha_vencimiento < today && (q.estado === 'enviada' || q.estado === 'borrador')) {
            q.estado = 'vencida'
            q.updated_at = new Date().toISOString()
            count++
          }
        })
        return count
      }

      if (!supabase) return 0

      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'vencida' })
        .lt('fecha_vencimiento', today)
        .in('estado', ['enviada', 'borrador'])
        .select('id')

      if (error) throw error
      return data?.length || 0
    } catch (error) {
      console.error('Error marking expired quotes:', error)
      return 0
    }
  }
}

export const quoteService = new QuoteService()
