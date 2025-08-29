'use client'

import { BellIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notifications] = useState(3) // Mock notification count

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          onClick={onMenuClick}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Page title - will be updated by each page */}
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Panel Administrativo
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <BellIcon className="h-6 w-6" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">admin@incargo.co</p>
            </div>
            <UserCircleIcon className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  )
}
