'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { mockKCUsers } from '@/data/kcUserMockData';
import {
  Search,
  Users,
  UserCheck,
  AlertTriangle,
  Ban,
  Eye,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Shield
} from 'lucide-react';
import { KCUserStatus } from '@/types';

export default function KCUsersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<KCUserStatus | 'all'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  // Stats
  const totalUsers = mockKCUsers.length;
  const activeUsers = mockKCUsers.filter(u => u.status === 'active').length;
  const suspendedUsers = mockKCUsers.filter(u => u.status === 'suspended').length;
  const warnedUsers = mockKCUsers.filter(u => u.status === 'warned').length;
  const bannedUsers = mockKCUsers.filter(u => u.status === 'banned').length;

  // Filtered users
  const filteredUsers = mockKCUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesVerified = 
      verifiedFilter === 'all' ||
      (verifiedFilter === 'verified' && user.isVerified) ||
      (verifiedFilter === 'unverified' && !user.isVerified);
    return matchesSearch && matchesStatus && matchesVerified;
  });

  const getStatusVariant = (status: KCUserStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'active': return 'success';
      case 'warned': return 'warning';
      case 'suspended': return 'error';
      case 'banned': return 'error';
      default: return 'default';
    }
  };

  const handleQuickAction = (userId: string, action: string) => {
    alert(`${action} user ${userId}! (This is a prototype)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">KC User Management</h2>
          <p className="text-gray-600 mt-1">Manage Kanyini Connect app users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
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
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warned</p>
                <p className="text-2xl font-bold text-yellow-600">{warnedUsers}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-orange-600">{suspendedUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Banned</p>
                <p className="text-2xl font-bold text-red-600">{bannedUsers}</p>
              </div>
              <Ban className="w-8 h-8 text-red-400" />
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
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as KCUserStatus | 'all')}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'warned', label: 'Warned' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'banned', label: 'Banned' },
              ]}
              className="w-48"
            />
            <Select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value as 'all' | 'verified' | 'unverified')}
              options={[
                { value: 'all', label: 'All Users' },
                { value: 'verified', label: 'Verified' },
                { value: 'unverified', label: 'Unverified' },
              ]}
              className="w-48"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Activity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Impact</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      user.status === 'banned' ? 'bg-red-50' : 
                      user.status === 'suspended' ? 'bg-orange-50' : 
                      user.status === 'warned' ? 'bg-yellow-50' : ''
                    }`}
                  >
                    {/* User Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {user.profile.profilePictureUrl ? (
                            <Image
                              src={user.profile.profilePictureUrl}
                              alt={user.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-kanyini-primary text-white flex items-center justify-center font-bold">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          {user.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <UserCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <Badge variant={getStatusVariant(user.status)} className="capitalize">
                          {user.status}
                        </Badge>
                        {user.warningCount > 0 && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{user.warningCount} warning{user.warningCount > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Activity */}
                    <td className="py-4 px-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1 text-gray-700">
                          <TrendingUp className="w-3 h-3" />
                          <span>{user.totalPosts} posts</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-700">
                          <Award className="w-3 h-3" />
                          <span>{user.totalProjects} projects</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.totalFollowers} followers
                        </div>
                      </div>
                    </td>

                    {/* Impact */}
                    <td className="py-4 px-4">
                      <div className="text-sm space-y-1">
                        <p className="font-medium text-gray-900">
                          ₹{(user.totalContributions / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-gray-600">
                          ₹{(user.fundsRaised / 1000).toFixed(0)}K raised
                        </p>
                        <p className="text-xs text-gray-600">
                          {user.peopleInvited} invited
                        </p>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">
                        {user.createdAt.toLocaleDateString()}
                      </div>
                      {user.lastActiveAt && (
                        <div className="text-xs text-gray-500">
                          Last: {user.lastActiveAt.toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => router.push(`/kc-users/${user.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        {user.status === 'active' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuickAction(user.id, 'Warn')}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Button>
                        )}
                        {user.status !== 'banned' && user.status !== 'suspended' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuickAction(user.id, 'Suspend')}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                        )}
                        {user.status === 'suspended' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleQuickAction(user.id, 'Reactivate')}
                            className="text-green-600 hover:text-green-700"
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

