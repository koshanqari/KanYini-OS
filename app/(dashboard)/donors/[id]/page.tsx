'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { BackButton } from '@/components/ui/BackButton';
import { EmailComposer } from '@/components/donors/EmailComposer';
import {
  Mail,
  Phone,
  Edit,
  DollarSign,
  Calendar,
  Tag,
  MapPin,
  User,
  MessageSquare,
  Activity as ActivityIcon,
  Plus,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  CreditCard,
} from 'lucide-react';
import { mockDonors, mockDonations, mockCommunications, mockActivities } from '@/data/mockData';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function DonorProfilePage({ params }: { params: { id: string } }) {
  const donor = mockDonors.find((d) => d.id === params.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'communications'>(
    'overview'
  );
  const [showAddCommunication, setShowAddCommunication] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  if (!donor) {
    notFound();
  }

  // Get donor's data
  const donorDonations = mockDonations.filter((d) => d.donorId === donor.id);
  const donorCommunications = mockCommunications.filter((c) => c.donorId === donor.id);
  const donorActivities = mockActivities.filter((a) => a.donorId === donor.id);

  const totalDonations = donorDonations.length;
  const averageDonation =
    totalDonations > 0 ? donorDonations.reduce((sum, d) => sum + d.amount, 0) / totalDonations : 0;

  // Calculate engagement score (0-100)
  const daysSinceLastDonation = donor.lastDonation
    ? Math.floor((new Date().getTime() - new Date(donor.lastDonation).getTime()) / (1000 * 60 * 60 * 24))
    : 365;
  const engagementScore = Math.max(
    0,
    Math.min(100, 100 - daysSinceLastDonation + totalDonations * 5)
  );

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      case 'mail':
        return <Mail className="w-4 h-4" />;
      case 'note':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'donor_created':
        return <User className="w-4 h-4 text-purple-600" />;
      case 'donation':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'recurring_setup':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'recurring_donation':
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'communication':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'note':
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      case 'status_change':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'tier_upgrade':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'campaign_join':
        return <Heart className="w-4 h-4 text-red-600" />;
      case 'milestone_reached':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'profile_update':
        return <Edit className="w-4 h-4 text-gray-600" />;
      case 'payment_method_added':
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBadge = (type: string, metadata?: Record<string, any>) => {
    if (type === 'recurring_donation') {
      return <Badge variant="info">Auto</Badge>;
    }
    if (type === 'donation' && metadata?.isFirst) {
      return <Badge variant="success">First</Badge>;
    }
    if (type === 'donation' && metadata?.isGrant) {
      return <Badge variant="info">Grant</Badge>;
    }
    if (type === 'donation' && metadata?.isSpecial) {
      return <Badge variant="warning">Special</Badge>;
    }
    if (type === 'tier_upgrade') {
      return <Badge variant="success">Upgrade</Badge>;
    }
    if (type === 'milestone_reached') {
      return <Badge variant="warning">Milestone</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <BackButton href="/donors" />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {donor.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{donor.name}</h2>
            <p className="text-gray-600 mt-1">
              {donor.type.charAt(0).toUpperCase() + donor.type.slice(1)} Donor · Member since{' '}
              {donor.firstDonation
                ? new Date(donor.firstDonation).toLocaleDateString('en-IN', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'N/A'}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={donor.tier === 'major' ? 'success' : donor.tier === 'lapsed' ? 'error' : 'info'}>
                {donor.tier.toUpperCase()}
              </Badge>
              {donor.relationshipManager && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {donor.relationshipManager}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowEmailComposer(true)}>
            <Mail className="w-4 h-4" />
            Send Email
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowAddCommunication(true)}>
            <MessageSquare className="w-4 h-4" />
            Log Communication
          </Button>
          <Button variant="primary" size="sm">
            <DollarSign className="w-4 h-4" />
            Record Donation
          </Button>
          <Link href={`/donors/${donor.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <div className="text-sm text-gray-600">Total Donated</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {formatCurrency(donor.totalDonated)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Total Donations</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{totalDonations}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Average Gift</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {formatCurrency(averageDonation)}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Last Donation</div>
          <div className="text-sm font-bold text-gray-900 mt-1">
            {donor.lastDonation ? formatDate(donor.lastDonation) : 'Never'}
          </div>
          {donor.lastDonation && (
            <div className="text-xs text-gray-500 mt-1">{daysSinceLastDonation} days ago</div>
          )}
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Engagement Score</div>
          <div className={`text-2xl font-bold mt-1 ${getEngagementColor(engagementScore)}`}>
            {engagementScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${
                engagementScore >= 80
                  ? 'bg-green-600'
                  : engagementScore >= 50
                  ? 'bg-blue-600'
                  : 'bg-yellow-600'
              }`}
              style={{ width: `${engagementScore}%` }}
            ></div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {['overview', 'activity', 'communications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition ${
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Organization Info */}
                {donor.organizationName && (
                  <div className="pb-3 border-b">
                    <div className="text-sm text-gray-600 mb-1">Organization</div>
                    <div className="text-base font-semibold text-gray-900">
                      {donor.organizationName}
                    </div>
                    {donor.industry && (
                      <div className="text-xs text-gray-500 mt-1">{donor.industry}</div>
                    )}
                    {donor.website && (
                      <a
                        href={donor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-kanyini-primary hover:underline mt-1 inline-block"
                      >
                        {donor.website}
                      </a>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-600">Email</div>
                    <a
                      href={`mailto:${donor.email}`}
                      className="text-sm font-medium text-kanyini-primary hover:underline"
                    >
                      {donor.email}
                    </a>
                  </div>
                </div>
                {donor.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Phone</div>
                      <a
                        href={`tel:${donor.phone}`}
                        className="text-sm font-medium text-kanyini-primary hover:underline"
                      >
                        {donor.phone}
                      </a>
                    </div>
                  </div>
                )}
                {donor.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Address</div>
                      <div className="text-sm font-medium text-gray-900">{donor.address}</div>
                    </div>
                  </div>
                )}
                {donor.preferredContact && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Preferred Contact</div>
                      <Badge variant="default">
                        {donor.preferredContact.charAt(0).toUpperCase() +
                          donor.preferredContact.slice(1)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Points of Contact (for Organizations) */}
          {donor.pointsOfContact && donor.pointsOfContact.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Points of Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donor.pointsOfContact.map((poc) => (
                    <div
                      key={poc.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {poc.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{poc.name}</div>
                            <div className="text-xs text-gray-500">{poc.designation}</div>
                          </div>
                        </div>
                        {poc.isPrimary && (
                          <Badge variant="warning">Primary</Badge>
                        )}
                      </div>
                      <div className="ml-10 space-y-1">
                        <a
                          href={`mailto:${poc.email}`}
                          className="text-xs text-kanyini-primary hover:underline flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          {poc.email}
                        </a>
                        <a
                          href={`tel:${poc.phone}`}
                          className="text-xs text-kanyini-primary hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {poc.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preferences & Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences & Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donor.tags && donor.tags.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {donor.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {donor.communicationPreferences && donor.communicationPreferences.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Communication Preferences</div>
                    <div className="space-y-2">
                      {donor.communicationPreferences.map((pref) => (
                        <div key={pref} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-900">{pref}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {donor.notes && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-1">Notes</div>
                    <div className="text-sm text-gray-900">{donor.notes}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => setShowAddNote(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add Note
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Donation History Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Giving History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">First Donation</span>
                  <span className="text-sm font-medium text-gray-900">
                    {donor.firstDonation ? formatDate(donor.firstDonation) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Latest Donation</span>
                  <span className="text-sm font-medium text-gray-900">
                    {donor.lastDonation ? formatDate(donor.lastDonation) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-600">Total Lifetime Value</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(donor.totalDonated)}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="text-sm text-gray-600 mb-2">Donation Frequency</div>
                  <div className="text-2xl font-bold text-gray-900">{totalDonations}</div>
                  <div className="text-xs text-gray-500">donations over lifetime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Complete Activity Timeline</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  All interactions, donations, and milestones
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {donorActivities.length} activities
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donorActivities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0 relative">
                  {/* Timeline line */}
                  {index !== donorActivities.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  
                  {/* Icon */}
                  <div className="mt-1 z-10 bg-white">{getActivityIcon(activity.type)}</div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-medium text-gray-900">{activity.title}</div>
                          {getActivityBadge(activity.type, activity.metadata)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                        
                        {/* Metadata display */}
                        {activity.metadata && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {activity.metadata.amount && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                Amount: {formatCurrency(activity.metadata.amount)}
                              </span>
                            )}
                            {activity.metadata.method && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {activity.metadata.method.replace('_', ' ')}
                              </span>
                            )}
                            {activity.metadata.isRecurring && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                Recurring Payment
                              </span>
                            )}
                            {activity.metadata.frequency && (
                              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                                {activity.metadata.frequency}
                              </span>
                            )}
                            {activity.metadata.campaignId && (
                              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                Campaign donation
                              </span>
                            )}
                            {activity.metadata.milestone && (
                              <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                {formatCurrency(activity.metadata.milestone)} milestone
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Date */}
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(activity.date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {donorActivities.length === 0 && (
                <div className="text-center py-12">
                  <ActivityIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activity recorded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'communications' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Communication Log</CardTitle>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowAddCommunication(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donorCommunications.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                      {getCommunicationIcon(comm.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{comm.subject}</div>
                          {comm.description && (
                            <div className="text-sm text-gray-600 mt-1">{comm.description}</div>
                          )}
                        </div>
                        <Badge
                          variant={
                            comm.status === 'completed'
                              ? 'success'
                              : comm.status === 'scheduled'
                              ? 'warning'
                              : 'default'
                          }
                        >
                          {comm.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(comm.date)}
                        </span>
                        {comm.followUpDate && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Clock className="w-3 h-3" />
                            Follow-up: {formatDate(comm.followUpDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {donorCommunications.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No communications logged</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {donorCommunications
                  .filter((c) => c.status === 'scheduled' || c.followUpDate)
                  .map((comm) => (
                    <div
                      key={comm.id}
                      className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{comm.subject}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {comm.status === 'scheduled'
                            ? `Scheduled for ${formatDate(comm.date)}`
                            : `Follow-up on ${formatDate(comm.followUpDate!)}`}
                        </div>
                      </div>
                    </div>
                  ))}
                {donorCommunications.filter((c) => c.status === 'scheduled' || c.followUpDate)
                  .length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming actions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Communication Modal */}
      <Modal
        isOpen={showAddCommunication}
        onClose={() => setShowAddCommunication(false)}
        title="Log Communication"
      >
        <form className="space-y-4">
          <Select
            label="Communication Type"
            options={[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone Call' },
              { value: 'meeting', label: 'Meeting' },
              { value: 'mail', label: 'Mail' },
              { value: 'note', label: 'Note' },
            ]}
            required
          />
          <Input label="Subject" placeholder="Brief description" required />
          <Textarea label="Details" placeholder="Communication details..." rows={4} />
          <Input label="Date" type="date" required />
          <Input label="Follow-up Date (Optional)" type="date" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowAddCommunication(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Communication
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Note Modal */}
      <Modal isOpen={showAddNote} onClose={() => setShowAddNote(false)} title="Add Note">
        <form className="space-y-4">
          <Textarea label="Note" placeholder="Add a note about this donor..." rows={4} required />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowAddNote(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Note
            </Button>
          </div>
        </form>
      </Modal>

      {/* Email Composer */}
      <EmailComposer
        isOpen={showEmailComposer}
        onClose={() => setShowEmailComposer(false)}
        recipient={{
          name: donor.name,
          email: donor.email,
        }}
        onSend={(emailData) => {
          console.log('Email sent:', emailData);
          // In real app, this would:
          // 1. Send the actual email via API
          // 2. Log to communications database
          // 3. Create activity timeline entry
          alert('Email sent successfully! (Demo mode)');
        }}
      />
    </div>
  );
}
