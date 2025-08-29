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
  tipo_servicio: 'transporte_carga' | 'transporte_pasajeros' | 'almacenamiento' | 'alquiler_vehiculos' | 'proyectos_logisticos'
  descripcion: string
  origen: string
  destino: string
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
  private generateQuoteNumber(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
    return `COT-${year}${month}-${random}`
  }

  private calculateFinalValue(estimatedValue: number, discountPercentage: number): number {
    return estimatedValue - (estimatedValue * (discountPercentage / 100))
  }

  async getAllQuotes(): Promise<Quote[]> {
    try {
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
      return []
    }
  }

  async getQuoteById(id: string): Promise<Quote | null> {
    try {
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
      const numeroQuote = this.generateQuoteNumber()
      const finalValue = this.calculateFinalValue(quoteData.valor_estimado, quoteData.descuento_porcentaje)

      const { data, error } = await supabase
        .from('cotizaciones')
        .insert([{
          ...quoteData,
          numero_cotizacion: numeroQuote,
          fecha_solicitud: new Date().toISOString(),
          estado: 'borrador',
          valor_final: finalValue
        }])
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
      const { id, ...updateData } = quoteData
      
      // Recalcular valor final si se actualizan los valores
      if (updateData.valor_estimado !== undefined || updateData.descuento_porcentaje !== undefined) {
        const currentQuote = await this.getQuoteById(id)
        if (currentQuote) {
          const estimatedValue = updateData.valor_estimado ?? currentQuote.valor_estimado
          const discountPercentage = updateData.descuento_porcentaje ?? currentQuote.descuento_porcentaje
          updateData.valor_final = this.calculateFinalValue(estimatedValue, discountPercentage)
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

  async sendQuote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'enviada' })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error sending quote:', error)
      return false
    }
  }

  async approveQuote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'aprobada' })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error approving quote:', error)
      return false
    }
  }

  async rejectQuote(id: string, reason?: string): Promise<boolean> {
    try {
      const updateData: any = { estado: 'rechazada' }
      if (reason) {
        updateData.observaciones = reason
      }

      const { error } = await supabase
        .from('cotizaciones')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error rejecting quote:', error)
      return false
    }
  }

  async getExpiredQuotes(): Promise<Quote[]> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .in('estado', ['borrador', 'enviada'])
        .lt('fecha_vencimiento', today)
        .order('fecha_vencimiento', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching expired quotes:', error)
      return []
    }
  }

  async markExpiredQuotes(): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('cotizaciones')
        .update({ estado: 'vencida' })
        .in('estado', ['borrador', 'enviada'])
        .lt('fecha_vencimiento', today)
        .select()

      if (error) throw error
      return data?.length || 0
    } catch (error) {
      console.error('Error marking expired quotes:', error)
      return 0
    }
  }

  async getQuotesByDateRange(startDate: string, endDate: string): Promise<Quote[]> {
    try {
      const { data, error } = await supabase
        .from('cotizaciones')
        .select(`
          *,
          cliente:clientes(nombre_empresa, contacto_principal, email)
        `)
        .gte('fecha_solicitud', startDate)
        .lte('fecha_solicitud', endDate)
        .order('fecha_solicitud', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching quotes by date range:', error)
      return []
    }
  }

  async duplicateQuote(id: string): Promise<Quote | null> {
    try {
      const originalQuote = await this.getQuoteById(id)
      if (!originalQuote) return null

      const {
        id: _,
        numero_cotizacion: __,
        fecha_solicitud: ___,
        estado: ____,
        created_at: _____,
        updated_at: ______,
        cliente: _______,
        ...quoteData
      } = originalQuote

      return await this.createQuote({
        ...quoteData,
        descripcion: `COPIA - ${quoteData.descripcion}`
      })
    } catch (error) {
      console.error('Error duplicating quote:', error)
      return null
    }
  }

  async convertQuoteToService(quoteId: string): Promise<boolean> {
    try {
      // Esta función requeriría integración con el ServiceManager
      // Por ahora solo marca la cotización como aprobada
      return await this.approveQuote(quoteId)
    } catch (error) {
      console.error('Error converting quote to service:', error)
      return false
    }
  }
}

export const quoteService = new QuoteService()
