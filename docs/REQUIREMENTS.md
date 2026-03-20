# Payhome Platform - Requirements Specification

**Version:** 1.0
**Date:** 2026-03-21
**Company:** wazeka Inc.
**Product:** payhome (Housing Media Platform)
**Contact:** Murata Shunnosuke (CEO)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Database Schema](#3-database-schema)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [API Specification](#5-api-specification)
6. [Page Structure & Routing](#6-page-structure--routing)
7. [Feature Requirements by Phase](#7-feature-requirements-by-phase)
8. [Business Logic & Data Flow](#8-business-logic--data-flow)
9. [AI Chatbot Integration](#9-ai-chatbot-integration)
10. [Third-Party Integrations](#10-third-party-integrations)
11. [Design System & Branding](#11-design-system--branding)
12. [Performance & SEO Requirements](#12-performance--seo-requirements)
13. [Environment & Deployment](#13-environment--deployment)
14. [Remaining Tasks](#14-remaining-tasks)

---

## 1. Project Overview

### 1.1 What is Payhome?

Payhome is a Japanese housing media platform operated by wazeka Inc. It connects homebuyers with trusted local builders through YouTube video content (42,800+ subscribers, 257 videos) and an AI-powered recommendation engine.

### 1.2 Business Model

The platform operates a dual-sided marketplace:

- **B2C (Homebuyers):** Free access to property videos, articles, AI consultation, event bookings, and document requests.
- **B2B (Builders/Construction Companies):** Tiered SaaS plans with pay-per-lead pricing.

**Revenue Streams:**

| Revenue Type | Unit Price |
|---|---|
| Document request (lead) | 3,000 JPY/lead |
| Event reservation (lead) | 5,000 JPY/lead |
| Closed deal commission | 150,000 JPY/deal |
| Growth plan (monthly) | 50,000 JPY/mo |
| Premium plan (monthly) | 100,000 JPY/mo |
| Loan referral | 30,000-50,000 JPY/case |
| Insurance referral | 20,000-50,000 JPY/case |

### 1.3 Target Users

| User Type | Description |
|---|---|
| Homebuyers | Age 35-65, primarily female (54%), looking for single-story homes ("hiraya"). Mobile-first (49.4% mobile). |
| Builders | Local construction companies across Japan. Currently 12 active in the system. |
| Admin | Internal wazeka staff managing leads, builders, content, and analytics. |

---

## 2. System Architecture

### 2.1 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.0 |
| Language | TypeScript | ^5 |
| Runtime | React | 19.2.4 |
| Styling | Tailwind CSS | v4 |
| Database | Supabase (PostgreSQL) | - |
| Auth | NextAuth.js | v4 |
| AI | OpenAI GPT-4o | - |
| Email | Resend | - |
| Payments | Stripe | ^20.4.1 |
| Deployment | Vercel | - |
| Domain | payhome.jp (pending) | - |

### 2.2 Project Structure

```
payhome-next/
├── src/
│   ├── app/
│   │   ├── (user)/           # B2C public pages (layout with Header/Footer/ChatWidget)
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── about/
│   │   │   ├── area/
│   │   │   ├── articles/[id]/
│   │   │   ├── builders/contact/
│   │   │   ├── catalog/
│   │   │   ├── company/
│   │   │   ├── consultation/
│   │   │   ├── event/
│   │   │   ├── interview/[id]/
│   │   │   ├── magazine/
│   │   │   ├── mypage/
│   │   │   ├── news/[id]/
│   │   │   ├── privacy/
│   │   │   ├── property/[id]/
│   │   │   ├── simulator/
│   │   │   ├── terms/
│   │   │   ├── thanks/
│   │   │   ├── videos/
│   │   │   ├── voice/[id]/
│   │   │   └── webinar/[id]/
│   │   ├── (biz)/biz/        # B2B pages (layout with BizHeader)
│   │   │   ├── page.tsx
│   │   │   ├── ad/
│   │   │   ├── articles/[id]/
│   │   │   ├── contact/
│   │   │   ├── news/[id]/
│   │   │   ├── partner/
│   │   │   ├── service/
│   │   │   └── webinar/[id]/
│   │   ├── admin/            # Admin panel (admin role only)
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── builders/
│   │   │   └── properties/
│   │   ├── dashboard/        # Auth-protected dashboards
│   │   │   ├── page.tsx      # Login page
│   │   │   ├── builder/      # Builder dashboard (builder+admin roles)
│   │   │   │   ├── leads/
│   │   │   │   ├── events/
│   │   │   │   ├── billing/
│   │   │   │   └── profile/
│   │   │   └── user/         # User dashboard
│   │   │       ├── favorites/
│   │   │       ├── consultations/
│   │   │       └── history/
│   │   └── api/              # API routes
│   │       ├── auth/[...nextauth]/
│   │       ├── builders/
│   │       ├── chat/
│   │       ├── contact/
│   │       ├── events/
│   │       ├── leads/[id]/
│   │       ├── leads/
│   │       └── stats/
│   ├── components/
│   │   ├── layout/           # Header, Footer, FixedBar, LineFloat, ChatWidget, etc.
│   │   └── ui/               # Card, FilterTabs, Pagination, PlanCard, ShareButtons, etc.
│   ├── data/                 # Static JSON data (properties, builders, articles, etc.)
│   ├── lib/
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── store.ts          # Data access layer (Supabase CRUD)
│   │   └── supabase.ts       # Supabase client initialization
│   └── types/
│       ├── index.ts          # Domain type definitions
│       └── next-auth.d.ts    # NextAuth type augmentation
├── supabase/
│   ├── schema.sql            # Database DDL
│   └── seed.sql              # Sample data (12 builders, 10 leads, 4 events)
├── public/                   # Static assets (images, favicon)
└── docs/                     # This documentation
```

### 2.3 Data Flow

```
[YouTube 42.8K subs] ──→ [Web Media (Next.js)] ──→ [AI Chatbot (GPT-4o + RAG)]
                              │                           │
                              ▼                           ▼
                        [Lead Forms]               [AI Recommendations]
                              │                           │
                              └─────────┬─────────────────┘
                                        ▼
                                  [Supabase DB]
                                   /        \
                          [Admin Panel]   [Builder Dashboard]
                          (KPIs, Lead     (Leads, Events,
                           Management)    Billing, Profile)
```

---

## 3. Database Schema

### 3.1 Supabase Project

- **Project ID:** `fochghjyvhrriglwcbqw`
- **Region:** Northeast Asia (Tokyo)
- **URL:** `https://fochghjyvhrriglwcbqw.supabase.co`

### 3.2 Tables

#### `builders` - Housing Company Profiles

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, default gen_random_uuid() | |
| name | TEXT | NOT NULL | Company name |
| email | TEXT | NOT NULL, UNIQUE | Contact email |
| phone | TEXT | | Phone number |
| area | TEXT | NOT NULL | Service area |
| address | TEXT | NOT NULL | Office address |
| specialties | TEXT[] | DEFAULT '{}' | e.g. ["hiraya", "natural materials"] |
| description | TEXT | | Company description |
| website | TEXT | | Official website URL |
| logo_url | TEXT | | Logo image URL |
| plan | TEXT | DEFAULT 'free' | One of: free, standard, growth, premium |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Auto-updated via trigger |

#### `users` - Platform Users

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK, default gen_random_uuid() | |
| email | TEXT | NOT NULL, UNIQUE | |
| name | TEXT | NOT NULL | |
| role | TEXT | NOT NULL, DEFAULT 'user' | One of: admin, builder, user |
| builder_id | UUID | FK → builders(id) | Set when role='builder' |
| avatar_url | TEXT | | Profile picture |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

#### `leads` - Customer Inquiries

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | |
| type | TEXT | NOT NULL | See lead types below |
| name | TEXT | NOT NULL | Customer name |
| email | TEXT | NOT NULL | |
| phone | TEXT | | |
| company | TEXT | | For B2B leads |
| area | TEXT | | Preferred area |
| budget | TEXT | | Budget range |
| layout | TEXT | | e.g. "3LDK" |
| message | TEXT | | Free text message |
| video | TEXT | | YouTube video that triggered inquiry |
| builder_id | UUID | | Assigned builder |
| builder_name | TEXT | | |
| selected_companies | TEXT[] | | For catalog requests |
| selected_services | TEXT[] | | Selected service types |
| status | TEXT | DEFAULT 'new' | See statuses below |
| score | INTEGER | DEFAULT 50 | Lead quality score (0-100) |
| memo | TEXT | | Internal notes |
| user_id | UUID | | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

**Lead Types (type column):**
- `free_consultation` (無料相談)
- `document_request` (資料請求)
- `event_reservation` (見学会予約)
- `builder_consultation` (工務店相談)
- `b2b_inquiry` (B2Bお問い合わせ)
- `partner_application` (パートナー申込)
- `seminar_application` (セミナー申込)

**Lead Statuses (status column):**
- `new` (新規) → `in_progress` (対応中) → `referred` (紹介済) → `meeting_done` (面談済) → `closed` (成約) | `lost` (失注)

#### `events` - Viewing Events / Seminars

| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PK | |
| builder_id | UUID | NOT NULL | Hosting builder |
| builder_name | TEXT | NOT NULL | |
| title | TEXT | NOT NULL | Event title |
| date | TEXT | NOT NULL | Event date |
| location | TEXT | NOT NULL | Venue |
| type | TEXT | NOT NULL | completion, model, special, online |
| capacity | INTEGER | DEFAULT 10 | Max participants |
| reservations | INTEGER | DEFAULT 0 | Current bookings |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

#### `favorites` - User Saved Properties

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK → users(id), NOT NULL |
| property_id | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |

#### `chat_history` - AI Chat Logs

| Column | Type | Constraints |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | |
| session_id | TEXT | NOT NULL |
| role | TEXT | NOT NULL (user/assistant) |
| content | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### 3.3 Row Level Security (RLS)

All tables have RLS enabled. Key policies:

| Table | Policy | Rule |
|---|---|---|
| builders | SELECT | Public read for active builders |
| builders | ALL | Admin only for CUD |
| leads | ALL | Admin has full access |
| leads | SELECT | Builders can view their assigned leads |
| events | SELECT | Public read |
| events | ALL | Admin only for CUD |
| favorites | ALL | Users can manage their own favorites only |
| chat_history | ALL | Users can access their own chat history only |

### 3.4 Indexes

```sql
idx_leads_status        ON leads(status)
idx_leads_builder_name  ON leads(builder_name)
idx_leads_email         ON leads(email)
idx_leads_created_at    ON leads(created_at)
idx_events_date         ON events(date)
idx_events_builder_id   ON events(builder_id)
idx_favorites_user_id   ON favorites(user_id)
idx_chat_user_id        ON chat_history(user_id)
idx_chat_session_id     ON chat_history(session_id)
```

---

## 4. Authentication & Authorization

### 4.1 NextAuth.js Configuration

- **Strategy:** JWT (not database sessions)
- **Session Max Age:** 30 days
- **Providers:**
  1. **Credentials** - Email + password (stored in Supabase `users` table)
  2. **Google OAuth** - Conditionally enabled when `GOOGLE_CLIENT_ID` is set

### 4.2 User Roles

| Role | Access Level | Description |
|---|---|---|
| `admin` | Full access | wazeka internal staff. Can manage all leads, builders, content. |
| `builder` | Builder dashboard | Housing company staff. Can view their own leads, manage events, edit profile. |
| `user` | User dashboard | Homebuyers. Can manage favorites, view consultation history. |

### 4.3 Route Protection (Middleware)

| Route Pattern | Required Role | Redirect on Fail |
|---|---|---|
| `/admin/*` | admin | → `/dashboard` |
| `/dashboard/builder/*` | builder or admin | → `/dashboard` |
| `/dashboard/user/*` | any authenticated | → `/dashboard` |
| All other routes | public | - |

### 4.4 JWT Token Structure

```typescript
interface JWT {
  sub: string       // user ID
  role: string      // 'admin' | 'builder' | 'user'
  builderId?: string // UUID of linked builder (for builder role)
}
```

### 4.5 Session Object

```typescript
interface Session {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role: string        // 'admin' | 'builder' | 'user'
    builderId?: string  // linked builder UUID
  }
}
```

### 4.6 Pre-seeded Accounts

| Email | Role | Notes |
|---|---|---|
| admin@payhome.jp | admin | 村田 聖 |
| info@mandai.com | builder | Linked to 万代ホーム |
| info@tamaru.com | builder | Linked to タマルハウス |

---

## 5. API Specification

### 5.1 Authentication

```
POST /api/auth/[...nextauth]
GET  /api/auth/[...nextauth]
```
Standard NextAuth.js endpoints (signin, signout, session, csrf, providers).

### 5.2 Leads

#### `GET /api/leads`

Returns all leads. Supports query filters.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| builder | string | Filter by builder_name |
| email | string | Filter by email (exact match) |

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "type": "free_consultation",
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "status": "new",
    "score": 50,
    "createdAt": "2026-03-20T10:00:00Z",
    ...
  }
]
```

#### `POST /api/leads`

Create a new lead.

**Request Body:**
```json
{
  "type": "document_request",
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "phone": "090-1234-5678",
  "area": "鹿児島市",
  "budget": "2000万円台",
  "layout": "3LDK",
  "message": "平屋に興味があります"
}
```

**Response:** `201 Created`

#### `GET /api/leads/[id]`

Returns a single lead by UUID.

**Response:** `200 OK` | `404 Not Found`

#### `PATCH /api/leads/[id]`

Update lead status, score, or memo.

**Request Body:**
```json
{
  "status": "in_progress",
  "score": 75,
  "memo": "Called back, scheduled meeting"
}
```

**Response:** `200 OK` | `404 Not Found`

### 5.3 Contact Form

#### `POST /api/contact`

Creates a lead from the public contact form.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "type": "string",
  "message": "string"
}
```

**Response:** `200 OK` with `{ "id": "uuid" }`

### 5.4 Builders

#### `GET /api/builders`

Returns all active builders ordered by name.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "万代ホーム",
    "email": "info@mandai.com",
    "area": "鹿児島県全域",
    "address": "鹿児島市...",
    "specialties": ["hiraya", "natural_materials"],
    "plan": "standard",
    "isActive": true,
    ...
  }
]
```

### 5.5 Events

#### `GET /api/events`

Returns all events. Supports builder filter.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| builder | string | Filter by builder_id |

#### `POST /api/events`

Create a new event.

**Request Body:**
```json
{
  "builderId": "uuid",
  "builderName": "万代ホーム",
  "title": "完成見学会",
  "date": "2026-04-15",
  "location": "鹿児島市...",
  "type": "completion",
  "capacity": 10
}
```

### 5.6 Stats (Admin Dashboard)

#### `GET /api/stats`

Returns aggregated KPIs.

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| builder | string | If set, returns builder-specific stats |

**Response (Admin - no builder param):**
```json
{
  "totalLeads": 45,
  "catalogLeads": 20,
  "eventLeads": 10,
  "consultationLeads": 15,
  "totalBuilders": 12,
  "totalEvents": 8,
  "activeEvents": 4
}
```

**Response (Builder - with builder param):**
```json
{
  "totalLeads": 8,
  "catalog": 3,
  "event": 2,
  "consultation": 3,
  "converted": 1,
  "costPerLead": 3750,
  "industryAvgCostPerLead": 15000
}
```

### 5.7 AI Chat

#### `POST /api/chat`

Streaming Server-Sent Events (SSE) endpoint for AI chat.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "予算2000万で平屋はありますか？" }
  ]
}
```

**Response:** `text/event-stream` (SSE)

The AI uses a Japanese-language system prompt focused on housing consultation. It recommends properties and builders, then guides users to conversion points (consultation, document request, event booking).

---

## 6. Page Structure & Routing

### 6.1 Public Pages (B2C)

| Route | Page | Key Features |
|---|---|---|
| `/` | Homepage | Hero section, featured content, reviews, news, articles grid |
| `/about` | About Payhome | Mission, team, history |
| `/area` | Area Search | 7 regions with prefecture filters, property cards |
| `/articles` | Articles List | Filterable article grid, pagination |
| `/articles/[id]` | Article Detail | Full article with share buttons |
| `/builders` | Builder List | 12 builders with area filter |
| `/builders/contact` | Builder Inquiry | Contact form for specific builder |
| `/catalog` | Document Request | Multi-builder checkbox selection, bulk request form |
| `/company` | Company Info | wazeka Inc. details |
| `/consultation` | Free Consultation | LP with 3 benefits, 4-step process, FAQ, form, LINE |
| `/event` | Event Listing | Active events with modal booking form |
| `/interview/[id]` | Interview Detail | Builder interviews with photos |
| `/magazine` | Digital Magazine | Monthly Payhome magazine |
| `/mypage` | User Account | Favorites, history, settings (requires auth) |
| `/news/[id]` | News Detail | Company news articles |
| `/privacy` | Privacy Policy | Legal page |
| `/property/[id]` | Property Detail | YouTube embed, specs, pricing, builder info, FAQ, CTAs |
| `/simulator` | Loan Simulator | Real-time mortgage calculator |
| `/terms` | Terms of Service | Legal page |
| `/thanks` | Confirmation | Post-form-submission thank you page |
| `/videos` | Video Gallery | All 257 YouTube videos |
| `/voice/[id]` | Customer Reviews | Testimonials |
| `/webinar/[id]` | Webinar Detail | Online seminar details and registration |

### 6.2 Business Pages (B2B)

| Route | Page | Key Features |
|---|---|---|
| `/biz` | B2B Homepage | Stats, services, case studies, partner CTA |
| `/biz/ad` | Advertising | Tie-up menus, ad formats, pricing |
| `/biz/articles/[id]` | B2B Articles | Marketing knowledge content |
| `/biz/contact` | Business Inquiry | B2B contact form |
| `/biz/news/[id]` | Industry News | B2B news articles |
| `/biz/partner` | Partner Recruitment | 3 plans, ROI simulator, application form |
| `/biz/service` | Service Overview | Plans, pricing table, FAQ |
| `/biz/webinar/[id]` | B2B Webinars | Industry seminars |

### 6.3 Admin Pages

| Route | Page | Key Features |
|---|---|---|
| `/admin` | Admin Home | Navigation to sub-sections |
| `/admin/dashboard` | KPI Dashboard | Lead counts, conversions, builder stats |
| `/admin/leads` | Lead Management | Table view, status updates, filtering, memos |
| `/admin/builders` | Builder Management | Builder list, plan management, account creation |
| `/admin/properties` | Property Management | Property data CRUD, publish toggle |

### 6.4 Dashboard Pages (Auth Required)

| Route | Required Role | Key Features |
|---|---|---|
| `/dashboard` | - | Login page (email/password + Google OAuth) |
| `/dashboard/builder/leads` | builder | View assigned leads, update statuses |
| `/dashboard/builder/events` | builder | Create/manage events, view reservations |
| `/dashboard/builder/billing` | builder | Monthly invoices, payment history |
| `/dashboard/builder/profile` | builder | Edit company profile, logo, specialties |
| `/dashboard/user/favorites` | user | Saved properties, comparison tool |
| `/dashboard/user/consultations` | user | Consultation request history |
| `/dashboard/user/history` | user | Browsing and chat history |

---

## 7. Feature Requirements by Phase

### Phase 0 - Launch Prep (Current Phase)

**Status: Infrastructure ~70% complete**

| ID | Task | Status | Notes |
|---|---|---|---|
| 0-1 | Supabase project creation | DONE | Project ID: fochghjyvhrriglwcbqw |
| 0-2 | DB tables + RLS | DONE | 6 tables, 9 indexes, seed data |
| 0-3 | store.ts Supabase migration | DONE | All CRUD operations async |
| 0-4 | NextAuth.js implementation | DONE | Credentials + Google OAuth |
| 0-5 | Login page wiring | DONE | 3-role login flow |
| 0-6 | Middleware route protection | DONE | Role-based access |
| 0-7 | Environment variables | DONE | .env.local configured |
| 0-8 | Vercel deployment | PENDING | CLI auth in progress |
| 0-9 | Domain setup (payhome.jp) | TODO | |
| 0-10 | error.tsx / not-found.tsx | TODO | Error boundary pages |
| 0-11 | OGP images (@vercel/og) | TODO | Social share cards |
| 0-12 | sitemap.xml / robots.txt | TODO | next-sitemap configured |
| 0-13 | localhost URL replacement | TODO | Replace all hardcoded localhost |

### Phase 1 - Launch & Initial Sales (Month 1-3)

**Builder Dashboard MVP:**
- Lead detail view with customer info, preferences, inquiry source
- Status pipeline: new → contacted → hearing → introduced → meeting → contracted/lost
- Event creation form with capacity tracking
- Reservation list per event
- Company profile editor (name, area, specialties, logo upload)
- Monthly billing summary with PDF generation

**Content & Data:**
- 200 property articles (AI-drafted from YouTube videos, human-reviewed)
- RAG knowledge base with 200+ property records
- Builder data collection via Google Forms
- YouTube description links to web (257 videos)

**Marketing:**
- GA4 + GTM integration
- Facebook Pixel + CAPI
- Google Ads campaigns
- Meta retargeting ads

### Phase 2 - Expansion (Month 3-12)

**User My Page:**
- Favorites list with property thumbnails, pricing, layout
- Comparison table (up to 3 properties side-by-side)
- Consultation request history with status tracking
- AI chat conversation history
- Saved loan simulations
- Notification preferences (new properties, events, magazine)

**Builder Dashboard Expansion:**
- Analytics dashboard (page views, AI recommendation count, area ranking)
- Monthly report PDF with branded header
- AI chat log viewer (Premium plan only)
- Performance benchmarks vs. industry average

**AI Enhancements:**
- LINE Messaging API integration (webhook-based AI chat)
- Voice input support (Web Speech API)
- Personalized recommendations based on browsing + chat history
- Automated article generation pipeline

### Phase 3 - National Expansion (Year 1-3)

**Franchise Partner Dashboard:**
- Regional KPI dashboard
- Builder contract management
- Content management with HQ approval workflow
- Revenue/royalty tracking (70% partner / 30% HQ)

**Advanced AI:**
- AI agent: end-to-end flow (consultation → matching → scheduling → loan → insurance)
- CG room tour generation from floor plans

**Data Business:**
- Anonymized demand reports (area/budget/layout trends)
- Monthly subscription to builders (50,000-100,000 JPY/company/month)

---

## 8. Business Logic & Data Flow

### 8.1 Lead Lifecycle

```
[Form Submission / AI Chat / LINE]
        │
        ▼
   Lead Created (status: new, score: 50)
        │
        ▼
   Admin Reviews → Assigns to Builder
        │
        ▼
   Status: in_progress
        │
   ┌────┴────┐
   ▼         ▼
referred   (direct contact)
   │
   ▼
meeting_done
   │
   ┌──┴──┐
   ▼     ▼
closed  lost
```

### 8.2 Lead Scoring

- Default score: 50
- Admin can manually adjust (0-100)
- Future: automated scoring based on engagement signals

### 8.3 Billing Calculation (Per Builder)

```
Monthly Invoice =
  (document_request_count × 3,000) +
  (event_reservation_count × 5,000) +
  (closed_deal_count × 150,000) +
  monthly_plan_fee
```

### 8.4 Data Type Conversion

The codebase uses **snake_case** in the database and **camelCase** in the frontend. Conversion functions are in `src/lib/store.ts`:

- `dbLeadToLead()` - converts DB lead to frontend Lead type
- `dbBuilderToBuilder()` - converts DB builder to frontend BuilderProfile type
- `dbEventToEvent()` - converts DB event to frontend Event type

### 8.5 Conversion Points (CTAs)

Every property detail page includes 3 CTA buttons + LINE link:

1. **Free Consultation** → `/consultation` (commission: 150,000 JPY on deal)
2. **Request Documents** → `/catalog` (fee: 3,000 JPY/request)
3. **Book Event** → `/event` (fee: 5,000 JPY/booking)
4. **LINE Chat** → `line.me/R/ti/p/@253gzmoh` (free)

A persistent **Fixed Bar** at the bottom of all pages also provides these CTAs.

---

## 9. AI Chatbot Integration

### 9.1 Current Implementation

- **Endpoint:** `POST /api/chat`
- **Model:** GPT-4o
- **Response format:** Server-Sent Events (streaming)
- **Language:** Japanese only
- **System prompt:** Housing consultation focused

### 9.2 Chat Widget

- **Location:** Bottom-right floating widget on all B2C pages
- **Trigger:** Click to open chat panel
- **Initial message:** Greeting with example questions
- **Behavior:** Recommends properties → guides to CTA

### 9.3 Future RAG Architecture

```
User Query
    │
    ▼
[Embedding Model] → Vector Search (pgvector in Supabase)
    │
    ▼
[Top-K Property Matches]
    │
    ▼
[GPT-4o with Context] → Streaming Response
    │
    ▼
[Auto-insert CTA links]
```

**Required for RAG:**
- Enable `pgvector` extension in Supabase
- Create `properties` table with `embedding VECTOR(1536)` column
- Build ingestion pipeline: property data → embedding → upsert
- Modify `/api/chat` to include vector search results in context

---

## 10. Third-Party Integrations

### 10.1 Configured

| Service | Purpose | Status |
|---|---|---|
| Supabase | Database + Auth adapter | Active |
| OpenAI | AI Chatbot (GPT-4o) | Active |
| NextAuth.js | Authentication | Active |

### 10.2 Planned

| Service | Purpose | Phase | Notes |
|---|---|---|---|
| Vercel | Hosting + CDN | 0 | Deployment pending |
| Google OAuth | Social login | 0 | Requires GOOGLE_CLIENT_ID/SECRET |
| Google Analytics 4 | Analytics | 0 | Requires NEXT_PUBLIC_GA_ID |
| Google Search Console | SEO | 0 | Domain verification needed |
| Facebook Pixel | Ad tracking | 0 | Requires NEXT_PUBLIC_FB_PIXEL_ID |
| Resend | Transactional email | 1 | Lead notifications, invoices |
| Stripe | Payment processing | 1 | Monthly plan billing |
| LINE Messaging API | LINE chatbot | 2 | Webhook integration |
| Cloudflare R2 | File storage | 1 | Images, PDFs (S3-compatible) |

### 10.3 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fochghjyvhrriglwcbqw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>

# NextAuth
NEXTAUTH_URL=https://payhome.jp  # Update after domain setup
NEXTAUTH_SECRET=<generated-secret>

# OAuth (optional, enable when ready)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
OPENAI_API_KEY=<key>

# Email
RESEND_API_KEY=<key>

# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_FB_PIXEL_ID=

# Site
NEXT_PUBLIC_SITE_URL=https://payhome.jp
```

---

## 11. Design System & Branding

### 11.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | `#E8740C` | Buttons, links, accents |
| Accent | `#D4660A` | Hover states, emphasis |
| Dark | `#3D2200` | Text, headings |
| Light | `#FFF8F0` | Backgrounds |
| Light Gray | `#F5F0EB` | Card backgrounds, borders |
| LINE Green | `#06C755` | LINE CTA buttons |

### 11.2 Typography

| Type | Font Family | Weights |
|---|---|---|
| Body / Sans | Noto Sans JP | 400, 500, 600, 700 |
| Headings | Montserrat | 600, 700, 800 |

### 11.3 Character ("Pei-kun")

The site features a mascot character with various animations:
- Peek-in animation (appears from screen edge)
- Back-to-top button integration
- Greeting on first visit
- Easter egg on logo click
- Touch/tap reaction

### 11.4 Responsive Breakpoints

Three-tier responsive design:
- **Mobile:** < 768px (priority - 49.4% of traffic)
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

**Important UX Notes:**
- Target audience is 55+ (57% of viewers). Use minimum **16px** body text and **48px** tap targets.
- Fixed bottom bar: 4 CTA buttons on desktop, 2 on mobile
- LINE floating button: icon-only below 480px

### 11.5 Custom Animations (Tailwind)

```
pulse-slow: 2s ease-in-out infinite  (LINE button)
bounce-slow: 2.5s ease-in-out infinite  (chat bubble)
chat-ring: 2s ease-out 1  (chat button ring effect)
chat-wiggle: 3s ease-in-out infinite  (character wiggle)
fade-in-section: entrance animation for sections
card-hover: lift effect on card hover
```

---

## 12. Performance & SEO Requirements

### 12.1 Core Web Vitals Targets

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

### 12.2 SEO

- **Language:** `lang="ja"` on `<html>`
- **Meta:** Unique title and description per page
- **OGP:** Open Graph + Twitter Card meta tags per page
- **Structured Data:** Schema.org JSON-LD (Organization, Article, Product, Event, FAQPage)
- **Sitemap:** Auto-generated via `next-sitemap`
- **Robots:** Allow all crawlers

### 12.3 Image Optimization

- Use `next/image` for all images
- WebP format preferred
- Lazy loading for below-fold images
- Placeholder blur for hero images

---

## 13. Environment & Deployment

### 13.1 Development

```bash
npm run dev     # Start dev server on port 3000
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint check
```

### 13.2 Deployment Pipeline

```
Local Development
      │
      ▼
  git push → GitHub Repository
      │
      ▼
  Vercel Auto-Deploy
      │
      ├── Preview (PR branches)
      └── Production (main branch)
```

### 13.3 Vercel Configuration

- **Framework:** Next.js (auto-detected)
- **Build Command:** `next build`
- **Output Directory:** `.next`
- **Node.js Version:** 20.x
- **Environment Variables:** Must be set in Vercel Dashboard (see Section 10.3)

---

## 14. Remaining Tasks

### 14.1 Immediate (Phase 0 Completion)

| Priority | Task | Description |
|---|---|---|
| P0 | Vercel deployment | Complete CLI auth + first deploy |
| P0 | Domain setup | Configure payhome.jp DNS → Vercel |
| P0 | localhost replacement | Replace all hardcoded `localhost:3000` URLs |
| P1 | Error pages | Create `error.tsx` and `not-found.tsx` |
| P1 | OGP images | Generate dynamic social share images |
| P1 | Sitemap/robots | Verify next-sitemap output |
| P1 | GA4 integration | Add tracking script to layout |
| P1 | Search Console | Verify domain ownership |

### 14.2 Phase 1 Development Priorities

| Priority | Feature | Estimated Effort |
|---|---|---|
| P0 | Builder dashboard - Lead view | 1 week |
| P0 | Builder dashboard - Event CRUD | 3 days |
| P0 | Admin dashboard - KPI cards (real data) | 3 days |
| P0 | Lead notification emails (Resend) | 2 days |
| P1 | Builder profile editor | 3 days |
| P1 | Billing summary page | 1 week |
| P1 | Stripe integration for monthly plans | 1 week |
| P1 | Image upload (Cloudflare R2) | 3 days |
| P2 | Property data import pipeline | 1 week |
| P2 | RAG vector search setup | 1 week |

### 14.3 Known Technical Debt

| Issue | Location | Notes |
|---|---|---|
| Static JSON data | `src/data/` | Properties, articles, news are hardcoded JSON. Need migration to Supabase. |
| Password storage | `src/lib/auth.ts` | Currently accepts 4+ char password for dev. Must implement bcrypt hashing. |
| No email verification | Auth flow | Users are auto-created without email confirmation. |
| Hardcoded localhost | Various files | Some API calls and links reference `localhost:3000`. |
| No rate limiting | API routes | Public endpoints need rate limiting (especially `/api/chat`). |
| No input validation | API routes | Need Zod schema validation on all POST/PATCH endpoints. |
| No CSRF protection | Contact forms | NextAuth handles its own CSRF, but custom forms need protection. |
| Image optimization | Components | Some `<img>` tags should be migrated to `next/image`. |

---

## Appendix A: Key File Reference

| File | Purpose |
|---|---|
| `src/lib/supabase.ts` | Supabase client (browser + server) |
| `src/lib/store.ts` | Data access layer (all CRUD operations) |
| `src/lib/auth.ts` | NextAuth.js configuration |
| `src/middleware.ts` | Route protection middleware |
| `src/types/index.ts` | Domain type definitions (Property, Builder, Lead, Event, ChatMessage) |
| `src/types/next-auth.d.ts` | NextAuth type augmentation |
| `supabase/schema.sql` | Complete database DDL |
| `supabase/seed.sql` | Sample data for development |
| `src/app/api/chat/route.ts` | AI chat streaming endpoint |
| `src/app/dashboard/page.tsx` | Login page |

## Appendix B: Supabase SQL Commands

**Reset and recreate database:**
```sql
-- Run in Supabase SQL Editor
-- 1. Drop all tables
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS builders CASCADE;

-- 2. Run schema.sql contents
-- 3. Run seed.sql contents
```

**Check table data:**
```sql
SELECT COUNT(*) FROM builders;  -- Expected: 12
SELECT COUNT(*) FROM leads;     -- Expected: 10
SELECT COUNT(*) FROM events;    -- Expected: 4
SELECT COUNT(*) FROM users;     -- Expected: 3
```

## Appendix C: Glossary

| Japanese Term | English | Context |
|---|---|---|
| 平屋 (hiraya) | Single-story house | Primary content focus |
| 工務店 (koumuten) | Builder / Construction company | B2B clients |
| 見学会 (kengakukai) | Open house / Viewing event | Lead generation channel |
| 資料請求 (shiryou-seikyuu) | Document request | Lead generation channel |
| 無料相談 (muryou-soudan) | Free consultation | Lead generation channel |
| 成約 (seiyaku) | Closed deal / Contract signed | Revenue trigger |
| 失注 (shitchuu) | Lost deal | Lead terminal state |
| 間取り (madori) | Floor plan / Layout | e.g. 3LDK |
| 坪単価 (tsubo-tanka) | Price per tsubo (3.3m2) | Property pricing metric |
| 断熱等級 (dannetsu-toukyuu) | Insulation grade | Building performance |
| 耐震等級 (taishin-toukyuu) | Earthquake resistance grade | Building performance |
