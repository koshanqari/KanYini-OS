'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockTeamMembers } from '@/data/teamMockData';
import {
  Search,
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Award,
  Calendar
} from 'lucide-react';
import { TeamMemberType, TeamMemberStatus, Department } from '@/types';

export default function TeamPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TeamMemberType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TeamMemberStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'all'>('all');

  // Stats
  const totalTeam = mockTeamMembers.length;
  const activeMembers = mockTeamMembers.filter(m => m.status === 'active').length;
  const fullTime = mockTeamMembers.filter(m => m.type === 'full-time').length;
  const fellows = mockTeamMembers.filter(m => m.type === 'fellow').length;
  const partTime = mockTeamMembers.filter(m => m.type === 'part-time').length;

  // Filtered team members
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || member.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesType && matchesStatus && matchesDepartment;
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team</h2>
          <p className="text-gray-600 mt-1">Manage team members, fellows, and contributors</p>
        </div>
        <Button variant="primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Team</p>
                <p className="text-2xl font-bold text-gray-900">{totalTeam}</p>
              </div>
              <Users className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{activeMembers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Full-Time</p>
                <p className="text-2xl font-bold text-blue-600">{fullTime}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fellows</p>
                <p className="text-2xl font-bold text-purple-600">{fellows}</p>
              </div>
              <Award className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Part-Time</p>
                <p className="text-2xl font-bold text-orange-600">{partTime}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TeamMemberType | 'all')}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'full-time', label: 'Full-Time' },
                { value: 'part-time', label: 'Part-Time' },
                { value: 'fellow', label: 'Fellow' },
                { value: 'intern', label: 'Intern' },
                { value: 'volunteer', label: 'Volunteer' },
                { value: 'contractor', label: 'Contractor' },
              ]}
              className="w-48"
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TeamMemberStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'on-leave', label: 'On Leave' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="w-48"
            />
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value as Department | 'all')}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'operations', label: 'Operations' },
                { value: 'programs', label: 'Programs' },
                { value: 'communications', label: 'Communications' },
                { value: 'finance', label: 'Finance' },
                { value: 'technology', label: 'Technology' },
                { value: 'fundraising', label: 'Fundraising' },
                { value: 'field', label: 'Field' },
                { value: 'research', label: 'Research' },
              ]}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card
            key={member.id}
            className="cursor-pointer hover:shadow-lg transition"
            onClick={() => router.push(`/team/${member.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {member.profilePicture ? (
                  <Image
                    src={member.profilePicture}
                    alt={member.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-kanyini-primary text-white flex items-center justify-center text-xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{member.role}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant={getTypeVariant(member.type)} className="capitalize text-xs">
                      {member.type.replace('-', ' ')}
                    </Badge>
                    <Badge variant={getStatusVariant(member.status)} className="capitalize text-xs">
                      {member.status.replace('-', ' ')}
                    </Badge>
                    {member.teamLead && (
                      <Badge variant="info" className="text-xs">
                        Team Lead
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {member.bio && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{member.bio}</p>
              )}

              <div className="mt-4 space-y-2">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{member.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Joined {member.joinDate.toLocaleDateString()}</span>
                </div>
              </div>

              {member.fellowship && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs font-semibold text-purple-900">{member.fellowship.program}</p>
                  <p className="text-xs text-purple-700 mt-1">{member.fellowship.cohort} • {member.fellowship.duration}</p>
                </div>
              )}

              {member.weeklyHours && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{member.weeklyHours} hours/week</span>
                </div>
              )}

              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{member.activeProjects || 0}</span> active projects
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{member.tasksCompleted || 0}</span> tasks done
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

