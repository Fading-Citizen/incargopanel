'use client'

import { useState, useEffect } from 'react'
import { fleetService, type Vehicle, type CreateVehicleData, type UpdateVehicleData } from '@/lib/services'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const data = await fleetService.getAllVehicles()
      setVehicles(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar vehículos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const createVehicle = async (vehicleData: CreateVehicleData) => {
    try {
      const newVehicle = await fleetService.createVehicle(vehicleData)
      if (newVehicle) {
        setVehicles(prev => [newVehicle, ...prev])
        return newVehicle
      }
      throw new Error('Error al crear vehículo')
    } catch (err) {
      setError('Error al crear vehículo')
      throw err
    }
  }

  const updateVehicle = async (vehicleData: UpdateVehicleData) => {
    try {
      const updatedVehicle = await fleetService.updateVehicle(vehicleData)
      if (updatedVehicle) {
        setVehicles(prev => 
          prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v)
        )
        return updatedVehicle
      }
      throw new Error('Error al actualizar vehículo')
    } catch (err) {
      setError('Error al actualizar vehículo')
      throw err
    }
  }

  const deleteVehicle = async (id: string) => {
    try {
      const success = await fleetService.deleteVehicle(id)
      if (success) {
        setVehicles(prev => prev.filter(v => v.id !== id))
        return true
      }
      throw new Error('Error al eliminar vehículo')
    } catch (err) {
      setError('Error al eliminar vehículo')
      throw err
    }
  }

  const updateVehicleLocation = async (id: string, location: string) => {
    try {
      const success = await fleetService.updateVehicleLocation(id, location)
      if (success) {
        setVehicles(prev => 
          prev.map(v => v.id === id ? { ...v, ubicacion_actual: location } : v)
        )
        return true
      }
      throw new Error('Error al actualizar ubicación')
    } catch (err) {
      setError('Error al actualizar ubicación')
      throw err
    }
  }

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    updateVehicleLocation
  }
}

export function useVehicle(id: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        const data = await fleetService.getVehicleById(id)
        setVehicle(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar vehículo')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVehicle()
    }
  }, [id])

  return { vehicle, loading, error }
}

export function useVehiclesByStatus(status: string) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        const data = await fleetService.getVehiclesByStatus(status)
        setVehicles(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar vehículos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [status])

  return { vehicles, loading, error }
}
