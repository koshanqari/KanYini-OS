'use client';

import { DollarSign, FolderKanban, Users, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { dashboardStats, mockDonations } from '@/data/mockData';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const recentDonations = mockDonations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Executive Dashboard</h2>
        <p className="text-gray-600 mt-1">Overview of key metrics and activities</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Donations This Month"
          value={dashboardStats.totalDonationsThisMonth}
          icon={DollarSign}
          format="currency"
          color="green"
          trend={{ value: 12, positive: true }}
        />
        <StatsCard
          title="Active Projects"
          value={dashboardStats.activeProjects}
          icon={FolderKanban}
          color="blue"
        />
        <StatsCard
          title="Active Donors"
          value={dashboardStats.activeDonors}
          icon={Users}
          color="indigo"
          trend={{ value: 8, positive: true }}
        />
        <StatsCard
          title="Field Reports"
          value={dashboardStats.fieldReportsSubmitted}
          icon={FileText}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses (2025)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Revenue</span>
                  <span className="text-sm font-bold text-green-600">
                    {formatCurrency(dashboardStats.totalDonationsThisYear)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Expenses</span>
                  <span className="text-sm font-bold text-orange-600">
                    {formatCurrency(5850000)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-600 h-3 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Net Surplus</span>
                  <span className="text-sm font-bold text-blue-600">
                    {formatCurrency(2175000)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Highlights */}
        <Card>
          <CardHeader>
            <CardTitle>Impact Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {formatNumber(dashboardStats.impactMetrics.treesPlanted)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Trees Planted</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {formatNumber(dashboardStats.impactMetrics.carbonOffset)}t
                </div>
                <div className="text-sm text-gray-600 mt-1">CO₂ Offset</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600">
                  {formatNumber(dashboardStats.impactMetrics.peopleImpacted)}
                </div>
                <div className="text-sm text-gray-600 mt-1">People Impacted</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {dashboardStats.impactMetrics.areaCovered}ha
                </div>
                <div className="text-sm text-gray-600 mt-1">Area Covered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      Donor #{donation.donorId}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(donation.date)} · {donation.method}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {formatCurrency(donation.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliance Score</span>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-green-600">{dashboardStats.complianceStatus}%</div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${dashboardStats.complianceStatus}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-xs text-gray-600">Pending Reports</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-xs text-gray-600">Upcoming Deadlines</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
