# Product Requirements Document (PRD)
## Kanyini Earth Project - Internal Operations Platform
### Frontend Prototype Only (2-3 Weeks)

---

## Project Overview

**Project Type:** Frontend Prototype (No Backend)  
**Timeline:** 2-3 Weeks  
**Purpose:** Internal operations management system for NGO staff

**Existing:**
- Public website ✓
- CMS ✓

**To Build:**
1. Donor Management System (DMS)
2. Project Management System (PMS)
3. Field Reporting System (FRS)
4. Compliance/Audit Hub

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **Tables:** TanStack Table
- **Forms:** React Hook Form + Zod
- **Data:** Mock data (JSON/TypeScript)

**Design (Reference kc_old for similar look):**
- **Primary Color:** #597242 (Kanyini green)
- **Secondary Color:** #3f3f44 (dark gray)
- **Style:** Clean, professional with white cards on gray-50 background
- **Layout:** Mobile-first responsive (sidebar for desktop, bottom nav for mobile)
- **Icons:** Lucide React
- **Status Colors:** Green (success), Red (error), Blue (info), Yellow (warning)
- **Components:** Similar to kc_old - white cards with shadows, rounded corners, hover states

---

## System Architecture

```
┌─────────────────────────────────────┐
│    Compliance/Audit Hub (Center)    │
│      Dashboards & Analytics         │
└──────────────┬──────────────────────┘
               │
     ┌─────────┼─────────┐
     │         │         │
  ┌──▼──┐  ┌──▼──┐  ┌───▼──┐
  │ DMS │  │ PMS │  │ FRS  │
  └─────┘  └─────┘  └──────┘
```

**User Roles:**
- Admin, Manager, Project Coordinator, Field Staff, Finance

---

## 1. Donor Management System (DMS)

### Features to Build:

#### 1.1 Donor Database
- Donor list table (sortable, filterable, searchable)
- Donor profile page with:
  - Personal/org details
  - Donor tier (Major, Regular, One-time, Recurring, Lapsed)
  - Total donated, last donation, lifetime value
  - Tags and notes
- Add/edit donor form
- Donor segmentation views

#### 1.2 Donation Management
- Donation list with filters
- Add donation modal (amount, date, method, campaign, receipt #)
- Recurring donations tracker
- Pledge tracking (pledged vs received)
- In-kind donations log

#### 1.3 Fundraising Campaigns
- Campaign list (cards view)
- Campaign detail page with:
  - Progress meter (raised vs goal)
  - Donor count, average donation
  - Timeline
- Create campaign form
- Campaign comparison chart

#### 1.4 Donor Analytics
- Donation trends chart (monthly/yearly)
- Donor retention visualization
- Top donors list
- Campaign performance reports
- Export to CSV/PDF

---

## 2. Project Management System (PMS)

### Features to Build:

#### 2.1 Project Dashboard
- Project cards grid with:
  - Progress %, budget utilization
  - Team members, next milestone
- Filters (status, category, location)
- Quick stats

#### 2.2 Project Details
- Project overview page:
  - Basic info (name, dates, location with map)
  - Goals and objectives
  - Team members
  - Funding source
- Status tracking

#### 2.3 Task Management
- Task list view
- Kanban board view
- Add/edit task (title, assignee, due date, priority, status)
- Task filters and sorting
- Task detail drawer

#### 2.4 Budget Tracking
- Budget allocation display
- Expense list (description, amount, category, date)
- Add expense form
- Budget vs actual chart
- Budget alerts

#### 2.5 Impact Tracking
- Metrics input (trees planted, carbon offset, people impacted, area covered)
- Before/after photo gallery
- Impact visualizations
- Success stories section

#### 2.6 Collaboration
- Activity timeline
- File repository (simulated)
- Comments section

---

## 3. Field Reporting System (FRS)

### Features to Build:

#### 3.1 Mobile-First Interface
- Responsive design for mobile/tablet
- Touch-friendly controls
- Offline indicator (simulated)

#### 3.2 Report Templates
- Template selection page
- 5 report types:
  1. Daily Activity Report
  2. Site Visit Report
  3. Beneficiary Survey
  4. Environmental Assessment
  5. Incident Report

#### 3.3 Report Creation
- Dynamic form with:
  - Text fields, numbers, dates
  - Photo upload (multiple)
  - GPS location (simulated)
  - Dropdowns, checkboxes
  - Signature pad
- Save as draft
- Submit report

#### 3.4 Report Management
- Report list (field staff view)
- Status tracker (Draft, Submitted, Under Review, Approved, Revision Requested)
- Report detail view
- Edit/resubmit capability

#### 3.5 Manager Review
- Review queue
- Approve/reject workflow
- Add comments
- Approval history

#### 3.6 Reports Dashboard
- All reports table with filters
- Search functionality
- Analytics (reports over time, by project)
- Export capability

---

## 4. Compliance/Audit Hub

### Features to Build:

#### 4.1 Executive Dashboard
- KPI cards:
  - Total donations (month/year)
  - Active projects
  - Active donors
  - Field reports submitted
- Revenue vs expenses chart
- Impact highlights
- Recent activity feed

#### 4.2 Financial Dashboard
- Revenue breakdown (by campaign, donor type, monthly trend)
- Expense breakdown (by project, category)
- Cash flow chart
- Grant utilization tracker

#### 4.3 Donor Analytics Dashboard
- Donor acquisition trends
- Retention rate visualization
- Donor lifetime value distribution
- Campaign ROI comparison
- Giving patterns

#### 4.4 Project Dashboard
- Project portfolio overview
- Projects by status (pie chart)
- Budget burn rate
- Milestone completion
- Impact aggregation

#### 4.5 Impact Dashboard
- Cumulative metrics (total trees, carbon, people, area)
- Impact by project type
- Geographic impact map
- Before/after galleries
- Time-series trends

#### 4.6 Document Management
- Document list with categories (Legal, Financial, Compliance, Grants)
- Upload interface (simulated)
- Document status (Valid, Expiring, Expired)
- Search and filter
- Document detail modal

#### 4.7 Grant Compliance
- Grant list with details
- Compliance checklist
- Reporting deadline calendar
- Fund utilization tracker

#### 4.8 Audit Trail
- Activity logs
- User action history
- Filter by user, module, date
- Export logs

#### 4.9 Reports Section
- Report templates (Monthly, Quarterly, Annual, Grant, Board)
- Report preview
- Export (PDF, Excel)

---

## Development Phases (2-3 Weeks)

### Week 1: Foundation + Compliance Hub
**Days 1-2: Setup**
- Initialize Next.js project
- Install dependencies (Tailwind, shadcn/ui, etc.)
- Setup folder structure
- Create layout with sidebar navigation
- Build core components (Button, Input, Card, Table, etc.)
- Login page (UI only)
- Define mock data structure

**Days 3-5: Compliance/Audit Hub**
- Executive Dashboard with KPI cards
- Financial Dashboard with charts
- Impact Dashboard
- Project Dashboard
- Donor Analytics Dashboard
- Document Management page
- Reports section

### Week 2: DMS + PMS
**Days 1-3: Donor Management System**
- Donor list page
- Donor profile page
- Add/edit donor form
- Donation list page
- Add donation modal
- Campaign list page
- Campaign detail page
- Donor analytics page

**Days 4-5: Project Management System (Part 1)**
- Project dashboard
- Project detail page
- Task management (list + kanban views)
- Budget tracking page

### Week 3: PMS + FRS + Polish
**Days 1-2: Project Management System (Part 2)**
- Impact tracking page
- Collaboration features
- Complete remaining PMS screens

**Days 3-4: Field Reporting System**
- Report templates page
- Report creation forms (5 templates)
- Report list page
- Report detail page
- Manager review page
- Reports dashboard

**Day 5: Integration & Polish**
- Cross-module linking
- Loading states, empty states
- Error handling
- Responsive fixes
- Deploy to Vercel
- Documentation

---

## Key Screens Summary

**Total Screens:** ~40

**Compliance Hub (8 screens):**
- Executive Dashboard
- Financial Dashboard
- Donor Analytics Dashboard
- Project Dashboard
- Impact Dashboard
- Documents
- Grant Compliance
- Reports

**DMS (8 screens):**
- Donor List
- Donor Profile
- Add/Edit Donor
- Donation List
- Add Donation
- Campaign List
- Campaign Detail
- Create Campaign

**PMS (7 screens):**
- Project Dashboard
- Project Detail
- Task Management
- Budget Tracking
- Impact Tracking
- Create Project
- Collaboration View

**FRS (6 screens):**
- Report Templates
- Create Report (5 templates = 5 forms)
- Report List
- Report Detail
- Review Queue
- Reports Dashboard

**Common (2 screens):**
- Login
- 404

---

## Success Criteria

- All 40 screens functional
- Mobile responsive (especially FRS)
- Realistic mock data
- Fast performance (<2s load)
- Clean, professional design
- Deployed and shareable

---

## Out of Scope (Prototype)

- Backend/API
- Real authentication
- Database
- Payment processing
- Email/SMS
- File uploads
- Real-time features

---

## Notes

- Use `/kc_old` as design inspiration (similar look and feel, not exact copy)
- Kanyini logo: `https://keaprojects.com.au/wp-content/uploads/2025/06/KEaP-Logo-v5-1024x846.webp`
- Reference kc_old's color scheme (#597242 green) and component patterns

---

**Status:** Ready to Build  
**Last Updated:** November 24, 2025
