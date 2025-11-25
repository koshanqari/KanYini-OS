'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TreePine, Droplets, Users, MapPin } from 'lucide-react';
import { dashboardStats, mockProjects } from '@/data/mockData';
import { formatNumber } from '@/lib/utils';

export default function ImpactDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Impact Dashboard</h2>
        <p className="text-gray-600 mt-1">Environmental and social impact metrics</p>
      </div>

      {/* Impact KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Trees Planted"
          value={dashboardStats.impactMetrics.treesPlanted}
          icon={TreePine}
          color="green"
        />
        <StatsCard
          title="CO₂ Offset (tonnes)"
          value={dashboardStats.impactMetrics.carbonOffset}
          icon={Droplets}
          color="blue"
        />
        <StatsCard
          title="People Impacted"
          value={dashboardStats.impactMetrics.peopleImpacted}
          icon={Users}
          color="indigo"
        />
        <StatsCard
          title="Area Covered (hectares)"
          value={dashboardStats.impactMetrics.areaCovered}
          icon={MapPin}
          color="orange"
        />
      </div>

      {/* Impact by Project Type */}
      <Card>
        <CardHeader>
          <CardTitle>Impact by Project Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="text-sm text-gray-600 mb-2">Reforestation</div>
              <div className="text-2xl font-bold text-green-700 mb-1">4,200</div>
              <div className="text-xs text-gray-500">trees planted</div>
              <div className="mt-2 text-xs text-gray-600">92% survival rate</div>
            </div>
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="text-sm text-gray-600 mb-2">Water Conservation</div>
              <div className="text-2xl font-bold text-blue-700 mb-1">850</div>
              <div className="text-xs text-gray-500">people benefited</div>
              <div className="mt-2 text-xs text-gray-600">15 villages</div>
            </div>
            <div className="border rounded-lg p-4 bg-indigo-50">
              <div className="text-sm text-gray-600 mb-2">Education</div>
              <div className="text-2xl font-bold text-indigo-700 mb-1">400</div>
              <div className="text-xs text-gray-500">farmers trained</div>
              <div className="mt-2 text-xs text-gray-600">3 workshops</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Impact Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <div className="h-full flex items-end justify-around gap-2">
              {[
                { month: 'Jan', trees: 250 },
                { month: 'Feb', trees: 520 },
                { month: 'Mar', trees: 890 },
                { month: 'Apr', trees: 1250 },
                { month: 'May', trees: 1680 },
                { month: 'Jun', trees: 2100 },
                { month: 'Jul', trees: 2550 },
                { month: 'Aug', trees: 2980 },
                { month: 'Sep', trees: 3420 },
                { month: 'Oct', trees: 3890 },
                { month: 'Nov', trees: 4580 },
              ].map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-green-600 rounded-t transition-all hover:bg-green-700" 
                    style={{ height: `${(data.trees / 5000) * 200}px` }}
                    title={`${formatNumber(data.trees)} trees`}
                  ></div>
                  <span className="text-xs text-gray-600">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Impact by Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProjects.filter(p => p.status === 'active' || p.status === 'completed').map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500">{project.location}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Impact</div>
                    <div className="text-sm font-bold text-gray-900">
                      {project.category === 'reforestation' ? '2,500 trees' : '450 people'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Progress</div>
                    <div className="text-sm font-bold text-gray-900">{project.progress}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="text-sm font-bold text-gray-900">
                      {Math.ceil((new Date(project.endDate || new Date()).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geographic Impact Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Map visualization coming soon</p>
              <p className="text-sm text-gray-400 mt-1">
                Projects across Maharashtra, Rajasthan, Kerala, and Punjab
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

