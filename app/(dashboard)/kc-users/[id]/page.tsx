'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { mockKCUsers } from '@/data/kcUserMockData';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Users,
  DollarSign,
  Share2,
  AlertTriangle,
  Shield,
  Ban,
  UserCheck,
  Eye,
  MessageCircle,
  Link as LinkIcon,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import { KCUserStatus } from '@/types';

export default function KCUserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const user = mockKCUsers.find(u => u.id === params.id);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'moderation'>('overview');
  const [showModerationModal, setShowModerationModal] = useState(false);
  const [moderationType, setModerationType] = useState<'warn' | 'suspend' | 'ban' | 'reactivate'>('warn');
  const [moderationReason, setModerationReason] = useState('');
  const [moderationNotes, setModerationNotes] = useState('');
  const [suspensionDays, setSuspensionDays] = useState('30');

  if (!user) {
    return (
      <div className="space-y-6">
        <BackButton href="/kc-users" label="Back to Users" />
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
            <p className="text-gray-600 mb-4">The user you are looking for does not exist.</p>
            <Button onClick={() => router.push('/kc-users')}>
              Back to Users
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusVariant = (status: KCUserStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case 'active': return 'success';
      case 'warned': return 'warning';
      case 'suspended': return 'error';
      case 'banned': return 'error';
      default: return 'default';
    }
  };

  const handleModeration = () => {
    console.log('Moderation action:', {
      userId: user.id,
      type: moderationType,
      reason: moderationReason,
      notes: moderationNotes,
      suspensionDays: moderationType === 'suspend' ? suspensionDays : null,
    });
    alert(`User ${moderationType}ed successfully! (This is a prototype)`);
    setShowModerationModal(false);
    setModerationReason('');
    setModerationNotes('');
  };

  const openModerationModal = (type: 'warn' | 'suspend' | 'ban' | 'reactivate') => {
    setModerationType(type);
    setShowModerationModal(true);
  };

  return (
    <div className="space-y-6">
      <BackButton href="/kc-users" label="Back to Users" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {user.profile.profilePictureUrl ? (
              <Image
                src={user.profile.profilePictureUrl}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-kanyini-primary text-white flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
            )}
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getStatusVariant(user.status)} className="capitalize">
                {user.status}
              </Badge>
              {user.warningCount > 0 && (
                <Badge variant="warning">
                  {user.warningCount} Warning{user.warningCount > 1 ? 's' : ''}
                </Badge>
              )}
              {!user.isVerified && (
                <Badge variant="default">Unverified</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Mail className="w-4 h-4" />
            Send Email
          </Button>
          {user.status === 'active' && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openModerationModal('warn')}
                className="text-yellow-600 hover:text-yellow-700"
              >
                <AlertTriangle className="w-4 h-4" />
                Warn
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openModerationModal('suspend')}
                className="text-orange-600 hover:text-orange-700"
              >
                <Shield className="w-4 h-4" />
                Suspend
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => openModerationModal('ban')}
              >
                <Ban className="w-4 h-4" />
                Ban
              </Button>
            </>
          )}
          {user.status === 'suspended' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => openModerationModal('reactivate')}
            >
              <UserCheck className="w-4 h-4" />
              Reactivate
            </Button>
          )}
          {user.status === 'warned' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => openModerationModal('suspend')}
              className="text-orange-600 hover:text-orange-700"
            >
              <Shield className="w-4 h-4" />
              Suspend
            </Button>
          )}
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
            onClick={() => setActiveTab('activity')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'activity'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Activity & Impact
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`pb-4 px-2 font-medium transition ${
              activeTab === 'moderation'
                ? 'text-kanyini-primary border-b-2 border-kanyini-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Moderation History
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.profile.about && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">About</p>
                  <p className="text-gray-900">{user.profile.about}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.profile.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.profile.phone}</span>
                  </div>
                )}
                {user.profile.preferredTimeToConnect && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{user.profile.preferredTimeToConnect}</span>
                  </div>
                )}
              </div>
              {user.profile.myExpertise && user.profile.myExpertise.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {user.profile.myExpertise.map((expertise, idx) => (
                      <Badge key={idx} variant="info">{expertise}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.skills && user.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, idx) => (
                      <Badge key={idx} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {user.profile.socialMediaLinks && user.profile.socialMediaLinks.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Social Media</p>
                  <div className="space-y-1">
                    {user.profile.socialMediaLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <LinkIcon className="w-3 h-3" />
                        <span>{link}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          {user.experiences && user.experiences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-kanyini-primary pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.designation}</h3>
                        <p className="text-gray-700">{exp.companyName}</p>
                        {exp.industry && (
                          <p className="text-sm text-gray-600">{exp.industry}</p>
                        )}
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{exp.startDate.toLocaleDateString()} - {exp.isPresent ? 'Present' : exp.endDate?.toLocaleDateString()}</p>
                        {exp.location && (
                          <p className="text-xs mt-1">
                            {[exp.location.city, exp.location.state, exp.location.country].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {user.education && user.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Education & Certificates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degreeOrCertificateName}</h3>
                        <p className="text-gray-700">{edu.course}</p>
                        {edu.school && (
                          <p className="text-sm text-gray-600">{edu.school}</p>
                        )}
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-2">{edu.description}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <Badge variant={edu.type === 'education' ? 'info' : 'success'} className="mb-1">
                          {edu.type}
                        </Badge>
                        {edu.startDate && (
                          <p>{edu.startDate.toLocaleDateString()} - {edu.isPresent ? 'Present' : edu.endDate?.toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Activity & Impact Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Engagement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{user.totalPosts}</p>
                  </div>
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Projects Joined</p>
                    <p className="text-2xl font-bold text-gray-900">{user.totalProjects}</p>
                  </div>
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="text-2xl font-bold text-gray-900">{user.totalFollowers}</p>
                  </div>
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Following</p>
                    <p className="text-2xl font-bold text-gray-900">{user.totalFollowing}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Contributions</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{user.totalContributions.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Funds Raised</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{user.fundsRaised.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">People Invited</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {user.peopleInvited}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Posts Shared</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.postsShared}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pledges */}
          {user.pledges && user.pledges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pledges</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {user.pledges.map((pledge, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{pledge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Achievements */}
          {user.achievements && user.achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">{achievement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Moderation History Tab */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          {/* Moderation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Moderation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">{user.warningCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Suspensions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {user.suspensions?.length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Status</p>
                  <Badge variant={getStatusVariant(user.status)} className="capitalize text-base">
                    {user.status}
                  </Badge>
                </div>
              </div>
              {user.moderationNotes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes</p>
                  <p className="text-sm text-gray-600">{user.moderationNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warnings */}
          {user.warnings && user.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Warning History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.warnings.map((warning) => (
                  <div key={warning.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-900">Warning Issued</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {warning.issuedAt.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      Reason: {warning.reason}
                    </p>
                    {warning.notes && (
                      <p className="text-sm text-gray-700">
                        Notes: {warning.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      Issued by: {warning.issuedBy}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Suspensions */}
          {user.suspensions && user.suspensions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Suspension History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.suspensions.map((suspension) => (
                  <div key={suspension.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-900">
                          {suspension.endDate ? 'Suspension' : 'Permanent Ban'}
                        </span>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>{suspension.startDate.toLocaleDateString()}</p>
                        {suspension.endDate && (
                          <p>to {suspension.endDate.toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      Reason: {suspension.reason}
                    </p>
                    {suspension.notes && (
                      <p className="text-sm text-gray-700">
                        Notes: {suspension.notes}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      Issued by: {suspension.issuedBy}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* No Moderation History */}
          {(!user.warnings || user.warnings.length === 0) && (!user.suspensions || user.suspensions.length === 0) && (
            <Card>
              <CardContent className="py-12 text-center">
                <UserCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Clean Record</h3>
                <p className="text-gray-600">
                  This user has no moderation history. They are a valued community member.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Moderation Modal */}
      <Modal
        isOpen={showModerationModal}
        onClose={() => setShowModerationModal(false)}
        title={`${moderationType.charAt(0).toUpperCase() + moderationType.slice(1)} User`}
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            You are about to {moderationType} <strong>{user.name}</strong>. Please provide details below.
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason <span className="text-red-500">*</span>
            </label>
            <Input
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder={`Reason for ${moderationType}ing this user...`}
              required
            />
          </div>

          {moderationType === 'suspend' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suspension Duration (days) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={suspensionDays}
                onChange={(e) => setSuspensionDays(e.target.value)}
                placeholder="30"
                min="1"
                max="365"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <Textarea
              value={moderationNotes}
              onChange={(e) => setModerationNotes(e.target.value)}
              placeholder="Any additional context or notes..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowModerationModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant={moderationType === 'reactivate' ? 'primary' : 'danger'}
              onClick={handleModeration}
              disabled={!moderationReason}
            >
              Confirm {moderationType.charAt(0).toUpperCase() + moderationType.slice(1)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

