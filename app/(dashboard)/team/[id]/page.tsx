'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockTeamMembers } from '@/data/teamMockData';
import { mockProjects } from '@/data/projectMockData';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Globe,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import { TeamMemberType, TeamMemberStatus } from '@/types';

export default function TeamMemberDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const member = mockTeamMembers.find(m => m.id === params.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'performance'>('overview');

  if (!member) {
    return (
      <div className="space-y-6">
        <BackButton href="/team" label="Back to Team" />
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Team member not found</h3>
            <p className="text-gray-600 mb-4">The team member you are looking for does not exist.</p>
            <Button onClick={() => router.push('/team')}>
              Back to Team
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTypeVariant = (type: TeamMemberType): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (type) {
      case 'full-time': return 'success';
      case 'fellow': return 'info';
      case 'part-time': return 'warning';
      case 'intern': return 'default';
      case 'volunteer': return 'info';
      case 'contractor': return 'warning';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: TeamMemberStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'active': return 'success';
      case 'on-leave': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const memberProjects = mockProjects.filter(p => member.projects.includes(p.id));

  return (
    <div className="space-y-6">
      <BackButton href="/team" label="Back to Team" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {member.profilePicture ? (
            <Image
              src={member.profilePicture}
              alt={member.name}
              width={80}
              height={80}
              className="rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-kanyini-primary text-white flex items-center justify-center text-2xl font-bold">
              {member.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{member.name}</h1>
            <p className="text-lg text-gray-600">{member.role}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getTypeVariant(member.type)} className="capitalize">
                {member.type.replace('-', ' ')}
              </Badge>
              <Badge variant={getStatusVariant(member.status)} className="capitalize">
                {member.status.replace('-', ' ')}
              </Badge>
              <Badge variant="default" className="capitalize">
                {member.department}
              </Badge>
              {member.teamLead && (
                <Badge variant="info">Team Lead</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
          <Button variant="secondary">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'overview'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'projects'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Projects ({member.projects.length})
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'performance'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact & Bio */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {member.bio && <p className="text-gray-700 mb-4">{member.bio}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {member.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{member.phone}</span>
                    </div>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{member.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Joined {member.joinDate.toLocaleDateString()}</span>
                  </div>
                  {member.endDate && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Until {member.endDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  {member.weeklyHours && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{member.weeklyHours} hours/week</span>
                    </div>
                  )}
                </div>
                {(member.linkedIn || member.twitter) && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Social Links</p>
                    <div className="space-y-1">
                      {member.linkedIn && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-3 h-3" />
                          <span>{member.linkedIn}</span>
                        </div>
                      )}
                      {member.twitter && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="w-3 h-3" />
                          <span>{member.twitter}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills & Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Skills & Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <Badge key={idx} variant="info">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {member.languages.map((lang, idx) => (
                      <Badge key={idx} variant="default">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fellowship Details */}
            {member.fellowship && (
              <Card>
                <CardHeader>
                  <CardTitle>Fellowship Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="text-gray-900 font-medium">{member.fellowship.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cohort</p>
                    <p className="text-gray-900">{member.fellowship.cohort}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-gray-900">{member.fellowship.duration}</p>
                  </div>
                  {member.fellowship.stipend && (
                    <div>
                      <p className="text-sm text-gray-600">Monthly Stipend</p>
                      <p className="text-gray-900 font-medium">₹{member.fellowship.stipend.toLocaleString()}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Projects</p>
                  <p className="text-2xl font-bold text-kanyini-primary">{member.activeProjects || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tasks Completed</p>
                  <p className="text-2xl font-bold text-green-600">{member.tasksCompleted || 0}</p>
                </div>
                {member.lastActive && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Last Active</p>
                    <p className="text-sm text-gray-900">{member.lastActive.toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {member.reportingTo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reporting Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Reports to</p>
                      <p className="text-sm font-medium text-gray-900">
                        {mockTeamMembers.find(m => m.id === member.reportingTo)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {member.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{member.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          {memberProjects.length > 0 ? (
            memberProjects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="info" className="capitalize">{project.category}</Badge>
                        <Badge variant="success" className="capitalize">{project.status}</Badge>
                        {project.location.map((loc, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{loc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active projects</h3>
                <p className="text-gray-600">This team member is not currently assigned to any projects.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                    <p className="text-2xl font-bold text-green-600">{member.tasksCompleted || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-blue-600">{member.activeProjects || 0}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Time with Kanyini</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.floor((new Date().getTime() - member.joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} mo
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Project Completion Rate</span>
                  <span className="text-sm font-semibold text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Task Success Rate</span>
                  <span className="text-sm font-semibold text-gray-900">92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Team Collaboration</span>
                  <span className="text-sm font-semibold text-gray-900">88%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Successfully launched Clean Water Project</p>
                    <p className="text-xs text-gray-600">November 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Completed 100+ tasks ahead of schedule</p>
                    <p className="text-xs text-gray-600">October 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Led team of 5 volunteers successfully</p>
                    <p className="text-xs text-gray-600">September 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

