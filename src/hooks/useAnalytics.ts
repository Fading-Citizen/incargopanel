'use client'

import { useState, useEffect } from 'react'
import { analyticsService } from '@/lib/services'

export function useDashboardStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getDashboardStats()
      setStats(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar estadísticas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, error, refetch: fetchStats }
}

export function useRevenueData(startDate: string, endDate: string) {
  const [revenueData, setRevenueData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true)
        const data = await analyticsService.getRevenueData(startDate, endDate)
        setRevenueData(data)
        setError(null)
      } catch (err) {
        setError('Error al cargar datos de ingresos')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (startDate && endDate) {
      fetchRevenueData()
    }
  }, [startDate, endDate])

  return { revenueData, loading, error }
}

export function useFleetUtilization() {
  const [utilizationData, setUtilizationData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUtilizationData = async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getFleetUtilization()
      setUtilizationData(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar datos de utilización')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUtilizationData()
  }, [])

  return { utilizationData, loading, error, refetch: fetchUtilizationData }
}

export function useClientPerformance() {
  const [performanceData, setPerformanceData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformanceData = async () => {
    try {
      setLoading(true)
      const data = await analyticsService.getClientPerformance()
      setPerformanceData(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar datos de rendimiento')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPerformanceData()
  }, [])

  return { performanceData, loading, error, refetch: fetchPerformanceData }
}
