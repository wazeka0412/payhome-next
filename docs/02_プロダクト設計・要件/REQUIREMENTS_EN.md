# PayHome Platform Requirements Definition

**Document Version:** 3.0
**Date:** 2026-03-22
**Target System:** payhome-next
**Technology Stack:** Next.js 16.2.0 / React 19 / Supabase / Vercel
**Intended Audience:** PM / Engineers / Business Owners

---

## Chapter 1: Document Purpose

This document defines the requirements for the "PayHome" platform.

In addition to conventional requirements definitions (screen and feature listings), the following perspectives are explicitly included:

- **Data Requirements**: What data to store, when, where, and for what purpose
- **Event Tracking Requirements**: Which user actions to track and what to analyze
- **AI/Recommendation Requirements**: Features and prerequisites for the phased evolution of the AI concierge
- **Development Priorities**: Prioritizing data infrastructure over feature expansion

---

## Chapter 2: Background / Business Objectives

### 2.1 Business Definition

PayHome is an AI-powered housing platform that supports the decision-making process of users considering hiraya (single-story houses), while accumulating and leveraging data obtained from that decision-making process.

### 2.2 Product Objectives

1. **For Consumers**: Provide information organization, comparison, consultation, and action support for hiraya (single-story house) consideration
2. **For Housing Companies**: Provide high-precision prospective customer touchpoints with intent data
3. **Data Foundation**: Evolve into an AI housing concierge and AI sales support system based on accumulated data

### 2.3 Design Principles

| Principle | Description |
|-----------|-------------|
| Data First | Design all user touchpoints with the premise of acquiring and accumulating data |
| Phased Evolution | Evolve step by step: MVP → Data Accumulation → AI Utilization → SaaS |
| Structured Priority | Store content, lead, and behavioral data in structured formats that are easy for AI to process |
| Anonymous → Identified Connection | Design so that anonymous user behavioral data can be linked after account registration |

---

## Chapter 3: System Overview

### 3.1 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│  Browser (PC / Tablet / Smartphone)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ SSR/SSG  │  │API Routes│  │Middleware │  │  Event     │  │
│  │Next.js 16│  │          │  │(Auth)     │  │ Collection │  │
│  │          │  │          │  │           │  │  API       │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└────┬──────────────┬──────────────┬──────────────┬───────────┘
     │              │              │              │
┌────▼────┐  ┌──────▼──────┐  ┌───▼───┐  ┌──────▼──────┐
│Supabase │  │ External API │  │  GA4  │  │   Future    │
│PostgreSQL│  │・OpenAI     │  │       │  │ Extensions  │
│          │  │・Stripe     │  │       │  │・Redis      │
│・users   │  │・Resend     │  │       │  │・BigQuery   │
│・leads   │  │・Google OAuth│ │       │  │・ML Pipeline│
│・builders│  └─────────────┘  └───────┘  └─────────────┘
│・events  │
│・user_   │
│ profiles │
│・user_   │
│ events   │
│・chat_   │
│ sessions │
│・chat_   │
│ messages │
│・favorites│
│・comparisons│
│・content_ │
│ engage-  │
│ ments    │
└──────────┘
```

### 3.2 Technology Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 16.2.0 | SSR/SSG/API |
| UI | React | 19.2.4 | Components |
| Language | TypeScript | 5.x | Type safety |
| CSS | Tailwind CSS | 4.x | Styling |
| DB | Supabase (PostgreSQL) | - | Data persistence |
| Auth | NextAuth.js | 4.24.13 | Authentication & sessions |
| Payments | Stripe | 20.4.1 | Subscriptions |
| Email | Resend | 6.9.4 | Notification emails |
| AI/LLM | OpenAI | 6.32.0 | AI concierge |
| Deployment | Vercel | - | Hosting |
| SEO | next-sitemap | 4.2.3 | Sitemap generation |
| Analytics | GA4 | - | Access analytics |

---

## Chapter 4: User Classification

### 4.1 Role Definitions

| Role | Description | Access Scope |
|------|-------------|-------------|
| anonymous | Non-logged-in user | Public page viewing, AI chat usage, form submission |
| user | Registered user | + Favorites, comparisons, browsing history, user dashboard |
| builder | Housing company representative | + Builder dashboard, own lead viewing |
| admin | System administrator | Full access to all features |

### 4.2 Unified User Identifier Design

| State | Identifier | Behavioral Data Handling |
|-------|-----------|------------------------|
| Anonymous (first visit) | anonymous_id (UUID, stored in browser LocalStorage) | Recorded in user_events with anonymous_id |
| At registration | user_id issued + anonymous_id linked | Past anonymous_id behavioral data merged to user_id |
| Logged in | user_id | Recorded in user_events with user_id |

**Design Intent:** By connecting anonymous browsing and chat behavior to account registration, we build a continuous context of "what properties this person viewed, what they consulted about, and what concerned them before making an inquiry."

---

## Chapter 5: Feature List

### 5.1 Consumer-Facing (toC): 20 Screens

| # | Path | Screen Name | Status | Collected Data |
|---|------|------------|--------|---------------|
| 1 | / | Top Page | ✅ | page_view, video_view |
| 2 | /property/[id] | Property Detail | ✅ | page_view, video_view, favorite_add |
| 3 | /articles | Article List | ✅ | page_view |
| 4 | /articles/[id] | Article Detail | ✅ | article_read, scroll_depth |
| 5 | /interview | Interview List | ✅ | page_view |
| 6 | /interview/[id] | Interview Detail | ✅ | article_read |
| 7 | /voice | Customer Testimonials List | ✅ | page_view |
| 8 | /voice/[id] | Customer Testimonial Detail | ✅ | article_read |
| 9 | /webinar | Seminar List | ✅ | page_view |
| 10 | /webinar/[id] | Seminar Detail | ✅ | event_detail_view |
| 11 | /news | News List | ✅ | page_view |
| 12 | /news/[id] | News Detail | ✅ | article_read |
| 13 | /magazine | Monthly Magazine | ✅ | page_view |
| 14 | /event | Event List | ✅ | page_view |
| 15 | /event/[id] | Event Detail | ✅ | event_detail_view |
| 16 | /builders | Builder List | ✅ | page_view |
| 17 | /catalog | Catalog | ✅ | page_view |
| 18 | /simulator | Loan Calculator | ✅ | simulator_use |
| 19 | /consultation | Free Consultation Form | ✅ | consultation_request |
| 20 | /thanks | Thank You Page | ✅ | - |

### 5.2 Housing Company-Facing (toB): 8 Screens ✅

| # | Path | Screen Name |
|---|------|------------|
| 1 | /biz | Biz Top |
| 2 | /biz/service | Service Overview |
| 3 | /biz/ad | Advertising & Tie-ups |
| 4 | /biz/partner | Partner |
| 5 | /biz/articles | Biz Article List |
| 6 | /biz/news | Biz News |
| 7 | /biz/webinar | Biz Seminars |
| 8 | /biz/contact | Contact |

### 5.3 Admin Panel (appadmin CMS): 27 Screens ✅

Full content CRUD, page editing, SEO management, media management, workflows, audit logs, backups, system settings

### 5.4 Dashboard: 7 Screens

| # | Path | Screen Name | Status |
|---|------|------------|--------|
| 1 | /dashboard | TOP | 🔧 |
| 2 | /dashboard/builder | Builder KPI | 🔧 |
| 3 | /dashboard/builder/leads | Lead Management | 🔧 |
| 4 | /dashboard/builder/events | Event Management | 🔧 |
| 5 | /dashboard/builder/profile | Profile | 🔧 |
| 6 | /dashboard/builder/billing | Billing Management | 📋 |
| 7 | /dashboard/user | User Dashboard | 📋→🔧 (priority elevated) |

---

## Chapter 6: Functional Requirements

### 6.1 Consumer-Facing Features (Implemented ✅)

Currently implemented features are maintained. Refer to the screen list in Chapter 5 for details.

### 6.2 User Dashboard (Priority Elevated)

Favorites, comparisons, and browsing history are not deferred but are prioritized as core components of data accumulation.

| Feature | Description | Phase |
|---------|-------------|-------|
| Favorites Management | Add/remove properties and builders from favorites. List view | Phase 1 |
| Comparison List | Add properties and builders to comparison list. Side-by-side comparison | Phase 2 |
| Browsing History | History of previously viewed properties, articles, and builders | Phase 1 |
| Consultation History | List and resume past AI chat conversations | Phase 2 |
| My Profile | Self-reported family structure, budget, preferred area, etc. | Phase 2 |

### 6.3 Lead Enhancement

| Additional Field | Description | Acquisition Method | Phase |
|-----------------|-------------|-------------------|-------|
| source_channel | Inflow channel (YouTube/SEO/SNS/Direct) | UTM parameters / referrer | Phase 1 |
| source_content_id | Source content ID | Content ID of the previous page | Phase 1 |
| recent_views | Recent browsing history (max 10 items) | Aggregated from user_events | Phase 1 |
| chat_summary | Recent chat summary | Retrieved from chat_sessions | Phase 2 |
| interest_tags | Interest tags (hiraya/ZEH/design, etc.) | Inferred from browsing and chat | Phase 2 |
| concerns | Concerns (budget/land/builder selection, etc.) | Extracted from chat | Phase 2 |
| comparison_targets | Compared builders and properties | From comparison_history | Phase 2 |
| recommended_builders | Recommended builder candidates | Output of recommendation logic | Phase 2 |
| recommendation_reason | Recommendation reason | Output of recommendation logic | Phase 2 |
| consideration_phase | Consideration phase (information gathering/comparison/near decision) | Inferred from behavior patterns | Phase 2 |
| temperature | Interest level (0-100) | Behavioral scoring | Phase 1 |
| conversion_reason | Conversion reason | Context analysis at form submission | Phase 2 |

---

## Chapter 7: Data Requirements

### 7.1 Data Model List

| # | Table Name | Purpose | Status |
|---|-----------|---------|--------|
| 1 | users | User authentication & basic info | ✅ Existing |
| 2 | leads | Leads (inquiries) | ✅ Existing → Extend |
| 3 | builders | Builder (housing company) info | ✅ Existing → Extend |
| 4 | events | Open house & events | ✅ Existing |
| 5 | user_profiles | User attributes & intent | 📋 New |
| 6 | user_events | Behavioral event log | 📋 New |
| 7 | chat_sessions | Chat sessions | 📋 New |
| 8 | chat_messages | Chat messages | 📋 New |
| 9 | favorites | Favorites | 📋 New |
| 10 | comparisons | Comparison history | 📋 New |
| 11 | content_engagements | Content engagement aggregation | 📋 New |
| 12 | builder_recommendations | Builder recommendation history | 📋 New |

### 7.2 New Table Definitions

#### user_profiles Table

| Column | Type | Description | Acquisition Method |
|--------|------|-------------|-------------------|
| id | uuid | PK | Auto-generated |
| user_id | uuid | FK(users) | At authentication |
| family_structure | text | Family structure (couple only/raising children/senior, etc.) | Self-reported or inferred from chat |
| age_range | text | Age range (30s/40s/50s/60+) | Self-reported or inferred from chat |
| planned_timing | text | Planned construction timing (within 6 months/within 1 year/undecided, etc.) | Self-reported or inferred from chat |
| has_land | boolean | Whether they own land | Self-reported |
| preferred_area | text | Preferred area | Self-reported or form |
| budget_range | text | Budget range (under 20M JPY/20-30M JPY/over 30M JPY) | Self-reported or inferred from chat |
| hiraya_preference | integer | Hiraya (single-story) preference level (1-5) | Inferred from behavior |
| design_orientation | text[] | Design orientation (modern/Japanese-style/natural/simple) | Inferred from browsing patterns |
| performance_orientation | text[] | Performance orientation (insulation/earthquake resistance/ZEH/energy saving) | Inferred from browsing patterns |
| lifestyle_priorities | text[] | Lifestyle priorities (aging considerations/child-rearing/cost-focused/housework flow/storage) | Self-reported or inferred from chat |
| consideration_phase | text | Consideration phase (information gathering/comparison/near decision/post-contract) | Inferred from behavior patterns |
| temperature | integer | Interest level (0-100) | Behavioral scoring |
| created_at | timestamptz | Created at | Auto-generated |
| updated_at | timestamptz | Updated at | Auto-generated |

#### user_events Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK(users), nullable (when anonymous) |
| anonymous_id | text | Anonymous user identifier |
| event_type | text | Event type (see below) |
| content_type | text | Content type (property/article/builder/event, etc.) |
| content_id | text | Content ID |
| metadata | jsonb | Additional info (dwell time, scroll depth, etc.) |
| page_url | text | Page URL |
| referrer | text | Referrer |
| device_type | text | Device type |
| created_at | timestamptz | Event timestamp |

#### chat_sessions Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK(users), nullable |
| anonymous_id | text | Anonymous user identifier |
| source_page | text | Page where conversation started |
| started_at | timestamptz | Start time |
| ended_at | timestamptz | End time |
| message_count | integer | Message count |
| category | text | Conversation category (financial consultation/builder search/floor plan consultation/performance comparison/general question) |
| inferred_intent | text | Inferred intent (information gathering/comparison/specific consultation/complaint) |
| extracted_tags | text[] | Extracted tags (hiraya/3LDK/ZEH/Kagoshima/20M JPY, etc.) |
| conversation_summary | text | Conversation summary (AI auto-generated) |
| recommended_action | text | Recommended action (open house reservation/catalog request/consultation, etc.) |
| lead_conversion | boolean | Whether converted to lead |
| lead_id | uuid | Lead ID if converted |
| next_best_action | text | Next best action (future) |
| created_at | timestamptz | Created at |

#### chat_messages Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| session_id | uuid | FK(chat_sessions) |
| role | text | 'user' or 'assistant' |
| content | text | Message content |
| tokens_used | integer | Tokens used |
| created_at | timestamptz | Sent at |

#### favorites Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK(users) |
| content_type | text | 'property' / 'builder' / 'article' / 'event' |
| content_id | text | Content ID |
| created_at | timestamptz | Added at |

#### comparisons Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK(users) |
| content_type | text | 'property' / 'builder' |
| content_ids | text[] | Array of IDs to compare |
| comparison_axes | text[] | Comparison axes (price/floor plan/performance/design, etc.) |
| created_at | timestamptz | Created at |

#### content_engagements Table (Aggregation Table)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| content_type | text | Content type |
| content_id | text | Content ID |
| total_views | integer | Total views |
| unique_views | integer | Unique views |
| avg_duration | integer | Average dwell time (seconds) |
| favorite_count | integer | Favorite count |
| comparison_count | integer | Comparison add count |
| lead_count | integer | Lead conversion count |
| period | date | Aggregation period (daily) |

#### builder_recommendations Table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK(users) |
| builder_id | text | Recommended builder ID |
| score | decimal | Recommendation score |
| reason | text | Recommendation reason |
| source | text | Recommendation source (AI/rule-based/manual) |
| clicked | boolean | Whether clicked |
| created_at | timestamptz | Recommended at |

### 7.3 Existing Table Extensions

#### builders Table Additional Columns

Register structured data for AI recommendations during CMS content entry.

| Additional Column | Type | Description |
|-------------------|------|-------------|
| price_range | text | Supported price range (15-25M JPY/25-40M JPY, etc.) |
| hiraya_ratio | integer | Hiraya (single-story) construction ratio (%) |
| hiraya_annual | integer | Annual hiraya construction count |
| design_taste | text[] | Design taste (modern/Japanese-style/natural/simple/Scandinavian) |
| insulation_grade | text | Insulation grade (4/5/6/7) |
| earthquake_grade | text | Earthquake resistance grade (1/2/3) |
| ua_value_range | text | UA value range |
| features | text[] | Features (housework flow/circular flow/storage/courtyard/open ceiling/sloped ceiling) |
| suitable_for | text[] | Suitable customer profiles (families with children/seniors/dual-income/multi-generational) |
| land_proposal | boolean | Whether land proposals are available |
| common_concerns | text[] | Common concerns (price/construction period/after-sales service, etc.) |
| strengths | text[] | Strengths |
| weaknesses | text[] | Weaknesses and caveats |
| comparison_points | text[] | Points for comparison with other companies |

---

## Chapter 8: AI / Chat / Recommendation Requirements

### 8.1 Phased Evolution of AI Chat (Concierge)

#### MVP (Phase 1)

| Feature | Description | Prerequisites |
|---------|-------------|--------------|
| FAQ Response | Answer basic hiraya knowledge and frequently asked questions | Include FAQ in system prompt |
| Basic Interview | Gather budget, area, family structure, construction timing | Define interview items in prompt |
| Content Suggestions | Suggest related videos and articles | Register content data in RAG |
| Consultation Funnel Connection | Guide users to open house reservations, catalog requests, and free consultations during conversation | Include CTA links in prompt |
| Conversation Log Storage | Save all messages to chat_messages and session info to chat_sessions | DB design and API implementation |

#### Next Phase (Phase 2)

| Feature | Description | Prerequisites |
|---------|-------------|--------------|
| User Type Diagnosis | Determine user type (cost-focused/performance-focused/design-focused, etc.) from conversation content | Writing to user_profiles |
| Builder Recommendation | Recommend builders matching user interests with reasons | Builder structured data + recommendation logic |
| Open House Recommendation | Guide users to upcoming open houses and events matching their interests | Event data RAG registration |
| Next Action Suggestion | Suggest next steps based on consideration phase | Reference user_profiles consideration phase |
| Auto-generated Conversation Summary | Auto-generate conversation_summary at session end | GPT summarization processing |
| Lead Conversion Assessment | Assess from conversation content whether to convert to lead, set lead_conversion flag | Assessment logic implementation |
| Intent Extraction | Extract extracted_tags and inferred_intent from conversation | GPT tag extraction processing |

#### Future Phase (Phase 3)

| Feature | Description | Prerequisites |
|---------|-------------|--------------|
| AI Housing Concierge | Advanced dialogue incorporating user consideration phase, behavior history, and profile | Sufficient accumulated behavioral data |
| AI Sales Agent | Present "you should propose this to this customer" to housing companies | Integration of lead + behavior + chat + profile |
| Pre-meeting Summary Generation | Auto-summarize lead behavior history, chat content, and intent into one page | chat_sessions + user_events + user_profiles |
| Builder-specific Proposal Optimization | Auto-generate proposals combining builder strengths with customer interests | Builder structured data + user data |
| Next Best Action Estimation | Estimate and display "what to do next" for each user | Behavior pattern analysis + closed deal data |

### 8.2 Recommendation Logic

#### Initial Recommendation in Phase 2

```
Input:
  - user_profiles attributes (area, budget, family structure, design orientation)
  - user_events browsing trends (characteristics of frequently viewed properties)
  - chat_sessions extracted_tags

Processing:
  - Match against builders structured data
  - Score calculation (attribute match × browsing similarity × geographic proximity)

Output:
  - Record in builder_recommendations
  - Top 3 recommended builders + recommendation reasons
```

---

## Chapter 9: CMS / Admin Panel Requirements

### 9.1 CMS Structured Data Policy

The CMS is designed not merely as a content management system, but as **a foundation for registering structured items that are easy for AI to understand and recommend**.

### 9.2 Structured Items by Content Type

#### Structured Items to Add for Properties

| Item | Type | Purpose |
|------|------|---------|
| design_taste | text[] | Design taste classification |
| lifestyle_fit | text[] | Suitable lifestyles (child-rearing/seniors/dual-income/hobby-focused) |
| key_features | text[] | Feature tags (courtyard/open ceiling/circular flow/large storage, etc.) |
| target_audience | text[] | Target audience |

#### Structured Items to Add for Articles

| Item | Type | Purpose |
|------|------|---------|
| related_concerns | text[] | Related concerns and questions |
| consideration_phase | text | Target consideration phase |
| related_builder_ids | text[] | Related builders |

#### Builder Structured Items

Refer to the builders table additional columns in Chapter 7.

### 9.3 Admin Panel Extension Requirements

| Feature | Description | Phase |
|---------|-------------|-------|
| Chat Analytics Dashboard | Session count, completion rate, lead conversion rate, extracted tag distribution | Phase 2 |
| Behavioral Analytics Dashboard | Content-level engagement, funnel analysis | Phase 2 |
| Extended Lead Detail | Display behavior history, chat summary, recommendation reasons | Phase 2 |
| Builder Report Generation | Monthly lead analysis, content effectiveness reports | Phase 2 |

---

## Chapter 10: Event Tracking / Analytics Requirements

### 10.1 Tracked Event List

| Event Name | Trigger | Destination | Phase |
|-----------|---------|-------------|-------|
| page_view | Page display | GA4 + user_events | Phase 1 |
| top_view | Top page display | GA4 | Phase 1 |
| article_read | Certain scroll depth on article page | GA4 + user_events | Phase 1 |
| video_view | YouTube video playback start | GA4 + user_events | Phase 1 |
| builder_detail_view | Builder detail page display | GA4 + user_events | Phase 1 |
| event_detail_view | Event detail page display | GA4 + user_events | Phase 1 |
| favorite_add | Favorite added | user_events | Phase 1 |
| favorite_remove | Favorite removed | user_events | Phase 1 |
| comparison_add | Added to comparison list | user_events | Phase 2 |
| chat_start | AI chat started | GA4 + chat_sessions | Phase 1 |
| chat_complete | AI chat ended (5+ messages) | GA4 + chat_sessions | Phase 1 |
| chat_to_lead | Chat to lead conversion | GA4 + chat_sessions | Phase 2 |
| reservation_submit | Open house reservation form submitted | GA4 + leads | Phase 1 |
| catalog_request | Catalog request form submitted | GA4 + leads | Phase 1 |
| consultation_request | Free consultation form submitted | GA4 + leads | Phase 1 |
| simulator_use | Loan simulator used | GA4 + user_events | Phase 1 |
| line_click | LINE friend add click | GA4 | Phase 1 |
| tel_click | Phone number click | GA4 | Phase 1 |

### 10.2 GA4 Custom Dimensions

| Dimension | Example Values | Purpose |
|-----------|---------------|---------|
| user_type | anonymous / user / builder | Analysis by user category |
| consideration_phase | information gathering / comparison / near decision | Analysis by phase |
| content_category | property / article / builder / event | Analysis by content type |
| source_channel | youtube / seo / sns / direct | Analysis by inflow channel |

---

## Chapter 11: Non-Functional Requirements

### 11.1 Performance

| Item | Requirement |
|------|-------------|
| Initial page load (LCP) | Within 3 seconds |
| Page transition | Within 1 second |
| API response time | Within 500ms |
| AI chat initial response | Within 3 seconds |
| Event transmission | Asynchronous, must not block page rendering |

### 11.2 Security

| Item | Requirement | Status |
|------|-------------|--------|
| HTTPS communication | All communications TLS encrypted | ✅ |
| JWT authentication | Valid for 30 days | ✅ |
| RBAC | 4 levels: admin/builder/user/anonymous | ✅ |
| XSS protection | HTML sanitizer | ✅ |
| Behavioral data isolation | Store personal information and behavior logs separately | Phase 1 |
| Consent management | Obtain consent for data collection | Phase 1 |
| Audit log | Record administrative operations | ✅ |

### 11.3 Availability & Scalability

| Item | Requirement |
|------|-------------|
| Uptime | 99.9% or higher |
| Serverless | Vercel Edge Functions |
| DB | Supabase connection pooling |
| CDN | Vercel CDN |
| Event buffer | Batch user_events writes to reduce load |

### 11.4 Responsive & SEO

| Item | Requirement | Status |
|------|-------------|--------|
| Mobile first | Support from 375px | ✅ |
| Meta tags | Set on all pages | ✅ |
| OGP | Images for SNS sharing | ✅ |
| Sitemap | Auto-generated | ✅ |
| Structured data (JSON-LD) | Properties, events, articles | 📋 |

---

## Chapter 12: External Integration Requirements

| Service | Purpose | Status | Phase |
|---------|---------|--------|-------|
| Supabase | DB & storage | ✅ | - |
| NextAuth | Authentication | ✅ | - |
| Google OAuth | Social login | ✅ | - |
| OpenAI GPT-4o | AI concierge | ✅ | - |
| GA4 | Access analytics & custom events | 🔧 | Phase 1 |
| Resend | Lead notification emails | 🔧 | Phase 1 |
| Stripe | Builder subscriptions | 📋 | Phase 3 |
| LINE Messaging API | Friend add & notifications | 📋 | Phase 2 |

### 12.1 API List

| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET/POST | /api/auth/[...nextauth] | - | ✅ |
| POST | /api/contact | Not required | ✅ |
| GET | /api/leads | Required | ✅ |
| POST | /api/leads | Required | ✅ |
| GET/PATCH | /api/leads/[id] | Required | ✅ |
| GET | /api/builders | Not required | ✅ |
| GET/POST | /api/events | Not required/Required | ✅ |
| GET | /api/stats | Required | ✅ |
| POST | /api/chat | Not required | ✅ → Extend |
| POST | /api/events/track | Not required | 📋 Phase 1 |
| GET/POST | /api/favorites | Required | 📋 Phase 1 |
| GET/POST | /api/comparisons | Required | 📋 Phase 2 |
| GET | /api/recommendations | Required | 📋 Phase 2 |
| GET | /api/user/profile | Required | 📋 Phase 2 |
| PATCH | /api/user/profile | Required | 📋 Phase 2 |

---

## Chapter 13: MVP / Next Phase / Future Vision

### Phase 0 (Completed ✅)
- All consumer-facing pages (20 screens)
- All housing company-facing pages (8 screens)
- CMS admin panel (27 screens)
- Lead acquisition forms
- Authentication infrastructure
- AI chat infrastructure
- Builder dashboard (read-centric)

### Phase 1: Data Infrastructure Build (Top Priority)

| Item | Why Now |
|------|---------|
| Unified user identifiers (anonymous_id → user_id connection) | Foundation for behavioral data continuity. Data is unusable without this |
| user_events table + event tracking API | Core of AI training data. The sooner we start, the more data accumulates |
| chat_sessions / chat_messages tables | Intent extraction and summarization are impossible without chat logs |
| Chat log storage feature | Extension of existing API chat. Save logs to DB |
| Linking leads with behavioral data | Add "recent views" and "source channel" to leads. Increases value for housing companies |
| Favorites feature (favorites) | Explicit expression of user interest. Important both as data and recommendation input |
| Browsing history display | UX improvement + data visualization |
| GA4 custom event tracking design | Foundation for funnel analysis and CV rate measurement |
| CMS structured data field additions | Matching material for AI recommendations. Adding later causes data gaps |
| Resend lead notification emails | Instant notification to builders. Operational baseline |

### Phase 2: AI Utilization Begins

| Item | Description |
|------|-------------|
| user_profiles table | Phased profile building |
| Comparison list feature | Property and builder comparison |
| AI chat extensions (recommendation, diagnosis, summarization) | Intent extraction, tagging, recommendation, summarization |
| Initial recommendation logic | Browsing trends × builder structured data |
| Intent-enriched leads | Attach interest tags, chat summaries, behavioral context to leads |
| Scoring visualization | Automated interest level calculation based on behavioral data |
| Admin analytics dashboard | Chat analysis, behavioral analysis, funnel analysis |
| Builder report infrastructure | Monthly lead reports, content effectiveness reports |

### Phase 3: Full AI Operation & SaaS

| Item | Description |
|------|-------------|
| AI Housing Concierge | Consideration phase awareness + behavioral context + personalized dialogue |
| AI Sales Agent | Proposal support for housing companies |
| Pre-meeting auto-summary generation | Integrated summary of chat + behavior + profile |
| Sales optimization SaaS | Closed deal pattern analysis, optimal proposals |
| Stripe payment integration | Builder subscriptions |
| CRM integration | Data linkage to external CRMs |
| Area expansion | Kyushu region → Chugoku/Shikoku regions |

---

## Chapter 14: Development Priority

### Top Priority (Phase 1)

| Priority | Implementation Item | Reason |
|----------|-------------------|--------|
| S | Unified user identifiers (anonymous_id) | Connection foundation for all data |
| S | user_events table + event tracking API | Core of AI data |
| S | chat_sessions / chat_messages storage | Material for intent estimation |
| S | Adding source channel and recent views to leads | High immediate impact on lead quality |
| A | Favorites feature | User interest expression data |
| A | Browsing history feature | Data accumulation + UX improvement |
| A | GA4 custom event design and implementation | No improvement without measurement |
| A | CMS structured data field additions | Material for AI recommendations. Historical data gaps if added later |
| B | Resend lead notification emails | Operational baseline |
| B | CMS → Supabase persistence | Migration of parts currently dependent on TS files |

### Secondary (Phase 2)

| Priority | Implementation Item |
|----------|-------------------|
| A | AI chat extensions (intent extraction, tagging, summarization) |
| A | Initial recommendation logic |
| A | Intent-enriched leads |
| B | user_profiles table |
| B | Comparison list feature |
| B | Admin analytics dashboard |
| B | Builder report infrastructure |
| B | Scoring visualization |

### Can Be Deferred

| Item | Reason |
|------|--------|
| Advanced Stripe billing management | Manual handling is sufficient with few partners |
| Complex billing UI | Prove value first |
| Nationwide-scale specifications | Accumulate sufficient data in Kyushu first |
| Advanced automation (auto lead distribution, etc.) | Wait until sufficient data and rules are in place |
| CRM integration | Investigate builder-side CRM usage first |

---

## Chapter 15: KPI / Evaluation Metrics

### 15.1 Platform-wide KPIs

| Category | KPI | Current Value | Target (6 months) |
|---------|-----|---------------|-------------------|
| Acquisition | Monthly web PV | Measuring | 50,000 |
| Acquisition | YouTube monthly views | 152,228 | 300,000 |
| Leads | Monthly lead count | - | 50 |
| Conversion | Lead → closed deal conversion rate | - | 15% |
| B2B | Partner builder count | 12 companies | 25 companies |

### 15.2 AI / Chat KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| AI consultation start rate | Percentage of site visitors who started a chat | 5% |
| AI consultation completion rate | Percentage of chat starters who exchanged 5+ messages | 60% |
| AI-driven CV rate | Percentage of chat completers who converted to leads | 15% |
| Chat → reservation rate | Percentage who made open house reservations after chat | 8% |
| Chat → catalog request rate | Percentage who requested catalogs after chat | 12% |
| Chat → bounce rate | Percentage who left without any action after chat | 65% or below |

### 15.3 Content → CV Rate

| KPI | Definition |
|-----|-----------|
| Video → CV rate | Percentage of video viewers who converted to leads |
| Article → CV rate | Percentage of article readers who converted to leads |
| Builder detail → CV rate | Percentage of builder detail viewers who converted to leads |
| Event detail → CV rate | Percentage of event detail viewers who made reservations |

### 15.4 User Behavior KPIs

| KPI | Definition |
|-----|-----------|
| Favorite rate | Percentage of property detail viewers who added to favorites |
| Comparison add rate | Percentage of property detail viewers who added to comparison list |
| Recommendation click rate | Percentage of recommendation impressions that were clicked |
| Registration rate | Percentage of visitors who registered as members |

### 15.5 Closed Deal Analysis KPIs

| KPI | Definition | Purpose |
|-----|-----------|---------|
| Average content views by closed deal users | Average number of content items viewed by users who closed deals | Content strategy metric |
| Average consultation count by closed deal users | Average number of AI chat sessions used by closed deal users | AI contribution assessment |
| Content trends of closed deal users | Content categories frequently viewed by closed deal users | Content production priorities |
| Consideration period of closed deal users | Days from first visit to closed deal | Funnel optimization |

---

*This document was created based on the implementation state and future vision of the payhome-next codebase as of 2026-03-22.*
