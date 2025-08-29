'use client'

import { useState, useEffect } from 'react'
import { serviceManager, type Service, type CreateServiceData, type UpdateServiceData } from '@/lib/services'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await serviceManager.getAllServices()
      setServices(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar servicios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const createService = async (serviceData: CreateServiceData) => {
    try {
      const newService = await serviceManager.createService(serviceData)
      if (newService) {
        setServices(prev => [newService, ...prev])
        return newService
      }
      throw new Error('Error al crear servicio')
    } catch (err) {
      setError('Error al crear servicio')
      throw err
    }
  }

  const updateService = async (serviceData: UpdateServiceData) => {
    try {
      const updatedService = await serviceManager.updateService(serviceData)
      if (updatedService) {
        setServices(prev => 
          prev.map(s => s.id === updatedService.id ? updatedService : s)
        )
        return updatedService
      }
      throw new Error('Error al actualizar servicio')
    } catch (err) {
      setError('Error al actualizar servicio')
      throw err
    }
  }

  const deleteService = async (id: string) => {
    try {
      const success = await serviceManager.deleteService(id)
      if (success) {
        setServices(prev => prev.filter(s => s.id !== id))
        return true
      }
      throw new Error('Error al eliminar servicio')
    } catch (err) {
      setError('Error al eliminar servicio')
      throw err
    }
  }

  const completeService = async (id: string, completionDate?: string) => {
    try {
      const success = await serviceManager.completeService(id, completionDate)
      if (success) {
        setServices(prev => 
          prev.map(s => s.id === id ? { ...s, estado: 'completado', fecha_completado: completionDate || new Date().toISOString() } : s)
        )
        return true
      }
      throw new Error('Error al completar servicio')
    } catch (err) {
      setError('Error al completar servicio')
      throw err
    }
  }

  const cancelService = async (id: string, reason?: string) => {
    try {
      const success = await serviceManager.cancelService(id, reason)
      if (success) {
        setServices(prev => 
          prev.map(s => s.id === id ? { ...s, estado: 'cancelado', observaciones: reason || s.observaciones } : s)
        )
        return true
      }
      throw new Error('Error al cancelar servicio')
    } catch (err) {
      setError('Error al cancelar servicio')
      throw err
    }
  }

  const assignVehicle = async (serviceId: string, vehicleId: string) => {
    try {
      const success = await serviceManager.assignVehicle(serviceId, vehicleId)
      if (success) {
        setServices(prev => 
          prev.map(s => s.id === serviceId ? { ...s, vehiculo_id: vehicleId } : s)
        )
        return true
      }
      throw new Error('Error al asignar vehículo')
    } catch (err) {
      setError('Error al asignar vehículo')
      throw err
    }
  }

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService,
    completeService,
    cancelService,
    assignVehicle
  }
}

export function useService(id: string) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const data = await serviceManager.getServiceById(id)
        setService(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar servicio')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchService()
    }
  }, [id])

  return { service, loading, error }
}

export function useServicesByStatus(status: string) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await serviceManager.getServicesByStatus(status)
        setServices(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar servicios')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [status])

  return { services, loading, error }
}

export function useActiveServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await serviceManager.getActiveServices()
        setServices(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar servicios activos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}

export function useOverdueServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await serviceManager.getOverdueServices()
        setServices(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar servicios vencidos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return { services, loading, error }
}
