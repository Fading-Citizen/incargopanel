import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getVehicleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'turbo': 'Turbo',
    'sencillo': 'Sencillo',
    'dobletroque': 'Dobletroque',
    'mini-mula-2': 'Mini-mula 2 Ejes',
    'mini-mula-3': 'Mini-mula 3 Ejes',
    'mula-2': 'Mula 2 Ejes',
    'mula-3': 'Mula 3 Ejes',
    'refrigerado': 'Refrigerado',
    'plataforma': 'Plataforma Abierta',
    'contenedor': 'Contenedor Especial'
  }
  return labels[type] || type
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'inactive': 'bg-gray-100 text-gray-800',
    'available': 'bg-green-100 text-green-800',
    'in_transit': 'bg-blue-100 text-blue-800',
    'maintenance': 'bg-yellow-100 text-yellow-800',
    'quote': 'bg-yellow-100 text-yellow-800',
    'confirmed': 'bg-blue-100 text-blue-800',
    'in_progress': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'sent': 'bg-blue-100 text-blue-800',
    'accepted': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'expired': 'bg-gray-100 text-gray-800',
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'active': 'Activo',
    'inactive': 'Inactivo',
    'available': 'Disponible',
    'in_transit': 'En Tránsito',
    'maintenance': 'Mantenimiento',
    'quote': 'Cotización',
    'confirmed': 'Confirmado',
    'in_progress': 'En Progreso',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'pending': 'Pendiente',
    'sent': 'Enviado',
    'accepted': 'Aceptado',
    'rejected': 'Rechazado',
    'expired': 'Expirado',
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta',
    'urgent': 'Urgente',
  }
  return labels[status] || status
}
