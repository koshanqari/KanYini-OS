# KC App - Admin Features Plan for KOS

## Overview
This document outlines all features from the KC (Kanyini Community) app and tracks which admin panels need to be built in KOS (Kanyini OS).

---

## 1. USER MANAGEMENT ✅ (Already exists in KC Admin)
**Current Status:** Already built in KC Admin
- View all users with search/filter
- User profile management (name, email, phone, photo)
- Skills, Education, Experience management
- Active/Inactive status toggle
- Verified/Unverified status toggle
- Bulk CSV import

**KOS Integration:** 
- ✅ We can replicate this or integrate with KC's admin
- Build user directory in KOS with read-only view or full management

---

## 2. PROJECTS MANAGEMENT (Partially built, needs enhancement)

### Current Status in KOS:
- ✅ Create/Edit projects (basic info, team, budget, milestones)
- ✅ KC-specific fields (startedBy, followers, members, funding/team goals)
- ✅ Link donors and beneficiaries to projects
- ✅ Track project progress, budget, impact metrics

### Needs to be Built:
#### 2.1 Project Content Management
- **Posts Management** (Text, Photo, Video)
  - Create/edit posts for projects
  - Upload media (photos/videos)
  - Character limit (500)
  - Moderate/approve user-generated posts
  - View post engagement (likes, comments)

- **Podcasts Management**
  - Create/edit podcasts linked to projects
  - Upload audio/video podcast files
  - Duration tracking
  - Thumbnail images

- **Journals Management**
  - Create/edit journals (articles/research)
  - Rich text editor
  - Excerpts for preview
  - Link to external URLs or upload PDFs

#### 2.2 Project Engagement
- View followers list
- Approve "Join Team" requests
- Manage active members
- Track contributions (financial)

---

## 3. EVENTS MANAGEMENT ⚠️ (Critical - Not built)

### Features Needed:
- **Create/Edit Events**
  - Event title, description
  - Type: Workshop, Meetup, Webinar, Conference, Social
  - Date, time, location
  - Virtual event flag
  - Link to project
  - Organizer name
  - Max attendees (capacity)

- **RSVP Management**
  - Track RSVPs
  - Attendee list
  - Send reminders/notifications
  - Export attendee list

- **Event Display**
  - Show events on project pages
  - Show events in community/connect tab
  - Filter events by type
  - Calendar view

---

## 4. FELLOWSHIPS MANAGEMENT ⚠️ (Not built)

### Features Needed:
- **Create/Edit Fellowships**
  - Fellowship name, description
  - Duration, eligibility criteria
  - Application deadline
  - Benefits offered
  - Status (Open/Closed)

- **Application Management**
  - Review applications
  - Accept/reject applications
  - Track participants
  - Communication with applicants

---

## 5. USER QUERIES/SUPPORT ⚠️ (Not built)

### Features Needed:
- **Query Dashboard**
  - View all user queries
  - Filter by status (Open, In Progress, Resolved)
  - Search queries
  - Assign queries to team members

- **Query Responses**
  - Chat interface for responses
  - Internal notes
  - Mark as resolved
  - Response templates

---

## 6. ACHIEVEMENTS & PLEDGES ⚠️ (Not built)

### Features Needed:
- **Achievements Management**
  - Create achievement types
  - Upload badge images
  - Define earning criteria
  - Assign achievements to users

- **Pledges Management**
  - View all user pledges
  - Pledge categories
  - Track pledge completion
  - Pledge verification

---

## 7. CONTENT MODERATION ⚠️ (Not built)

### Features Needed:
- **Posts Moderation**
  - Review reported content
  - Approve/reject posts
  - Delete inappropriate content
  - Ban users from posting

- **Comments Moderation**
  - View all comments
  - Remove inappropriate comments
  - User warnings

---

## 8. ANALYTICS & INSIGHTS (Future)

### Features Needed:
- User engagement metrics
- Project performance
- Popular content
- Community growth trends
- Event attendance analytics

---

## PRIORITY ORDER FOR DEVELOPMENT:

### Phase 1: Critical (Weeks 1-2)
1. ✅ Projects basic structure (DONE)
2. **Events Management** - Create, Edit, Link to Projects
3. **Project Content** - Posts, Podcasts, Journals

### Phase 2: Important (Weeks 3-4)
4. **Fellowships Management**
5. **User Queries/Support**
6. **Project Engagement** - Followers, Member Requests

### Phase 3: Enhancement (Weeks 5-6)
7. **Achievements & Pledges**
8. **Content Moderation**
9. **User Management** (Replicate from KC or build fresh)

### Phase 4: Analytics (Week 7+)
10. **Analytics & Insights Dashboard**

---

## TECHNICAL DECISIONS:

### Data Source:
- **Option A:** Build KOS with its own database (fully independent)
- **Option B:** Connect KOS to KC's database (shared data)
- **Option C:** KOS manages admin data, KC consumes via API

### Current Approach:
- Using mock data for prototype
- Can later connect to real database

---

*Last Updated: Current Development Phase*

