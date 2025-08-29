'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  TruckIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Flota', href: '/flota', icon: TruckIcon },
  { name: 'Clientes', href: '/clientes', icon: UsersIcon },
  { name: 'Servicios', href: '/servicios', icon: ClipboardDocumentListIcon },
  { name: 'Contenedores', href: '/contenedores', icon: CubeIcon },
  { name: 'Cotizaciones', href: '/cotizaciones', icon: DocumentTextIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
  { name: 'Configuración', href: '/configuracion', icon: CogIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center">
          <TruckIcon className="h-8 w-8 text-green-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">INCARGO</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-green-100 text-green-900'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Company Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          <p className="font-medium">Panel Administrativo</p>
          <p>Versión 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
