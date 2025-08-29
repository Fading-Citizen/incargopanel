import { supabase, isDemoMode } from '@/lib/supabase'
import { mockVehicles } from '@/lib/mockData'

export interface Vehicle {
  id: string
  placa: string
  tipo: string
  modelo: string
  marca: string
  año: number
  conductor: string
  estado: 'disponible' | 'en_ruta' | 'mantenimiento' | 'fuera_servicio'
  soat_vence: string
  tecno_vence: string
  ubicacion_actual: string
  kilometraje: number
  capacidad_toneladas: number
  created_at?: string
  updated_at?: string
}

export interface CreateVehicleData {
  placa: string
  tipo: string
  modelo: string
  marca: string
  año: number
  conductor: string
  estado: 'disponible' | 'en_ruta' | 'mantenimiento' | 'fuera_servicio'
  soat_vence: string
  tecno_vence: string
  ubicacion_actual: string
  kilometraje: number
  capacidad_toneladas: number
}

export interface UpdateVehicleData extends Partial<CreateVehicleData> {
  id: string
}

class FleetService {
  async getAllVehicles(): Promise<Vehicle[]> {
    try {
      if (isDemoMode) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockVehicles
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      return isDemoMode ? mockVehicles : []
    }
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockVehicles.find(v => v.id === id) || null
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching vehicle:', error)
      return null
    }
  }

  async createVehicle(vehicleData: CreateVehicleData): Promise<Vehicle | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newVehicle: Vehicle = {
          ...vehicleData,
          id: `demo-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockVehicles.unshift(newVehicle)
        return newVehicle
      }

      if (!supabase) return null

      const { data, error } = await supabase
        .from('vehiculos')
        .insert([vehicleData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating vehicle:', error)
      return null
    }
  }

  async updateVehicle(vehicleData: UpdateVehicleData): Promise<Vehicle | null> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockVehicles.findIndex(v => v.id === vehicleData.id)
        if (index !== -1) {
          const { id, ...updateData } = vehicleData
          mockVehicles[index] = {
            ...mockVehicles[index],
            ...updateData,
            updated_at: new Date().toISOString()
          }
          return mockVehicles[index]
        }
        return null
      }

      if (!supabase) return null

      const { id, ...updateData } = vehicleData
      const { data, error } = await supabase
        .from('vehiculos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating vehicle:', error)
      return null
    }
  }

  async deleteVehicle(id: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockVehicles.findIndex(v => v.id === id)
        if (index !== -1) {
          mockVehicles.splice(index, 1)
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('vehiculos')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      return false
    }
  }

  async getVehiclesByStatus(status: string): Promise<Vehicle[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        return mockVehicles.filter(v => v.estado === status)
      }

      if (!supabase) return []

      const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .eq('estado', status)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicles by status:', error)
      return []
    }
  }

  async getVehiclesNearExpiry(days: number = 30): Promise<Vehicle[]> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + days)
        return mockVehicles.filter(v => {
          const soatDate = new Date(v.soat_vence)
          const techDate = new Date(v.tecno_vence)
          return soatDate <= futureDate || techDate <= futureDate
        })
      }

      if (!supabase) return []

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)
      const dateString = futureDate.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('vehiculos')
        .select('*')
        .or(`soat_vence.lte.${dateString},tecno_vence.lte.${dateString}`)
        .order('soat_vence', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicles near expiry:', error)
      return []
    }
  }

  async updateVehicleLocation(id: string, location: string): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const vehicle = mockVehicles.find(v => v.id === id)
        if (vehicle) {
          vehicle.ubicacion_actual = location
          vehicle.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('vehiculos')
        .update({ ubicacion_actual: location })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating vehicle location:', error)
      return false
    }
  }

  async updateVehicleKilometers(id: string, kilometers: number): Promise<boolean> {
    try {
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const vehicle = mockVehicles.find(v => v.id === id)
        if (vehicle) {
          vehicle.kilometraje = kilometers
          vehicle.updated_at = new Date().toISOString()
          return true
        }
        return false
      }

      if (!supabase) return false

      const { error } = await supabase
        .from('vehiculos')
        .update({ kilometraje: kilometers })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating vehicle kilometers:', error)
      return false
    }
  }
}

export const fleetService = new FleetService()
