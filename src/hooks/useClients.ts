'use client'

import { useState, useEffect } from 'react'
import { clientService, type Client, type CreateClientData, type UpdateClientData } from '@/lib/services'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const data = await clientService.getAllClients()
      setClients(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar clientes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const createClient = async (clientData: CreateClientData) => {
    try {
      const newClient = await clientService.createClient(clientData)
      if (newClient) {
        setClients(prev => [newClient, ...prev])
        return newClient
      }
      throw new Error('Error al crear cliente')
    } catch (err) {
      setError('Error al crear cliente')
      throw err
    }
  }

  const updateClient = async (clientData: UpdateClientData) => {
    try {
      const updatedClient = await clientService.updateClient(clientData)
      if (updatedClient) {
        setClients(prev => 
          prev.map(c => c.id === updatedClient.id ? updatedClient : c)
        )
        return updatedClient
      }
      throw new Error('Error al actualizar cliente')
    } catch (err) {
      setError('Error al actualizar cliente')
      throw err
    }
  }

  const deleteClient = async (id: string) => {
    try {
      const success = await clientService.deleteClient(id)
      if (success) {
        setClients(prev => prev.filter(c => c.id !== id))
        return true
      }
      throw new Error('Error al eliminar cliente')
    } catch (err) {
      setError('Error al eliminar cliente')
      throw err
    }
  }

  const searchClients = async (searchTerm: string) => {
    try {
      setLoading(true)
      const data = await clientService.searchClients(searchTerm)
      setClients(data)
      setError(null)
    } catch (err) {
      setError('Error al buscar clientes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    deleteClient,
    searchClients
  }
}

export function useClient(id: string) {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true)
        const data = await clientService.getClientById(id)
        setClient(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar cliente')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchClient()
    }
  }, [id])

  return { client, loading, error }
}

export function useActiveClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await clientService.getActiveClients()
        setClients(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar clientes activos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, loading, error }
}

export function useClientsByType(type: string) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await clientService.getClientsByType(type)
        setClients(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar clientes por tipo')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [type])

  return { clients, loading, error }
}
