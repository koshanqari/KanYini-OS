// User & Auth Types
export type UserRole = 'admin' | 'manager' | 'coordinator' | 'field_staff' | 'finance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
}

// Donor Types
export type DonorType = 'individual' | 'corporate' | 'foundation' | 'government';
export type DonorTier = 'major' | 'regular' | 'one-time' | 'recurring' | 'lapsed';

export interface PointOfContact {
  id: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type: DonorType;
  tier: DonorTier;
  totalDonated: number;
  lastDonation?: Date;
  firstDonation?: Date;
  tags?: string[];
  notes?: string;
  relationshipManager?: string;
  preferredContact?: 'email' | 'phone' | 'mail';
  communicationPreferences?: string[];
  // Organization-specific fields
  organizationName?: string;
  pointsOfContact?: PointOfContact[];
  companySize?: string;
  industry?: string;
  website?: string;
}

// Communication Types
export type CommunicationType = 'email' | 'phone' | 'meeting' | 'mail' | 'note';
export type CommunicationStatus = 'completed' | 'scheduled' | 'cancelled';

export interface Communication {
  id: string;
  donorId: string;
  type: CommunicationType;
  subject: string;
  description?: string;
  date: Date;
  status: CommunicationStatus;
  followUpDate?: Date;
  userId: string;
  createdAt: Date;
}

// Activity Types
export type ActivityType = 
  | 'donor_created' 
  | 'donation' 
  | 'recurring_setup'
  | 'recurring_donation'
  | 'communication' 
  | 'note' 
  | 'status_change' 
  | 'tier_upgrade'
  | 'campaign_join'
  | 'profile_update'
  | 'payment_method_added'
  | 'milestone_reached';

export interface Activity {
  id: string;
  donorId: string;
  type: ActivityType;
  title: string;
  description: string;
  date: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

// Donation Types
export type DonationMethod = 'online' | 'check' | 'bank_transfer' | 'in_kind';
export type DonationStatus = 'pending' | 'completed' | 'refunded';

export interface Donation {
  id: string;
  donorId: string;
  amount: number;
  date: Date;
  method: DonationMethod;
  status: DonationStatus;
  campaignId?: string;
  projectId?: string;
  receiptNumber?: string;
}

// Campaign Types
export type CampaignType = 'general' | 'project' | 'emergency';

export interface Campaign {
  id: string;
  name: string;
  goalAmount: number;
  raisedAmount: number;
  startDate: Date;
  endDate: Date;
  type: CampaignType;
  projectId?: string;
  donorCount: number;
}

// Project Types
export type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'On Hold' | 'Cancelled';

// KC-compatible project types
export type ProjectType = 
  | 'Infrastructure'
  | 'Cultural Preservation'
  | 'Environmental Conservation'
  | 'Education & Training'
  | 'Community'
  | 'Fundraiser';

export type ProjectCategory = 
  | 'Education'
  | 'Healthcare'
  | 'Livelihood'
  | 'Environment'
  | 'Water & Sanitation'
  | 'Community Development'
  | 'Emergency Response';

export type MilestoneStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: MilestoneStatus;
  assignedTo: string;
}

export interface ProjectBudgetLine {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  description: string;
}

export interface ProjectImpactMetric {
  id: string;
  indicator: string;
  target: number;
  achieved: number;
  unit: string;
}

export interface Project {
  id: string;
  // Basic Information
  name: string;
  description: string;
  type: ProjectType;
  category: ProjectCategory;
  status: ProjectStatus;
  
  // Timeline
  startDate: Date;
  endDate?: Date;
  duration?: string;
  
  // Location
  location: string[];
  district: string;
  state: string;
  
  // KC-specific: Creator & Community
  startedBy: string; // Project creator/leader name
  followers: number; // Number of followers on KC
  activeMembers: number; // Number of active team members
  
  // Budget
  totalBudget: number;
  totalSpent: number;
  budgetLines: ProjectBudgetLine[];
  fundingSources: {
    source: string;
    amount: number;
    type: 'Grant' | 'Donation' | 'Government' | 'Corporate';
  }[];
  
  // KC-specific: Funding Goals
  moneyRequired: number; // Funding goal for KC display
  moneyRaised: number; // Current funding raised
  
  // Team
  projectManager: string;
  teamMembers: string[];
  
  // KC-specific: Team Goals
  membersRequired: number; // Team size goal for KC display
  membersJoined: number; // Current team size
  
  // Goals & Impact
  objectives: string[];
  expectedImpact: string; // KC-specific: Expected impact statement
  impactMetrics: ProjectImpactMetric[];
  beneficiaryTarget?: number;
  beneficiariesReached?: number;
  
  // Milestones
  milestones: Milestone[];
  
  // Links (all optional)
  linkedDonors?: string[];
  linkedBeneficiaries?: string[];
  linkedCampaigns?: string[];
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: string;
    uploadDate: Date;
    url: string;
  }[];
  
  // Progress
  overallProgress: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Task Types
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
}

// ============================================
// CONTENT MANAGEMENT TYPES (KC App Integration)
// ============================================

// Post Types
export type PostType = 'text' | 'photo' | 'video';
export type PostStatus = 'Draft' | 'Published' | 'Pending Review' | 'Rejected';

export interface Post {
  id: string;
  // Basic Information
  type: PostType;
  content: string; // Max 500 characters
  status: PostStatus;
  
  // Project Linkage
  projectId: string;
  projectName: string;
  
  // Author
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  
  // Media (for photo/video posts)
  mediaUrl?: string;
  mediaThumbnail?: string;
  
  // Engagement
  likes: number;
  comments: number;
  shares: number;
  
  // Moderation
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// EVENT MANAGEMENT TYPES (KC App Integration)
// ============================================

export type EventType = 'workshop' | 'meetup' | 'webinar' | 'conference' | 'social';
export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';

export interface EventAttendee {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  rsvpDate: Date;
  attended?: boolean;
  notes?: string;
}

export interface Event {
  id: string;
  // Basic Information
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  
  // Project Linkage
  projectId: string;
  projectName: string;
  
  // Date & Time
  date: Date;
  startTime: string;
  endTime: string;
  
  // Location
  isVirtual: boolean;
  location: string;
  virtualLink?: string;
  
  // Organizer
  organizer: string;
  organizerEmail?: string;
  organizerPhone?: string;
  
  // Capacity & Attendance
  maxAttendees?: number;
  attendees: EventAttendee[];
  currentAttendees: number; // Calculated field
  
  // Additional Info
  agenda?: string[];
  materials?: string[];
  prerequisites?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Field Report Types
export type ReportType = 'daily_activity' | 'site_visit' | 'beneficiary_survey' | 'environmental_assessment' | 'incident';
export type ReportStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'revision_requested';

export interface FieldReport {
  id: string;
  type: ReportType;
  projectId: string;
  reporterId: string;
  title: string;
  status: ReportStatus;
  date: Date;
  location?: string;
  photos?: string[];
  data: Record<string, any>;
  reviewComments?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
}

// Document Types
export type DocumentCategory = 'legal' | 'financial' | 'compliance' | 'grants' | 'reports';
export type DocumentStatus = 'valid' | 'expiring' | 'expired';

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadDate: Date;
  expiryDate?: Date;
  fileUrl: string;
}

// ============================================
// BENEFICIARY MANAGEMENT TYPES
// ============================================

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type BeneficiaryType = 'Individual' | 'Organization' | 'Community Group';

export type BeneficiaryStatus = 'Active' | 'Inactive' | 'Completed' | 'Dropped' | 'On Hold';

export type ProgramCategory = 
  | 'Education' 
  | 'Healthcare' 
  | 'Livelihood' 
  | 'Environment' 
  | 'Water & Sanitation' 
  | 'Community Development';

export type ServiceType = 
  | 'Training' 
  | 'Counseling' 
  | 'Material Distribution' 
  | 'Medical Checkup' 
  | 'Workshop' 
  | 'Assessment' 
  | 'Home Visit' 
  | 'Other';

export type OutcomeStatus = 'Not Started' | 'In Progress' | 'Achieved' | 'Partially Achieved' | 'Not Achieved';

export interface Address {
  street?: string;
  village?: string;
  district: string;
  state: string;
  pincode?: string;
  country: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: Gender;
  occupation?: string;
}

export interface ProgramEnrollment {
  id: string;
  programId: string;
  programName: string;
  enrollmentDate: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  status: BeneficiaryStatus;
  outcomes: string[];
  notes?: string;
}

export interface ServiceRecord {
  id: string;
  beneficiaryId: string;
  serviceType: ServiceType;
  date: Date;
  description: string;
  deliveredBy: string;
  location: string;
  duration?: number; // in minutes
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  attachments?: string[];
}

export interface CaseNote {
  id: string;
  beneficiaryId: string;
  date: Date;
  createdBy: string;
  category: 'General' | 'Progress' | 'Concern' | 'Achievement' | 'Follow-up';
  title: string;
  note: string;
  isPrivate: boolean;
}

export interface Assessment {
  id: string;
  beneficiaryId: string;
  date: Date;
  assessmentType: string;
  conductedBy: string;
  scores: { [key: string]: number };
  summary: string;
  recommendations: string[];
}

export interface OutcomeMeasurement {
  id: string;
  indicator: string;
  baseline: number;
  target: number;
  current: number;
  unit: string;
  measurementDate: Date;
  status: OutcomeStatus;
  verificationMethod: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  beneficiaryId: string;
  programId: string;
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  notes?: string;
}

export interface OrganizationBeneficiary {
  organizationType: 'School' | 'Hospital' | 'Community Center' | 'Cooperative' | 'Other';
  organizationName: string;
  registrationNumber?: string;
  establishedYear?: number;
  headOfOrganization: string;
  numberOfMembers?: number;
}

export interface Beneficiary {
  id: string;
  // Type
  type: BeneficiaryType;
  
  // Basic Information (for individuals)
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  age?: number;
  gender?: Gender;
  photo?: string;
  
  // Organization Information (for organizations)
  organizationDetails?: OrganizationBeneficiary;
  
  // Contact Information
  phone?: string;
  email?: string;
  address: Address;
  
  // Family Information
  guardianName?: string;
  guardianPhone?: string;
  familyMembers: FamilyMember[];
  householdSize: number;
  
  // Demographics
  education?: string;
  occupation?: string;
  monthlyIncome?: string;
  language: string[];
  
  // Program Information
  enrolledPrograms: ProgramEnrollment[];
  status: BeneficiaryStatus;
  enrollmentDate: Date;
  
  // Case Management
  caseManager: string;
  caseNotes: CaseNote[];
  
  // Services & Attendance
  servicesReceived: ServiceRecord[];
  attendanceRecords: AttendanceRecord[];
  
  // Assessments & Outcomes
  assessments: Assessment[];
  outcomes: OutcomeMeasurement[];
  
  // Additional
  tags: string[];
  specialNeeds?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  category: ProgramCategory;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  startDate: Date;
  endDate?: Date;
  
  // Target & Enrollment
  targetBeneficiaries: number;
  enrolledBeneficiaries: number;
  completedBeneficiaries: number;
  
  // Location
  locations: string[];
  
  // Staff
  programManager: string;
  staff: string[];
  
  // Budget
  budget?: number;
  spent?: number;
  
  // Impact
  objectives: string[];
  outcomes: OutcomeMeasurement[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
