import { createClient } from '@supabase/supabase-js'

// Variables de entorno con valores por defecto para desarrollo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://localhost:3000'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

// Verificar si las variables están configuradas correctamente
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url !== 'your_supabase_url_here' && url !== 'https://localhost:3000'
  } catch {
    return false
  }
}

const isValidKey = (key: string) => {
  return key && key !== 'your_supabase_anon_key_here' && key !== 'demo-key'
}

// Solo crear el cliente de Supabase si las variables están configuradas
export const supabase = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Flag para determinar si estamos en modo de demostración
export const isDemoMode = !supabase

export type Database = {
  public: {
    Tables: {
      // Usuarios del sistema
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'operator' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'operator' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'operator' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
      // Clientes
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          nit: string
          contact_person: string
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          address: string
          city: string
          nit: string
          contact_person: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          address?: string
          city?: string
          nit?: string
          contact_person?: string
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
      // Vehículos de la flota
      vehicles: {
        Row: {
          id: string
          plate: string
          type: 'turbo' | 'sencillo' | 'dobletroque' | 'mini-mula-2' | 'mini-mula-3' | 'mula-2' | 'mula-3' | 'refrigerado' | 'plataforma' | 'contenedor'
          capacity: number
          status: 'available' | 'in_transit' | 'maintenance' | 'inactive'
          driver_name: string
          driver_phone: string
          driver_license: string
          soat_expiry: string
          tech_review_expiry: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          plate: string
          type: 'turbo' | 'sencillo' | 'dobletroque' | 'mini-mula-2' | 'mini-mula-3' | 'mula-2' | 'mula-3' | 'refrigerado' | 'plataforma' | 'contenedor'
          capacity: number
          status?: 'available' | 'in_transit' | 'maintenance' | 'inactive'
          driver_name: string
          driver_phone: string
          driver_license: string
          soat_expiry: string
          tech_review_expiry: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          plate?: string
          type?: 'turbo' | 'sencillo' | 'dobletroque' | 'mini-mula-2' | 'mini-mula-3' | 'mula-2' | 'mula-3' | 'refrigerado' | 'plataforma' | 'contenedor'
          capacity?: number
          status?: 'available' | 'in_transit' | 'maintenance' | 'inactive'
          driver_name?: string
          driver_phone?: string
          driver_license?: string
          soat_expiry?: string
          tech_review_expiry?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Servicios/Proyectos
      services: {
        Row: {
          id: string
          client_id: string
          type: 'transporte_nacional' | 'carga_mercancia' | 'bodegaje' | 'vehiculos_rodados' | 'proyecto_logistico'
          title: string
          description: string
          origin: string
          destination: string
          cargo_type: string
          weight: number
          volume: number
          value: number
          status: 'quote' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          start_date: string
          end_date: string
          vehicle_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          type: 'transporte_nacional' | 'carga_mercancia' | 'bodegaje' | 'vehiculos_rodados' | 'proyecto_logistico'
          title: string
          description: string
          origin: string
          destination: string
          cargo_type: string
          weight: number
          volume: number
          value: number
          status?: 'quote' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date: string
          end_date: string
          vehicle_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          type?: 'transporte_nacional' | 'carga_mercancia' | 'bodegaje' | 'vehiculos_rodados' | 'proyecto_logistico'
          title?: string
          description?: string
          origin?: string
          destination?: string
          cargo_type?: string
          weight?: number
          volume?: number
          value?: number
          status?: 'quote' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date?: string
          end_date?: string
          vehicle_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Cotizaciones
      quotes: {
        Row: {
          id: string
          client_id: string
          service_type: string
          origin: string
          destination: string
          cargo_details: string
          weight: number
          volume: number
          quoted_price: number
          status: 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired'
          valid_until: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          service_type: string
          origin: string
          destination: string
          cargo_details: string
          weight: number
          volume: number
          quoted_price: number
          status?: 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired'
          valid_until: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          service_type?: string
          origin?: string
          destination?: string
          cargo_details?: string
          weight?: number
          volume?: number
          quoted_price?: number
          status?: 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired'
          valid_until?: string
          created_at?: string
          updated_at?: string
        }
      }
      // Contenedores
      containers: {
        Row: {
          id: string
          container_number: string
          type: '20ft' | '40ft' | '40ft_hc' | 'special'
          status: 'available' | 'in_use' | 'maintenance' | 'transit'
          current_location: string
          client_id?: string
          service_id?: string
          last_inspection: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          container_number: string
          type: '20ft' | '40ft' | '40ft_hc' | 'special'
          status?: 'available' | 'in_use' | 'maintenance' | 'transit'
          current_location: string
          client_id?: string
          service_id?: string
          last_inspection: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          container_number?: string
          type?: '20ft' | '40ft' | '40ft_hc' | 'special'
          status?: 'available' | 'in_use' | 'maintenance' | 'transit'
          current_location?: string
          client_id?: string
          service_id?: string
          last_inspection?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
