import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { FleetStatus } from '@/components/dashboard/fleet-status'

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Bienvenido al panel administrativo de INCARGO
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <RevenueChart />
            <RecentActivity />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <FleetStatus />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
