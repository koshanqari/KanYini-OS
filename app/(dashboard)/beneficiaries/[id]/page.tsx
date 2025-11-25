'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BackButton } from '@/components/ui/BackButton';
import { mockBeneficiaries } from '@/data/beneficiaryMockData';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  FileText,
  Users,
  Activity,
  Award,
  AlertCircle,
  Heart,
  Briefcase,
  Home,
  GraduationCap,
  DollarSign,
  Languages,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
} from 'lucide-react';

export default function BeneficiaryProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const beneficiary = mockBeneficiaries.find((b) => b.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'outcomes' | 'notes'>(
    'overview'
  );

  if (!beneficiary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Beneficiary Not Found</h2>
          <p className="text-gray-600">The beneficiary you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <BackButton />
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {beneficiary.type === 'Individual'
                ? beneficiary.firstName?.charAt(0).toUpperCase()
                : beneficiary.organizationDetails?.organizationName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {beneficiary.type === 'Individual'
                  ? `${beneficiary.firstName} ${beneficiary.lastName}`
                  : beneficiary.organizationDetails?.organizationName}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge
                  variant={
                    beneficiary.status === 'Active'
                      ? 'success'
                      : beneficiary.status === 'Completed'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {beneficiary.status}
                </Badge>
                <Badge variant="default">{beneficiary.type}</Badge>
                {beneficiary.type === 'Individual' ? (
                  <span className="text-gray-600">
                    {beneficiary.age} years • {beneficiary.gender}
                  </span>
                ) : (
                  <span className="text-gray-600">
                    {beneficiary.organizationDetails?.organizationType} •{' '}
                    {beneficiary.organizationDetails?.numberOfMembers} members
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
          <Button variant="secondary" size="sm">
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {(['overview', 'services', 'outcomes', 'notes'] as const).map((tab) => (
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
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {beneficiary.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <a href={`tel:${beneficiary.phone}`} className="text-sm font-medium text-kanyini-primary hover:underline">
                          {beneficiary.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {beneficiary.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <a href={`mailto:${beneficiary.email}`} className="text-sm font-medium text-kanyini-primary hover:underline">
                          {beneficiary.email}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="text-sm font-medium text-gray-900">
                        {beneficiary.address.village && `${beneficiary.address.village}, `}
                        {beneficiary.address.district}, {beneficiary.address.state}
                      </div>
                    </div>
                  </div>
                  {beneficiary.type === 'Individual' && beneficiary.dateOfBirth && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Date of Birth</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(beneficiary.dateOfBirth).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Organization Details (if type is Organization) */}
            {beneficiary.type !== 'Individual' && beneficiary.organizationDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Organization Type</div>
                        <div className="text-sm font-medium text-gray-900">
                          {beneficiary.organizationDetails.organizationType}
                        </div>
                      </div>
                    </div>
                    {beneficiary.organizationDetails.registrationNumber && (
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Registration Number</div>
                          <div className="text-sm font-medium text-gray-900">
                            {beneficiary.organizationDetails.registrationNumber}
                          </div>
                        </div>
                      </div>
                    )}
                    {beneficiary.organizationDetails.establishedYear && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Established Year</div>
                          <div className="text-sm font-medium text-gray-900">
                            {beneficiary.organizationDetails.establishedYear}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Head of Organization</div>
                        <div className="text-sm font-medium text-gray-900">
                          {beneficiary.organizationDetails.headOfOrganization}
                        </div>
                      </div>
                    </div>
                    {beneficiary.organizationDetails.numberOfMembers && (
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Number of Members</div>
                          <div className="text-sm font-medium text-gray-900">
                            {beneficiary.organizationDetails.numberOfMembers}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Demographics (only for individuals) */}
            {beneficiary.type === 'Individual' && (
              <Card>
                <CardHeader>
                  <CardTitle>Demographics & Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {beneficiary.education && (
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Education</div>
                        <div className="text-sm font-medium text-gray-900">{beneficiary.education}</div>
                      </div>
                    </div>
                  )}
                  {beneficiary.occupation && (
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Occupation</div>
                        <div className="text-sm font-medium text-gray-900">{beneficiary.occupation}</div>
                      </div>
                    </div>
                  )}
                  {beneficiary.monthlyIncome && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Monthly Income</div>
                        <div className="text-sm font-medium text-gray-900">{beneficiary.monthlyIncome}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Household Size</div>
                      <div className="text-sm font-medium text-gray-900">{beneficiary.householdSize} members</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Languages className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Languages</div>
                      <div className="text-sm font-medium text-gray-900">{beneficiary.language.join(', ')}</div>
                    </div>
                  </div>
                </div>
                {beneficiary.specialNeeds && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <div className="text-xs font-medium text-yellow-900">Special Needs</div>
                        <div className="text-sm text-yellow-800">{beneficiary.specialNeeds}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            )}

            {/* Family Members (only for individuals) */}
            {beneficiary.type === 'Individual' && beneficiary.familyMembers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Family Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {beneficiary.familyMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">
                              {member.relationship} • {member.age} years • {member.gender}
                            </div>
                          </div>
                        </div>
                        {member.occupation && (
                          <div className="text-sm text-gray-600">{member.occupation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enrolled Programs */}
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Programs</CardTitle>
              </CardHeader>
              <CardContent>
                {beneficiary.enrolledPrograms.length > 0 ? (
                  <div className="space-y-4">
                    {beneficiary.enrolledPrograms.map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{enrollment.programName}</h4>
                            <div className="text-sm text-gray-600 mt-1">
                              Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                              {enrollment.expectedCompletionDate && (
                                <> • Expected completion: {new Date(enrollment.expectedCompletionDate).toLocaleDateString()}</>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={
                              enrollment.status === 'Active'
                                ? 'success'
                                : enrollment.status === 'Completed'
                                ? 'info'
                                : 'warning'
                            }
                          >
                            {enrollment.status}
                          </Badge>
                        </div>
                        {enrollment.outcomes && enrollment.outcomes.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {enrollment.outcomes.map((outcome, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                {outcome}
                              </span>
                            ))}
                          </div>
                        )}
                        {enrollment.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">{enrollment.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Not enrolled in any programs yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Case Management */}
            <Card>
              <CardHeader>
                <CardTitle>Case Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Case Manager</div>
                      <div className="text-sm font-medium text-gray-900">{beneficiary.caseManager}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Enrollment Date</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(beneficiary.enrollmentDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Last Updated</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(beneficiary.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            {beneficiary.emergencyContact && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="text-sm font-medium text-gray-900">{beneficiary.emergencyContact.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Relationship</div>
                      <div className="text-sm font-medium text-gray-900">{beneficiary.emergencyContact.relationship}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <a
                        href={`tel:${beneficiary.emergencyContact.phone}`}
                        className="text-sm font-medium text-kanyini-primary hover:underline"
                      >
                        {beneficiary.emergencyContact.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {beneficiary.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {beneficiary.tags.map((tag) => (
                      <Badge key={tag} variant="info">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Services Received</span>
                    <span className="text-sm font-bold text-gray-900">{beneficiary.servicesReceived.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Case Notes</span>
                    <span className="text-sm font-bold text-gray-900">{beneficiary.caseNotes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assessments</span>
                    <span className="text-sm font-bold text-gray-900">{beneficiary.assessments.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Outcomes Tracked</span>
                    <span className="text-sm font-bold text-gray-900">{beneficiary.outcomes.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Service History</CardTitle>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Log Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {beneficiary.servicesReceived.length > 0 ? (
              <div className="space-y-4">
                {beneficiary.servicesReceived
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((service) => (
                    <div key={service.id} className="border-l-4 border-green-400 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{service.description}</span>
                            <Badge variant="info">{service.serviceType}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(service.date).toLocaleDateString()} • {service.deliveredBy} • {service.location}
                            {service.duration && <> • {service.duration} minutes</>}
                          </div>
                          {service.notes && (
                            <p className="text-sm text-gray-700 mt-2">{service.notes}</p>
                          )}
                          {service.followUpRequired && service.followUpDate && (
                            <div className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Follow-up: {new Date(service.followUpDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">No services recorded yet</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Outcomes Tab */}
      {activeTab === 'outcomes' && (
        <div className="space-y-6">
          {/* Outcome Measurements */}
          <Card>
            <CardHeader>
              <CardTitle>Outcome Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              {beneficiary.outcomes.length > 0 ? (
                <div className="space-y-4">
                  {beneficiary.outcomes.map((outcome) => (
                    <div key={outcome.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{outcome.indicator}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            Measured: {new Date(outcome.measurementDate).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge
                          variant={
                            outcome.status === 'Achieved'
                              ? 'success'
                              : outcome.status === 'In Progress'
                              ? 'info'
                              : 'warning'
                          }
                        >
                          {outcome.status}
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {outcome.current} / {outcome.target} {outcome.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((outcome.current / outcome.target) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Baseline: {outcome.baseline} {outcome.unit}</span>
                          <span>{Math.round((outcome.current / outcome.target) * 100)}% achieved</span>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-gray-600">
                        Verification: {outcome.verificationMethod}
                      </div>
                      {outcome.notes && (
                        <p className="text-sm text-gray-700 mt-2 italic">{outcome.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No outcome measurements yet</p>
              )}
            </CardContent>
          </Card>

          {/* Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              {beneficiary.assessments.length > 0 ? (
                <div className="space-y-4">
                  {beneficiary.assessments.map((assessment) => (
                    <div key={assessment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{assessment.assessmentType}</h4>
                          <div className="text-sm text-gray-600 mt-1">
                            {new Date(assessment.date).toLocaleDateString()} • By {assessment.conductedBy}
                          </div>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {Object.entries(assessment.scores).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-700">{key}</span>
                            <span className="text-sm font-bold text-gray-900">{value}%</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="text-xs font-medium text-gray-700 mb-1">Summary</div>
                          <p className="text-sm text-gray-600">{assessment.summary}</p>
                        </div>
                        {assessment.recommendations.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-gray-700 mb-1">Recommendations</div>
                            <ul className="list-disc list-inside space-y-1">
                              {assessment.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-600">{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No assessments conducted yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Case Notes</CardTitle>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4" />
                Add Note
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {beneficiary.caseNotes.length > 0 ? (
              <div className="space-y-4">
                {beneficiary.caseNotes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((note) => (
                    <div key={note.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{note.title}</h4>
                            <Badge
                              variant={
                                note.category === 'Achievement'
                                  ? 'success'
                                  : note.category === 'Concern'
                                  ? 'error'
                                  : 'info'
                              }
                            >
                              {note.category}
                            </Badge>
                            {note.isPrivate && (
                              <Badge variant="warning">Private</Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {new Date(note.date).toLocaleDateString()} • By {note.createdBy}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{note.note}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">No case notes yet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

