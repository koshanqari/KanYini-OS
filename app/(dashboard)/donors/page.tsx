'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BulkEmailComposer } from '@/components/donors/BulkEmailComposer';
import { Search, Plus, Filter, Mail, Phone, Download, TrendingUp, AlertCircle, Send } from 'lucide-react';
import { mockDonors, mockDonations } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Donor, DonorTier, DonorType } from '@/types';

export default function DonorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterEngagement, setFilterEngagement] = useState<string>('all');
  const [filterManager, setFilterManager] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'recent'>('name');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDonors, setSelectedDonors] = useState<string[]>([]);
  const [showBulkEmail, setShowBulkEmail] = useState(false);

  // Get unique values for filters
  const locations = Array.from(new Set(mockDonors.map(d => d.address?.split(',').pop()?.trim()).filter(Boolean)));
  const managers = Array.from(new Set(mockDonors.map(d => d.relationshipManager).filter(Boolean)));
  const allTags = Array.from(new Set(mockDonors.flatMap(d => d.tags || [])));

  // Calculate engagement score helper
  const calculateEngagementScore = (donor: Donor) => {
    const daysSinceLastDonation = donor.lastDonation
      ? Math.floor((new Date().getTime() - new Date(donor.lastDonation).getTime()) / (1000 * 60 * 60 * 24))
      : 365;
    const donorDonations = mockDonations.filter((d) => d.donorId === donor.id);
    return Math.max(0, Math.min(100, 100 - daysSinceLastDonation + donorDonations.length * 5));
  };

  let filteredDonors = mockDonors.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || donor.tier === filterTier;
    const matchesType = filterType === 'all' || donor.type === filterType;
    
    const matchesLocation = filterLocation === 'all' || 
      donor.address?.toLowerCase().includes(filterLocation.toLowerCase());
    
    const matchesManager = filterManager === 'all' || 
      donor.relationshipManager === filterManager;
    
    const matchesTag = filterTag === 'all' || 
      donor.tags?.includes(filterTag);
    
    let matchesEngagement = true;
    if (filterEngagement !== 'all') {
      const score = calculateEngagementScore(donor);
      if (filterEngagement === 'high') matchesEngagement = score >= 70;
      else if (filterEngagement === 'medium') matchesEngagement = score >= 40 && score < 70;
      else if (filterEngagement === 'low') matchesEngagement = score < 40;
    }
    
    return matchesSearch && matchesTier && matchesType && matchesLocation && 
           matchesManager && matchesTag && matchesEngagement;
  });

  // Sort donors
  filteredDonors = [...filteredDonors].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'amount') {
      return b.totalDonated - a.totalDonated;
    } else if (sortBy === 'recent') {
      const aDate = a.lastDonation ? new Date(a.lastDonation).getTime() : 0;
      const bDate = b.lastDonation ? new Date(b.lastDonation).getTime() : 0;
      return bDate - aDate;
    }
    return 0;
  });

  const getTierBadge = (tier: DonorTier) => {
    const variants: Record<DonorTier, 'success' | 'info' | 'warning' | 'default' | 'error'> = {
      major: 'success',
      regular: 'info',
      recurring: 'info',
      'one-time': 'default',
      lapsed: 'error',
    };
    return <Badge variant={variants[tier]}>{tier.toUpperCase()}</Badge>;
  };

  const getTypeColor = (type: DonorType) => {
    const colors: Record<DonorType, string> = {
      individual: 'bg-blue-100 text-blue-800',
      corporate: 'bg-purple-100 text-purple-800',
      foundation: 'bg-green-100 text-green-800',
      government: 'bg-orange-100 text-orange-800',
    };
    return colors[type];
  };

  const getDaysSinceLastDonation = (lastDonation?: Date) => {
    if (!lastDonation) return null;
    const days = Math.floor(
      (new Date().getTime() - new Date(lastDonation).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  // Segmentation stats
  const majorDonors = mockDonors.filter((d) => d.tier === 'major');
  const lapsedDonors = mockDonors.filter((d) => d.tier === 'lapsed');
  const recurringDonors = mockDonors.filter((d) => d.tier === 'recurring');
  const atRiskDonors = mockDonors.filter((d) => {
    const days = getDaysSinceLastDonation(d.lastDonation);
    return days && days > 180 && d.tier !== 'lapsed';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Donor Management</h2>
          <p className="text-gray-600 mt-1">
            {selectedDonors.length > 0
              ? `${selectedDonors.length} donor${selectedDonors.length > 1 ? 's' : ''} selected`
              : 'Manage relationships and track donor engagement'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedDonors.length > 0 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowBulkEmail(true)}
              >
                <Send className="w-4 h-4" />
                Email ({selectedDonors.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDonors([])}
              >
                Clear Selection
              </Button>
            </>
          )}
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="primary" onClick={() => router.push('/donors/new')}>
            <Plus className="w-4 h-4" />
            Add Donor
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="text-sm text-gray-600">Total Donors</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{mockDonors.length}</div>
          <div className="text-xs text-gray-500 mt-1">All active donors</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Major Donors</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{majorDonors.length}</div>
          <div className="text-xs text-gray-500 mt-1">
            {formatCurrency(majorDonors.reduce((sum, d) => sum + d.totalDonated, 0))}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Recurring</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{recurringDonors.length}</div>
          <div className="text-xs text-gray-500 mt-1">Monthly supporters</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">At Risk</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">{atRiskDonors.length}</div>
          <div className="text-xs text-gray-500 mt-1">180+ days inactive</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Lapsed</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{lapsedDonors.length}</div>
          <div className="text-xs text-gray-500 mt-1">Need re-engagement</div>
        </Card>
      </div>

      {/* Alerts for At-Risk Donors */}
      {atRiskDonors.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-yellow-900">
                {atRiskDonors.length} donors at risk of lapsing
              </div>
              <div className="text-sm text-yellow-800 mt-1">
                These donors haven't given in 6+ months. Consider reaching out.
              </div>
            </div>
            <Button variant="secondary" size="sm">
              View List
            </Button>
          </div>
        </Card>
      )}

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
                  placeholder="Search by name or email..."
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
                <option value="amount">Sort by Amount</option>
                <option value="recent">Sort by Recent</option>
              </select>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
              >
                <option value="all">All Tiers</option>
                <option value="major">Major</option>
                <option value="regular">Regular</option>
                <option value="recurring">Recurring</option>
                <option value="one-time">One-time</option>
                <option value="lapsed">Lapsed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="corporate">Corporate</option>
                <option value="foundation">Foundation</option>
                <option value="government">Government</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engagement Level</label>
                <select
                  value={filterEngagement}
                  onChange={(e) => setFilterEngagement(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="high">High (70%+)</option>
                  <option value="medium">Medium (40-69%)</option>
                  <option value="low">Low (&lt;40%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Manager</label>
                <select
                  value={filterManager}
                  onChange={(e) => setFilterManager(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Managers</option>
                  {managers.map((manager) => (
                    <option key={manager} value={manager}>
                      {manager}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tag</label>
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kanyini-primary text-sm"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(filterTier !== 'all' || filterType !== 'all' || filterLocation !== 'all' || 
            filterEngagement !== 'all' || filterManager !== 'all' || filterTag !== 'all') && (
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filterTier !== 'all' && (
                <Badge variant="info">
                  Tier: {filterTier}
                  <button
                    onClick={() => setFilterTier('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterType !== 'all' && (
                <Badge variant="info">
                  Type: {filterType}
                  <button
                    onClick={() => setFilterType('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterLocation !== 'all' && (
                <Badge variant="info">
                  Location: {filterLocation}
                  <button
                    onClick={() => setFilterLocation('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterEngagement !== 'all' && (
                <Badge variant="info">
                  Engagement: {filterEngagement}
                  <button
                    onClick={() => setFilterEngagement('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterManager !== 'all' && (
                <Badge variant="info">
                  Manager: {filterManager}
                  <button
                    onClick={() => setFilterManager('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filterTag !== 'all' && (
                <Badge variant="info">
                  Tag: {filterTag}
                  <button
                    onClick={() => setFilterTag('all')}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <button
                onClick={() => {
                  setFilterTier('all');
                  setFilterType('all');
                  setFilterLocation('all');
                  setFilterEngagement('all');
                  setFilterManager('all');
                  setFilterTag('all');
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}

          <div className="text-sm text-gray-600">
            Showing {filteredDonors.length} of {mockDonors.length} donors
          </div>
        </div>
      </Card>

      {/* Donors Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDonors.length === filteredDonors.length && filteredDonors.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDonors(filteredDonors.map((d) => d.id));
                      } else {
                        setSelectedDonors([]);
                      }
                    }}
                    className="rounded border-gray-300 text-kanyini-primary focus:ring-kanyini-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Donated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDonors.map((donor) => {
                const daysSince = getDaysSinceLastDonation(donor.lastDonation);
                const isAtRisk = daysSince && daysSince > 180 && donor.tier !== 'lapsed';
                const donorDonations = mockDonations.filter((d) => d.donorId === donor.id);

                return (
                  <tr 
                    key={donor.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td 
                      className="px-4 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDonors.includes(donor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDonors([...selectedDonors, donor.id]);
                          } else {
                            setSelectedDonors(selectedDonors.filter((id) => id !== donor.id));
                          }
                        }}
                        className="rounded border-gray-300 text-kanyini-primary focus:ring-kanyini-primary"
                      />
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => window.location.href = `/donors/${donor.id}`}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {donor.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {donor.name}
                          </div>
                          {donor.tags && donor.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {donor.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => window.location.href = `/donors/${donor.id}`}
                    >
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <a
                          href={`mailto:${donor.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-kanyini-primary"
                        >
                          {donor.email}
                        </a>
                      </div>
                      {donor.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a 
                            href={`tel:${donor.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-kanyini-primary"
                          >
                            {donor.phone}
                          </a>
                        </div>
                      )}
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => window.location.href = `/donors/${donor.id}`}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                          donor.type
                        )}`}
                      >
                        {donor.type.charAt(0).toUpperCase() + donor.type.slice(1)}
                      </span>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => window.location.href = `/donors/${donor.id}`}
                    >
                      <div className="flex flex-col gap-1">
                        {getTierBadge(donor.tier)}
                        {isAtRisk && (
                          <span className="text-xs text-yellow-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            At Risk
                          </span>
                        )}
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => window.location.href = `/donors/${donor.id}`}
                    >
                      <div className="text-sm font-bold text-gray-900">
                        {formatCurrency(donor.totalDonated)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {donorDonations.length} donations
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => window.location.href = `/donors/${donor.id}`}
                    >
                      <div className="text-sm text-gray-900">
                        {donor.lastDonation ? formatDate(donor.lastDonation) : 'Never'}
                      </div>
                      {daysSince !== null && (
                        <div
                          className={`text-xs ${
                            daysSince > 180 ? 'text-red-600' : 'text-gray-500'
                          }`}
                        >
                          {daysSince} days ago
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredDonors.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No donors found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Bulk Email Composer */}
      <BulkEmailComposer
        isOpen={showBulkEmail}
        onClose={() => {
          setShowBulkEmail(false);
          setSelectedDonors([]);
        }}
        recipients={mockDonors.filter((d) => selectedDonors.includes(d.id))}
        onSend={(emailData) => {
          console.log('Bulk email sent:', emailData);
          setSelectedDonors([]);
        }}
      />
    </div>
  );
}
