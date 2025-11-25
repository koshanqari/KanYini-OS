'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockProjects, mockProjectCategories, mockProjectManagers } from '@/data/projectMockData';
import { Project, ProjectStatus } from '@/types';
import {
  Search,
  Plus,
  Filter,
  FolderKanban,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'budget' | 'progress' | 'recent'>('name');

  // Filter projects
  let filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesType = filterType === 'all' || project.type === filterType;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  // Sort projects
  filteredProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'budget') {
      return b.totalBudget - a.totalBudget;
    } else if (sortBy === 'progress') {
      return b.overallProgress - a.overallProgress;
    } else if (sortBy === 'recent') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    return 0;
  });

  // Stats
  const activeProjects = mockProjects.filter((p) => p.status === 'Active').length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.totalSpent, 0);
  const totalBeneficiaries = mockProjects.reduce((sum, p) => sum + (p.beneficiariesReached || 0), 0);

  const getStatusBadge = (status: ProjectStatus) => {
    const variants: Record<ProjectStatus, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
      Active: 'success',
      Completed: 'info',
      'On Hold': 'warning',
      Planning: 'default',
      Cancelled: 'error',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Education: 'bg-blue-100 text-blue-800',
      Healthcare: 'bg-red-100 text-red-800',
      Livelihood: 'bg-green-100 text-green-800',
      Environment: 'bg-emerald-100 text-emerald-800',
      'Water & Sanitation': 'bg-cyan-100 text-cyan-800',
      'Community Development': 'bg-purple-100 text-purple-800',
      'Emergency Response': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600 mt-1">
            Track and manage all projects, campaigns, and programs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/projects/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FolderKanban className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Projects</div>
              <div className="text-2xl font-bold text-gray-900">{activeProjects}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Budget</div>
              <div className="text-2xl font-bold text-gray-900">
                Rs{(totalBudget / 10000000).toFixed(1)}Cr
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Spent</div>
              <div className="text-2xl font-bold text-gray-900">
                Rs{(totalSpent / 10000000).toFixed(1)}Cr
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Beneficiaries</div>
              <div className="text-2xl font-bold text-gray-900">{totalBeneficiaries}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="budget">Sort by Budget</option>
                <option value="progress">Sort by Progress</option>
                <option value="recent">Sort by Recent</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
              >
                <option value="all">All Types</option>
                <option value="Fundraising Campaign">Fundraising Campaign</option>
                <option value="Field Program">Field Program</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Research">Research</option>
                <option value="Advocacy">Advocacy</option>
                <option value="Emergency Relief">Emergency Relief</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
              >
                <option value="all">All Categories</option>
                {mockProjectCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {mockProjects.length} projects
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const budgetUsed = project.totalBudget > 0 ? (project.totalSpent / project.totalBudget) * 100 : 0;
          const beneficiaryProgress =
            project.beneficiaryTarget && project.beneficiariesReached
              ? (project.beneficiariesReached / project.beneficiaryTarget) * 100
              : 0;
          const isOverBudget = budgetUsed > 100;
          const isBehindSchedule = project.overallProgress < 50 && project.status === 'Active';
          const hasBeneficiaries = project.beneficiaryTarget !== undefined && project.beneficiaryTarget > 0;

          return (
            <Card key={project.id} className="hover:shadow-lg transition cursor-pointer">
              <Link href={`/projects/${project.id}`}>
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(project.category)}`}>
                          {project.category}
                        </span>
                        {getStatusBadge(project.status)}
                        <span className="text-xs text-gray-500">{project.type}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                  {/* Alerts */}
                  {(isOverBudget || isBehindSchedule) && (
                    <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs text-yellow-800">
                        {isOverBudget && 'Over budget'}
                        {isOverBudget && isBehindSchedule && ' • '}
                        {isBehindSchedule && 'Behind schedule'}
                      </span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Overall Progress</span>
                      <span className="font-medium text-gray-900">{project.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(project.overallProgress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <DollarSign className="w-3 h-3" />
                        Budget
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        Rs{(project.totalSpent / 100000).toFixed(1)}L / Rs
                        {(project.totalBudget / 100000).toFixed(1)}L
                      </div>
                      <div className="text-xs text-gray-500">{Math.round(budgetUsed)}% used</div>
                    </div>

                    {hasBeneficiaries ? (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Users className="w-3 h-3" />
                          Beneficiaries
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {project.beneficiariesReached} / {project.beneficiaryTarget}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(beneficiaryProgress)}% reached
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Target className="w-3 h-3" />
                          Type
                        </div>
                        <div className="text-sm font-bold text-gray-900">{project.type}</div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.location.length} locations
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">{project.projectManager}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <FolderKanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No projects found</p>
          </div>
        </Card>
      )}
    </div>
  );
}

