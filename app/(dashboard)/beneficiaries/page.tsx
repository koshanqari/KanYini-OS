'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockBeneficiaries, mockPrograms, mockCaseManagers, mockLocations } from '@/data/beneficiaryMockData';
import { Beneficiary, BeneficiaryStatus } from '@/types';
import {
  Search,
  Plus,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from 'lucide-react';

export default function BeneficiariesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterCaseManager, setFilterCaseManager] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'recent'>('name');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter beneficiaries
  let filteredBeneficiaries = mockBeneficiaries.filter((ben) => {
    const name = ben.type === 'Individual'
      ? `${ben.firstName} ${ben.lastName}`
      : ben.organizationDetails?.organizationName || '';
    
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ben.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ben.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || ben.status === filterStatus;
    const matchesProgram =
      filterProgram === 'all' || ben.enrolledPrograms.some((p) => p.programId === filterProgram);
    const matchesCaseManager =
      filterCaseManager === 'all' || ben.caseManager === filterCaseManager;
    const matchesLocation =
      filterLocation === 'all' || ben.address.district === filterLocation;
    const matchesGender = filterGender === 'all' || ben.gender === filterGender;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesProgram &&
      matchesCaseManager &&
      matchesLocation &&
      matchesGender
    );
  });

  // Sort beneficiaries
  filteredBeneficiaries = [...filteredBeneficiaries].sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = a.type === 'Individual' ? `${a.firstName} ${a.lastName}` : a.organizationDetails?.organizationName || '';
      const nameB = b.type === 'Individual' ? `${b.firstName} ${b.lastName}` : b.organizationDetails?.organizationName || '';
      return nameA.localeCompare(nameB);
    } else if (sortBy === 'age') {
      return (b.age || 0) - (a.age || 0);
    } else if (sortBy === 'recent') {
      return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
    }
    return 0;
  });

  // Stats
  const activeBeneficiaries = mockBeneficiaries.filter((b) => b.status === 'Active').length;
  const completedBeneficiaries = mockBeneficiaries.filter((b) => b.status === 'Completed').length;
  const inactiveBeneficiaries = mockBeneficiaries.filter((b) => b.status === 'Inactive' || b.status === 'Dropped').length;

  const getStatusBadge = (status: BeneficiaryStatus) => {
    const variants: Record<BeneficiaryStatus, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
      Active: 'success',
      Completed: 'info',
      Inactive: 'warning',
      Dropped: 'error',
      'On Hold': 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Beneficiary Management</h2>
          <p className="text-gray-600 mt-1">Track and manage program beneficiaries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Link href="/beneficiaries/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Add Beneficiary
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Beneficiaries</div>
              <div className="text-2xl font-bold text-gray-900">{mockBeneficiaries.length}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-2xl font-bold text-green-600">{activeBeneficiaries}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-blue-600">{completedBeneficiaries}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Inactive/Dropped</div>
              <div className="text-2xl font-bold text-red-600">{inactiveBeneficiaries}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search, Filters, and Sort */}
      <Card>
        <div className="space-y-4">
          {/* Main Search and Primary Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
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
                <option value="age">Sort by Age</option>
                <option value="recent">Sort by Recent</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Inactive">Inactive</option>
                <option value="Dropped">Dropped</option>
                <option value="On Hold">On Hold</option>
              </select>
              <Button
                variant={showAdvancedFilters ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="w-4 h-4" />
                {showAdvancedFilters ? 'Hide Filters' : 'More Filters'}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
                <select
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Programs</option>
                  {mockPrograms.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Manager</label>
                <select
                  value={filterCaseManager}
                  onChange={(e) => setFilterCaseManager(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Managers</option>
                  {mockCaseManagers.map((manager) => (
                    <option key={manager} value={manager}>
                      {manager}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Locations</option>
                  {mockLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600">
            Showing {filteredBeneficiaries.length} of {mockBeneficiaries.length} beneficiaries
          </div>
        </div>
      </Card>

      {/* Beneficiaries Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beneficiary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBeneficiaries.map((beneficiary) => (
                <tr
                  key={beneficiary.id}
                  onClick={() => (window.location.href = `/beneficiaries/${beneficiary.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {beneficiary.type === 'Individual'
                          ? beneficiary.firstName?.charAt(0).toUpperCase()
                          : beneficiary.organizationDetails?.organizationName.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {beneficiary.type === 'Individual'
                            ? `${beneficiary.firstName} ${beneficiary.lastName}`
                            : beneficiary.organizationDetails?.organizationName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {beneficiary.type === 'Individual' ? (
                            <>
                              {beneficiary.age} years • {beneficiary.gender}
                            </>
                          ) : (
                            <>
                              {beneficiary.organizationDetails?.organizationType} •{' '}
                              {beneficiary.organizationDetails?.numberOfMembers} members
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {beneficiary.phone && (
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <a
                          href={`tel:${beneficiary.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-kanyini-primary"
                        >
                          {beneficiary.phone}
                        </a>
                      </div>
                    )}
                    {beneficiary.email && (
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <a
                          href={`mailto:${beneficiary.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-kanyini-primary"
                        >
                          {beneficiary.email}
                        </a>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {beneficiary.address.district}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {beneficiary.enrolledPrograms.length > 0 ? (
                      <div className="space-y-1">
                        {beneficiary.enrolledPrograms.slice(0, 2).map((enrollment) => (
                          <div key={enrollment.id} className="text-sm text-gray-900">
                            {enrollment.programName}
                          </div>
                        ))}
                        {beneficiary.enrolledPrograms.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{beneficiary.enrolledPrograms.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No programs</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {beneficiary.caseManager}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(beneficiary.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(beneficiary.enrollmentDate).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBeneficiaries.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No beneficiaries found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

