# Platform Operation Rules
> Version 1.0 | 2026-03-22 | wazeka Inc.

---

## Table of Contents

- [Chapter 1: Authentication & Role Management](#chapter-1-authentication--role-management)
- [Chapter 2: KPI Statistics API Calculation Rules](#chapter-2-kpi-statistics-api-calculation-rules)
- [Chapter 3: Event (Open House) Operation Rules](#chapter-3-event-open-house-operation-rules)
- [Chapter 4: CMS Admin Panel Permissions & Workflow](#chapter-4-cms-admin-panel-permissions--workflow)
- [Chapter 5: Campaign Management](#chapter-5-campaign-management)
- [Chapter 6: LINE Integration & Social Features](#chapter-6-line-integration--social-features)

---

## Chapter 1: Authentication & Role Management

### 1.1 Role Definitions

The following table defines the four platform roles and their access scope.

| Role | Description | Access Scope | Target Users |
|------|-------------|-------------|--------------|
| anonymous | Not logged in | Public pages, AI chat, form submissions, favorites (via anonymous_id) | General visitors |
| user | Registered member | + User dashboard, favorites (via user_id), browsing history | Hiraya home seekers |
| builder | Builder staff | + Builder dashboard, own leads | Partner builder employees |
| admin | Administrator | All features (CMS, admin panel, all leads) | wazeka staff |

### 1.1a Permission Matrix by Content Type (v2.0 NEW)

> **v4.0 strategy:** Member signup unlocks premium content. This matrix defines exactly what each role can access.

| Content / Feature | anonymous | user (member) | builder | admin |
|-------------------|:---:|:---:|:---:|:---:|
| TOP page | ✅ | ✅ | ✅ | ✅ |
| Video content list | ✅ | ✅ | ✅ | ✅ |
| Video detail (basic info) | ✅ | ✅ | ✅ | ✅ |
| **Floor plan (full resolution)** | ❌ (blurred) | ✅ | ✅ | ✅ |
| Builder list / detail (basic) | ✅ | ✅ | ✅ | ✅ |
| **Builder detail (ranking / match score)** | ❌ | ✅ | ✅ | ✅ |
| AI chat | ✅ | ✅ | ✅ | ✅ |
| **AI home-building diagnosis (10 questions)** | ✅ (1-time, no save) | ✅ (saved, rerunnable) | ✅ | ✅ |
| **AI builder recommendation (3 builders)** | ❌ | ✅ | ✅ | ✅ |
| **AI floor-plan recommendation** | ❌ | ✅ | ✅ | ✅ |
| Favorites | ✅ (LocalStorage, max 5) | ✅ (unlimited, synced) | ✅ | ✅ |
| **Comparison feature (up to 3 builders)** | ❌ | ✅ | ✅ | ✅ |
| Browsing history | — | ✅ | — | ✅ |
| Open house reservation form | ✅ | ✅ | ✅ | ✅ |
| **Case library (Phase 1.5)** | ❌ | ✅ | ✅ | ✅ |
| **Community Q&A (Phase 1.5)** | ❌ (read-only snippets) | ✅ (full + posting) | ✅ | ✅ |
| **My Page** | ❌ | ✅ | — | ✅ |
| Simple builder admin panel (`/dashboard/builder`) | ❌ | ❌ | ✅ | ✅ |
| CMS admin panel (`/appadmin`) | ❌ | ❌ | ❌ | ✅ |

**Implementation note:** Anonymous visitors see blurred content with a "会員登録で見る" CTA overlay. The blur is implemented via CSS filter on the image + a styled CTA card above.

### 1.2 Role Assignment Rules

| Action | Assigned Role | Method |
|--------|--------------|--------|
| Create account via email or Google | user | Automatic |
| Partner builder's designated staff | builder | Admin manually sets role in users table |
| wazeka employee | admin | Admin manually sets role |

### 1.3 Phase-based Access Control Plan

| Phase | /dashboard/builder/* | /dashboard/user/* | Reason |
|-------|---------------------|-------------------|--------|
| Phase 1 (current) | admin only | admin only | Restricted during development/testing |
| Phase 2 (trigger: 3+ partners) | builder + admin | user + admin | Open builder dashboard when partners reach 3 |
| Phase 3 | builder + admin | user + admin | All roles fully operational |

### 1.4 Role Switch Procedure

- Phase 2 switch: Modify middleware.ts (engineer implements)
- Pre-switch checklist:
  - 3+ partners contracted
  - Builder dashboard tested
  - Builder users linked to builders table
  - Management approval

---

## Chapter 2: KPI Statistics API Calculation Rules

### 2.1 Builder KPI Cards (`/api/stats?builder={name}`)

| KPI Card | Formula | Data Source | Notes |
|----------|---------|-------------|-------|
| Monthly Leads | Count of leads where builder_name=target OR selected_companies contains target, in current month | leads table | Resets monthly |
| Closings | Count of leads where status='completed_deal' in current month | leads table | Based on builder reports |
| Event Reservations | Count of leads where type='viewing_reservation' in current month | leads table | |
| Listing Score | Builder info completion rate (required fields filled / total required fields x 100) | builders table | Based on listing standards |

### 2.2 Cost Per Lead Calculation

- Formula: Monthly plan fee / monthly leads count
- Example: Standard plan JPY 80,000 / 10 leads = JPY 8,000/lead
- Industry average: JPY 8,500 (general housing portal lead cost, 2025 data)
- Display: "Cost per lead: JPY X,XXX (Industry avg: JPY 8,500)"

### 2.3 Admin KPI (`/api/stats`)

| KPI | Formula | Source |
|-----|---------|--------|
| Total leads | Count of all leads records | leads |
| New leads (this month) | Count of records with current month created_at | leads |
| Active leads | Count where status IN ('new','in_progress','referred') | leads |
| Closings (this month) | Count where status='completed_deal' in current month | leads |
| Active partners | Count of builders where is_active=true | builders |

### 2.4 Month-over-Month Change

- Compare current month vs previous month: (current - previous) / previous x 100
- Display as +X% or -X%
- If previous month is zero, display "-"

---

## Chapter 3: Event (Open House) Operation Rules

### 3.1 Event Types

| Type | Description | Typical Capacity |
|------|-------------|-----------------|
| Completion Viewing | Tour of completed home | 10-30 groups |
| Model House | Permanent model house tour | Unlimited |
| Payhome Special | Payhome-hosted event | 10-20 groups |
| Online Viewing | Virtual tour via Zoom | 50-100 people |

### 3.2 Capacity Management

| Rule | Detail |
|------|--------|
| Capacity | Stored in events.capacity column |
| Reservations | Stored in events.reservations column. +1 per booking |
| Full determination | When reservations >= capacity |
| Full display | Show "This event is fully booked" and disable reservation button |
| Cancellation | No self-service cancellation. User contacts CS, staff manually decrements reservations |

### 3.3 Post-Event Processing

| Action | Timing | Method |
|--------|--------|--------|
| Set is_active to false | Day after event | Manual from CMS. Or daily batch (Phase 2) |
| Event data retention | Indefinite | Do not delete. Retain for analytics |
| Attendee follow-up | Day after event | CS sends thank-you email (manual) |

### 3.4 Event Creation Permissions

| Creator | Method |
|---------|--------|
| admin | Create from CMS admin panel |
| builder | Create from builder dashboard (Phase 2) |

---

## Chapter 4: CMS Admin Panel Permissions & Workflow

### 4.1 Access Control

- Only admin role can access `/appadmin/*`
- Remains admin-only in Phase 2+ (builders edit their info via builder dashboard)

### 4.2 Content Approval Workflow (Current)

- No approval workflow. Admin directly edits and publishes.
- Reason: With 1-2 admins, approval workflow is unnecessary overhead.

### 4.3 Content Approval Workflow (Phase 2+)

| Status | Meaning | Next States |
|--------|---------|-------------|
| Draft | Being created. Not visible on site | Review |
| Review | Awaiting approval. Admin checks | Published or Rejected |
| Published | Visible on site | Draft (unpublish) |
| Rejected | Needs revision | Draft |

### 4.4 CMS Audit Log

- All CMS operations are logged to the audit table (viewable at `/appadmin/audit`)
- Logged fields:
  - Operator
  - Operation type (create / edit / delete)
  - Target content
  - Timestamp

---

## Chapter 5: Campaign Management

### 5.1 Current Campaign Structure

- CampaignBar: Announcement bar above header
- CampaignSection: Promotion section on top page
- Currently hardcoded in source:
  - `src/components/layout/CampaignBar.tsx`
  - `CampaignSection.tsx`

### 5.2 Campaign Update Rules

| Item | Current Method | Phase 2+ |
|------|---------------|----------|
| Content change | Code modification (request to engineer) | CMS admin panel |
| Display period | Hardcoded dates in code | Start/end dates in CMS |
| Reward amount change | Code modification | CMS |
| Hide campaign | Code modification or component removal | CMS toggle |

### 5.3 Engineer Request Format for Campaign Changes

- Target files: `src/components/layout/CampaignBar.tsx` / `CampaignSection.tsx`
- Required information:
  - Campaign name
  - Reward details (amount / conditions)
  - Display period (start / end)
  - CTA text and link
- Process: Preview confirmation -> production deploy

### 5.4 Current Campaign (Reference)

| Item | Detail |
|------|--------|
| Name | Spring Housing Campaign |
| Period | Until April 30 |
| Reward 1 | PayPay JPY 1,000 (free consultation) |
| Reward 2 | PayPay JPY 4,000 (event attendance) |
| Reward 3 | Gift card / cash JPY 100,000 (contract via Payhome) |

---

## Chapter 6: LINE Integration & Social Features

### 6.1 LINE Official Account

| Item | Value |
|------|-------|
| Account ID | @253gzmoh |
| Friend add URL | https://line.me/R/ti/p/@253gzmoh |
| Display locations | LineFloat (bottom-right button) / CTA on pages / YouTube descriptions |
| URL management | LINE_URL constant in `src/lib/constants.ts` |

### 6.2 LINE URL Change Procedure

- Modify LINE_URL in `src/lib/constants.ts`
- Auto-propagates to all pages (components reference the constant)
- Build -> Deploy after change

### 6.3 Share Buttons (ShareButtons Component)

| Platform | Method | OGP Fields |
|----------|--------|------------|
| X (Twitter) | Web Intent API | og:title, og:description, og:image |
| Facebook | Share Dialog | og:title, og:description, og:image |
| LINE | LINE Share API | og:title, og:description, og:image |

### 6.4 OGP Configuration

- Each content's seoTitle / seoDescription / ogpImage maps to OGP tags
- If ogpImage is not set: fallback to default image (`/images/ogp-default.png`)
- Verification: Use Twitter Card Validator or similar tools

### 6.5 Social Account Registry

| Platform | Account | URL | Management |
|----------|---------|-----|------------|
| YouTube | @pei_home | https://www.youtube.com/@pei_home | Direct |
| LINE | @253gzmoh | https://line.me/R/ti/p/@253gzmoh | constants.ts |
| Instagram | @pei_home | (URL not configured) | Not yet active |

---

## Document Information

| Item | Detail |
|------|--------|
| Document Title | Payhome Platform Operation Rules |
| Version | 1.0 |
| Date | 2026-03-22 |
| Author | wazeka Inc. |
| Classification | Internal Use Only |
