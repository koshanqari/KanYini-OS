'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockProjects } from '@/data/projectMockData';
import { mockDonors } from '@/data/mockData';
import { mockBeneficiaries } from '@/data/beneficiaryMockData';
import {
  FolderKanban,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Target,
  TrendingUp,
  Edit,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Briefcase,
  Mail,
  Phone,
  Heart,
  Activity,
} from 'lucide-react';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const project = mockProjects.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'milestones' | 'budget' | 'impact' | 'donors' | 'beneficiaries' | 'team' | 'documents'
  >('overview');

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const budgetUsed = project.totalBudget > 0 ? (project.totalSpent / project.totalBudget) * 100 : 0;
  const beneficiaryProgress =
    project.beneficiaryTarget && project.beneficiariesReached
      ? (project.beneficiariesReached / project.beneficiaryTarget) * 100
      : 0;
  const hasBeneficiaries = project.beneficiaryTarget !== undefined && project.beneficiaryTarget > 0;
  const hasDonors = project.linkedDonors && project.linkedDonors.length > 0;

  // Get linked donors and beneficiaries
  const linkedDonors = project.linkedDonors
    ? mockDonors.filter((donor) => project.linkedDonors?.includes(donor.id))
    : [];
  const linkedBeneficiaries = project.linkedBeneficiaries
    ? mockBeneficiaries.filter((ben) => project.linkedBeneficiaries?.includes(ben.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant={
                  project.status === 'Active'
                    ? 'success'
                    : project.status === 'Completed'
                    ? 'info'
                    : project.status === 'Planning'
                    ? 'default'
                    : 'warning'
                }
              >
                {project.status}
              </Badge>
              <span className="text-sm text-gray-600">{project.type}</span>
              <span className="text-sm text-gray-600">{project.category}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button variant="secondary" size="sm">
            <Edit className="w-4 h-4" />
            Edit Project
          </Button>
        </div>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div>
            <div className="text-sm text-gray-600 mb-1">Overall Progress</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{project.overallProgress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(project.overallProgress, 100)}%` }}
              />
            </div>
          </div>
        </Card>
        <Card>
          <div>
            <div className="text-sm text-gray-600 mb-1">Budget Utilization</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{Math.round(budgetUsed)}%</div>
            <div className="text-xs text-gray-600">
              Rs{(project.totalSpent / 100000).toFixed(1)}L of Rs{(project.totalBudget / 100000).toFixed(1)}L
            </div>
          </div>
        </Card>
        {hasBeneficiaries ? (
          <Card>
            <div>
              <div className="text-sm text-gray-600 mb-1">Beneficiaries Reached</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {project.beneficiariesReached}
              </div>
              <div className="text-xs text-gray-600">Target: {project.beneficiaryTarget}</div>
            </div>
          </Card>
        ) : (
          <Card>
            <div>
              <div className="text-sm text-gray-600 mb-1">Project Type</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{project.type}</div>
              <div className="text-xs text-gray-600">{project.category}</div>
            </div>
          </Card>
        )}
        <Card>
          <div>
            <div className="text-sm text-gray-600 mb-1">Milestones</div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {project.milestones.filter((m) => m.status === 'Completed').length}/
              {project.milestones.length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {(['overview', 'milestones', 'budget', 'impact', 'donors', 'beneficiaries', 'team', 'documents'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === tab
                  ? 'border-kanyini-primary text-kanyini-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{project.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Start Date</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {project.endDate && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">End Date</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(project.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className="text-sm font-medium text-gray-900">{project.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="text-sm font-medium text-gray-900">
                        {project.district}, {project.state}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expected Impact (KC Specific) */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
                  <p className="text-gray-900 leading-relaxed">{project.expectedImpact}</p>
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>Project Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* KC App Funding & Team Progress */}
            <Card>
              <CardHeader>
                <CardTitle>KC App - Community Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Funding Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Funding Progress (KC Display)</span>
                      <span className="text-sm font-bold text-kanyini-primary">
                        {Math.round((project.moneyRaised / project.moneyRequired) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-kanyini-primary h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((project.moneyRaised / project.moneyRequired) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      ₹{(project.moneyRaised / 100000).toFixed(1)}L raised of ₹{(project.moneyRequired / 100000).toFixed(1)}L goal
                    </p>
                  </div>

                  {/* Team Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">Team Progress (KC Display)</span>
                      <span className="text-sm font-bold text-green-600">
                        {Math.round((project.membersJoined / project.membersRequired) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((project.membersJoined / project.membersRequired) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {project.membersJoined} members joined • {project.membersRequired - project.membersJoined} more needed
                    </p>
                  </div>

                  {/* Community Stats */}
                  <div className="pt-4 border-t grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">KC Followers</div>
                      <div className="text-2xl font-bold text-gray-900">{project.followers.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Active Members</div>
                      <div className="text-2xl font-bold text-gray-900">{project.activeMembers}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations */}
            <Card>
              <CardHeader>
                <CardTitle>Project Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.location.map((loc, idx) => (
                    <Badge key={idx} variant="secondary">
                      <MapPin className="w-3 h-3 mr-1" />
                      {loc}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* KC Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>KC App - Project Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-kanyini-primary to-green-700 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {project.startedBy.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-0.5">Started By</div>
                    <div className="text-lg font-bold text-gray-900">{project.startedBy}</div>
                    <div className="text-xs text-gray-600 mt-1">{project.followers} followers on KC</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Manager */}
            <Card>
              <CardHeader>
                <CardTitle>Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Project Manager</div>
                      <div className="text-sm font-medium text-gray-900">{project.projectManager}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Team Members</div>
                    <div className="space-y-2">
                      {project.teamMembers.map((member, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Funding Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Funding Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.fundingSources.map((source, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{source.source}</div>
                        <Badge variant="info" className="mt-1">
                          {source.type}
                        </Badge>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        Rs{(source.amount / 100000).toFixed(1)}L
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Linked Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {hasDonors && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Linked Donors</span>
                      <span className="font-medium text-gray-900">{project.linkedDonors?.length || 0}</span>
                    </div>
                  )}
                  {hasBeneficiaries && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Linked Beneficiaries</span>
                      <span className="font-medium text-gray-900">
                        {project.linkedBeneficiaries?.length || 0}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Documents</span>
                    <span className="font-medium text-gray-900">{project.documents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Team Members</span>
                    <span className="font-medium text-gray-900">{project.teamMembers.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Milestones</CardTitle>
              <Button variant="primary" size="sm">
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`border-l-4 pl-4 py-3 rounded ${
                    milestone.status === 'Completed'
                      ? 'border-green-500 bg-green-50'
                      : milestone.status === 'In Progress'
                      ? 'border-blue-500 bg-blue-50'
                      : milestone.status === 'Delayed'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <Badge
                          variant={
                            milestone.status === 'Completed'
                              ? 'success'
                              : milestone.status === 'In Progress'
                              ? 'info'
                              : milestone.status === 'Delayed'
                              ? 'error'
                              : 'default'
                          }
                        >
                          {milestone.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </div>
                        {milestone.completedDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {milestone.assignedTo}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Budget Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Budget</div>
                  <div className="text-2xl font-bold text-gray-900">
                    Rs{(project.totalBudget / 100000).toFixed(2)}L
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                  <div className="text-2xl font-bold text-blue-600">
                    Rs{(project.totalSpent / 100000).toFixed(2)}L
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Remaining</div>
                  <div className="text-2xl font-bold text-green-600">
                    Rs{((project.totalBudget - project.totalSpent) / 100000).toFixed(2)}L
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    budgetUsed > 90 ? 'bg-red-600' : budgetUsed > 70 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.budgetLines.map((line) => {
                  const lineUsed = line.budgeted > 0 ? (line.spent / line.budgeted) * 100 : 0;
                  return (
                    <div key={line.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900">{line.category}</div>
                          <div className="text-sm text-gray-600">{line.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            Rs{(line.spent / 100000).toFixed(1)}L / Rs{(line.budgeted / 100000).toFixed(1)}L
                          </div>
                          <div className="text-sm text-gray-600">{Math.round(lineUsed)}% used</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            lineUsed > 90 ? 'bg-red-600' : lineUsed > 70 ? 'bg-yellow-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(lineUsed, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Impact Tab */}
      {activeTab === 'impact' && (
        <Card>
          <CardHeader>
            <CardTitle>Impact Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.impactMetrics.map((metric) => {
                const progress = metric.target > 0 ? (metric.achieved / metric.target) * 100 : 0;
                return (
                  <div key={metric.id} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">{metric.indicator}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="font-bold text-gray-900">
                        {metric.achieved} / {metric.target} {metric.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{Math.round(progress)}% achieved</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donors Tab */}
      {activeTab === 'donors' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Linked Donors ({linkedDonors.length})</CardTitle>
              <Button variant="primary" size="sm">
                Link Donor
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {linkedDonors.length > 0 ? (
              <div className="space-y-4">
                {linkedDonors.map((donor) => {
                  const totalContributions = donor.totalDonations || 0;
                  return (
                    <div
                      key={donor.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => (window.location.href = `/donors/${donor.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                            {donor.name.charAt(0)}
                          </div>

                          {/* Donor Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{donor.name}</h4>
                              <Badge
                                variant={
                                  donor.tier === 'Major'
                                    ? 'success'
                                    : donor.tier === 'Regular'
                                    ? 'info'
                                    : 'default'
                                }
                              >
                                {donor.tier} Donor
                              </Badge>
                              <Badge variant="secondary">{donor.type}</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                {donor.email}
                              </div>
                              {donor.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="w-4 h-4" />
                                  {donor.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {donor.city}, {donor.state}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Activity className="w-4 h-4" />
                                Engagement: {donor.engagementLevel || 'Medium'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Contribution Stats */}
                        <div className="text-right ml-4">
                          <div className="text-xs text-gray-500 mb-1">Total Contributions</div>
                          <div className="text-2xl font-bold text-kanyini-primary">
                            ₹{(totalContributions / 100000).toFixed(1)}L
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {donor.donations?.length || 0} donations
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Donors Linked</h3>
                <p className="text-sm mb-4">This project doesn't have any linked donors yet.</p>
                <Button variant="primary" size="sm">
                  Link First Donor
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Beneficiaries Tab */}
      {activeTab === 'beneficiaries' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Linked Beneficiaries ({linkedBeneficiaries.length})</CardTitle>
              <Button variant="primary" size="sm">
                Link Beneficiary
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {linkedBeneficiaries.length > 0 ? (
              <div className="space-y-4">
                {linkedBeneficiaries.map((beneficiary) => {
                  return (
                    <div
                      key={beneficiary.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => (window.location.href = `/beneficiaries/${beneficiary.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                          {beneficiary.name.charAt(0)}
                        </div>

                        {/* Beneficiary Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{beneficiary.name}</h4>
                            <Badge
                              variant={
                                beneficiary.status === 'Active'
                                  ? 'success'
                                  : beneficiary.status === 'Completed'
                                  ? 'info'
                                  : beneficiary.status === 'Inactive'
                                  ? 'warning'
                                  : 'default'
                              }
                            >
                              {beneficiary.status}
                            </Badge>
                            <Badge variant="secondary">{beneficiary.type}</Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-3">
                            {beneficiary.type === 'Individual' && beneficiary.age && (
                              <div>
                                <div className="text-xs text-gray-500">Age</div>
                                <div className="text-sm font-medium text-gray-900">{beneficiary.age} years</div>
                              </div>
                            )}
                            <div>
                              <div className="text-xs text-gray-500">Case Manager</div>
                              <div className="text-sm font-medium text-gray-900">
                                {beneficiary.caseManager || 'Unassigned'}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Location</div>
                              <div className="text-sm font-medium text-gray-900">
                                {beneficiary.city || beneficiary.district}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Enrolled Programs</div>
                              <div className="text-sm font-medium text-gray-900">
                                {beneficiary.enrolledPrograms?.length || 0} programs
                              </div>
                            </div>
                            {beneficiary.type !== 'Individual' && (
                              <div>
                                <div className="text-xs text-gray-500">Organization Type</div>
                                <div className="text-sm font-medium text-gray-900">
                                  {beneficiary.organizationDetails?.organizationType || 'N/A'}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Service Summary */}
                          {beneficiary.serviceHistory && beneficiary.serviceHistory.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-xs text-gray-500 mb-1">Recent Services</div>
                              <div className="flex flex-wrap gap-1">
                                {beneficiary.serviceHistory
                                  .slice(0, 3)
                                  .map((service) => (
                                    <Badge key={service.id} variant="secondary" className="text-xs">
                                      {service.serviceType}
                                    </Badge>
                                  ))}
                                {beneficiary.serviceHistory.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{beneficiary.serviceHistory.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Beneficiaries Linked</h3>
                <p className="text-sm mb-4">This project doesn't have any linked beneficiaries yet.</p>
                <Button variant="primary" size="sm">
                  Link First Beneficiary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <Card>
          <CardHeader>
            <CardTitle>Project Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {project.projectManager.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{project.projectManager}</div>
                    <Badge variant="info">Project Manager</Badge>
                  </div>
                </div>
              </div>
              {project.teamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-bold">
                    {member.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{member}</div>
                    <div className="text-sm text-gray-600">Team Member</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Project Documents</CardTitle>
              <Button variant="primary" size="sm">
                Upload Document
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {project.documents.length > 0 ? (
              <div className="space-y-3">
                {project.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-600">
                          {doc.type} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No documents uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

