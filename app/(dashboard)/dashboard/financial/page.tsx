'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import { mockDonations, mockCampaigns, dashboardStats } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';

export default function FinancialDashboardPage() {
  // Calculate breakdown
  const campaignRevenue = mockDonations
    .filter(d => d.campaignId)
    .reduce((sum, d) => sum + d.amount, 0);
  
  const projectRevenue = mockDonations
    .filter(d => d.projectId)
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
        <p className="text-gray-600 mt-1">Revenue, expenses, and financial analytics</p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue (2025)"
          value={dashboardStats.totalDonationsThisYear}
          icon={DollarSign}
          format="currency"
          color="green"
        />
        <StatsCard
          title="Total Expenses"
          value={5850000}
          icon={CreditCard}
          format="currency"
          color="orange"
        />
        <StatsCard
          title="Net Surplus"
          value={2175000}
          icon={TrendingUp}
          format="currency"
          color="blue"
        />
        <StatsCard
          title="Cash Reserve"
          value={3500000}
          icon={PiggyBank}
          format="currency"
          color="indigo"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Campaign Donations</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(campaignRevenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full" 
                    style={{ width: '35%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Project Grants</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(projectRevenue)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: '20%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">General Fund</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(3200000)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full" 
                    style={{ width: '45%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Project Activities</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(3500000)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-orange-600 h-3 rounded-full" 
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Staff & Operations</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(1800000)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-yellow-600 h-3 rounded-full" 
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Administration</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(550000)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-600 h-3 rounded-full" 
                    style={{ width: '10%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cash Flow (2025)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around gap-2">
            {[
              { month: 'Jan', income: 650000, expense: 480000 },
              { month: 'Feb', income: 720000, expense: 520000 },
              { month: 'Mar', income: 890000, expense: 650000 },
              { month: 'Apr', income: 750000, expense: 580000 },
              { month: 'May', income: 680000, expense: 495000 },
              { month: 'Jun', income: 920000, expense: 710000 },
              { month: 'Jul', income: 780000, expense: 625000 },
              { month: 'Aug', income: 850000, expense: 690000 },
              { month: 'Sep', income: 910000, expense: 720000 },
              { month: 'Oct', income: 1020000, expense: 780000 },
              { month: 'Nov', income: 855000, expense: 600000 },
            ].map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1">
                  <div 
                    className="w-full bg-green-500 rounded-t" 
                    style={{ height: `${(data.income / 12000) * 200}px` }}
                    title={`Income: ${formatCurrency(data.income)}`}
                  ></div>
                  <div 
                    className="w-full bg-red-400 rounded-b" 
                    style={{ height: `${(data.expense / 12000) * 200}px` }}
                    title={`Expense: ${formatCurrency(data.expense)}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded"></div>
              <span className="text-sm text-gray-600">Expense</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grant Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Grant Utilization Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">Earth Foundation Grant</div>
                  <div className="text-sm text-gray-500">Expires: Dec 2026</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {formatCurrency(1000000)} / {formatCurrency(5000000)}
                  </div>
                  <div className="text-xs text-gray-500">20% utilized</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">Green Tech CSR Fund</div>
                  <div className="text-sm text-gray-500">Expires: Dec 2025</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {formatCurrency(2000000)} / {formatCurrency(2500000)}
                  </div>
                  <div className="text-xs text-gray-500">80% utilized</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

