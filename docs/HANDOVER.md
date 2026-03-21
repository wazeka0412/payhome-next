# Payhome Platform — Engineer Handover Guide

**Date:** 2026-03-22
**From:** Initial development (Claude + wazeka founder)
**To:** Engineering team
**Purpose:** Enable engineers to understand, maintain, and extend the platform with full context

---

## 1. What This Platform Is

Payhome is a three-sided AI housing platform focused on the **hiraya (single-story house)** market in Kyushu, Japan.

**It is NOT** a simple property listing site or builder directory.

**It IS** a decision-support platform that:
1. Helps consumers research, compare, and decide on hiraya homes
2. Provides housing companies with intent-enriched leads (not just contact info)
3. Accumulates behavioral + conversational data to evolve into an AI Housing Concierge

This distinction matters for every engineering decision: **data capture and structure must be considered in every feature.**

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.0 |
| UI | React | 19.2.4 |
| Language | TypeScript | 5.x |
| CSS | Tailwind CSS | 4.x |
| Database | Supabase (PostgreSQL) | Managed |
| Auth | NextAuth.js | 4.24.13 |
| Payments | Stripe | 20.4.1 |
| Email | Resend | 6.9.4 |
| AI/LLM | OpenAI | 6.32.0 |
| Hosting | Vercel | - |
| Analytics | GA4 | - |

**Important Next.js note:** This project uses Next.js 16, which has breaking changes from earlier versions. The `middleware.ts` convention is deprecated in favor of `proxy.ts`. Read `node_modules/next/dist/docs/` if unsure about any API.

---

## 3. Project Structure

```
payhome-next/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (user)/             # Consumer-facing pages (route group, no URL prefix)
│   │   │   ├── property/[id]/  # Property detail (with video, specs, favorite button)
│   │   │   ├── articles/       # Blog articles
│   │   │   ├── interview/      # Builder interviews
│   │   │   ├── voice/          # Customer testimonials
│   │   │   ├── webinar/        # Seminars
│   │   │   ├── news/           # News
│   │   │   ├── event/          # Open house events
│   │   │   ├── builders/       # Builder directory
│   │   │   ├── consultation/   # Free consultation form
│   │   │   ├── simulator/      # Loan calculator
│   │   │   ├── magazine/       # Monthly magazine
│   │   │   ├── catalog/        # Catalog request
│   │   │   └── layout.tsx      # Main layout (Header, Footer, ChatWidget, FixedBar)
│   │   ├── (biz)/              # B2B pages for builders (route group)
│   │   │   └── biz/            # /biz/* routes
│   │   ├── dashboard/          # Authenticated dashboards
│   │   │   ├── builder/        # Builder KPI, leads, events, profile, billing
│   │   │   └── user/           # User favorites, history, consultations
│   │   ├── appadmin/           # CMS admin (27 pages)
│   │   ├── admin/              # Legacy admin (user/builder/lead management)
│   │   └── api/                # API routes
│   │       ├── auth/           # NextAuth + merge endpoint
│   │       ├── chat/           # AI chat (GPT-4o + SSE + log persistence)
│   │       ├── contact/        # Lead creation (with enrichment)
│   │       ├── leads/          # Lead CRUD
│   │       ├── builders/       # Builder listing
│   │       ├── events/         # Events + tracking + history
│   │       ├── favorites/      # Favorites CRUD
│   │       └── stats/          # KPI statistics
│   ├── components/
│   │   ├── chat/ChatWidget.tsx  # Floating AI chat with session management
│   │   ├── tracking/TrackPageView.tsx  # Drop-in page view tracker
│   │   ├── ui/FavoriteButton.tsx       # Heart button component
│   │   ├── property/           # Property detail components
│   │   └── appadmin/           # CMS admin components (ContentTable, FormField, etc.)
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client + DB type definitions
│   │   ├── store.ts            # Supabase-backed CRUD operations
│   │   ├── content-store.tsx   # Client-side content store (useSyncExternalStore)
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── anonymous-id.ts     # Anonymous user ID + UTM params
│   │   ├── use-track-event.ts  # Event tracking hook (fire-and-forget)
│   │   ├── tracking-queue.ts   # Batch event sending via sendBeacon
│   │   ├── email.ts            # Resend email notifications
│   │   ├── properties.ts       # Property data (static)
│   │   ├── articles-data.ts    # Article data (static)
│   │   ├── builders-data.ts    # Builder data (static, for frontend display)
│   │   ├── biz-*.ts            # B2B content data files
│   │   └── sanitize.ts         # HTML sanitizer for rich content
│   ├── types/
│   │   └── next-auth.d.ts      # NextAuth type extensions
│   └── middleware.ts           # Route protection (role-based)
├── supabase/
│   ├── schema.sql              # Base DB schema
│   └── migrations/
│       └── 001_data_foundation.sql  # Phase 1 data foundation migration
├── docs/
│   ├── BUSINESS_STRATEGY.md    # Business strategy (Japanese)
│   ├── BUSINESS_STRATEGY_EN.md # Business strategy (English)
│   ├── REQUIREMENTS.md         # Requirements definition (Japanese)
│   ├── REQUIREMENTS_EN.md      # Requirements definition (English)
│   ├── 00_CURRENT_ISSUES.md    # Current issues analysis
│   ├── 04_IMPLEMENTATION_PLAN.md  # Implementation plan + AI data items
│   └── HANDOVER.md             # This file
└── .env.local                  # Environment variables (not in git)
```

---

## 4. Architecture Patterns — What You Must Know

### 4.1 Three-Tier Data Pattern

```
Supabase (PostgreSQL)          →  src/lib/store.ts           →  React Components
DB tables: snake_case             CRUD operations                Hooks: camelCase
DbLead, DbBuilder, DbEvent       store.getLeads()              useProperties()
                                  store.addLead()               useEvents()
                                  dbLeadToLead() converters
```

**Why this matters:** Every DB operation goes through `store.ts` which converts between `snake_case` DB columns and `camelCase` frontend types. If you add a column, you must update three places:
1. `supabase.ts` — DB interface (`DbLead`, `DbBuilder`, etc.)
2. `store.ts` — Frontend interface + converter function
3. The relevant API route or component

### 4.2 Content Store (Client-Side State)

Most content (properties, articles, events, etc.) is currently stored as **TypeScript files** in `src/lib/`, not in Supabase. The `content-store.tsx` uses `useSyncExternalStore` to create global singleton stores:

```typescript
// src/lib/content-store.tsx
export const propertyStore = createStore<PropertyData>('properties', initialProperties);
export function useProperties() {
  return useSyncExternalStore(propertyStore.subscribe, propertyStore.get, () => initialProperties);
}
```

**Design intent:** This was Phase 0's approach. Phase 1+ should migrate content to Supabase for CMS persistence. The store pattern makes this migration straightforward — only the data source changes, not the hooks.

### 4.3 Event Tracking (Non-Blocking)

```
User action → useTrackEvent() → enqueueEvent() → [batch queue] → sendBeacon → /api/events/track → user_events table
```

- **Never blocks UI** — `enqueueEvent` is synchronous, returns immediately
- **Batches** — Flushes every 2 seconds or 5 events, whichever comes first
- **Survives page close** — `sendBeacon` fires on `visibilitychange: hidden`
- **Drop-in component** — `<TrackPageView>` can be added to any server component page

### 4.4 Anonymous-to-Authenticated User Flow

```
First visit → anonymous_id generated (UUID in localStorage)
  ↓
All events recorded with anonymous_id
  ↓
User registers / logs in
  ↓
POST /api/auth/merge { anonymous_id } → Updates user_events, favorites, chat_sessions
  ↓
From now on, events recorded with both user_id and anonymous_id
```

**Design intent:** This ensures no behavioral data is lost. A user who browses 20 properties, chats twice, and then signs up — all that history becomes linked to their account.

### 4.5 Chat Session Lifecycle

```
User opens ChatWidget → No session yet
  ↓
User sends first message → POST /api/chat creates chat_session + saves user message
  ↓
API returns X-Chat-Session-Id header → ChatWidget stores sessionId in state
  ↓
Subsequent messages → sent with sessionId → saved to chat_messages
  ↓
After streaming completes → assistant message saved in finally{} block (non-blocking)
  ↓
User closes widget → sessionId lost (new session on reopen)
```

**Design intent:** Sessions are per-widget-open, not per-page-visit. This keeps sessions focused. The `finally{}` block in the streaming loop saves the assistant message after `controller.close()`, so logging never affects response latency.

### 4.6 Lead Enrichment Flow

```
User browses pages → user_events accumulates
  ↓
User submits consultation form → POST /api/contact includes:
  - anonymous_id (from localStorage)
  - source_channel (from UTM or referer inference)
  - source_content_id (the page they were on)
  ↓
API queries user_events for last 5 views → attaches as recent_views JSONB
  ↓
Lead stored with full context: contact info + behavioral context
```

**Design intent:** Builders receive not just "someone inquired" but "someone who watched 3 hiraya videos, read 2 articles about ZEH, and chatted about budget concerns inquired."

---

## 5. Database Schema

### 5.1 Existing Tables (Phase 0)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | Authentication & roles | id, email, name, role (admin/builder/user), builder_id |
| `leads` | Inquiries & contacts | id, type, name, email, status, score, source_channel, recent_views, anonymous_id |
| `builders` | Builder profiles | id, name, area, specialties[], design_taste[], features[], suitable_for[] |
| `events` | Open houses & seminars | id, builder_name, title, date, capacity, reservations |

### 5.2 Phase 1 Tables (New — migration applied)

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `user_events` | Behavioral event log | id, anonymous_id, user_id, event_type, content_type, content_id, page_path, utm_*, metadata |
| `chat_sessions` | Chat conversation sessions | id, anonymous_id, user_id, title, message_count, source_page, extracted_tags[], conversation_summary |
| `chat_messages` | Individual chat messages | id, session_id, role (user/assistant/system), content |
| `favorites` | User favorites (extended) | id, user_id, anonymous_id, content_type, content_id |

### 5.3 Tables Planned (Phase 2+, not yet created)

| Table | Purpose |
|-------|---------|
| `user_profiles` | Family structure, budget, timing, preferences, consideration phase, temperature |
| `comparisons` | Comparison history (which properties/builders were compared) |
| `content_engagements` | Daily aggregated engagement metrics per content item |
| `builder_recommendations` | AI recommendation history with scores and reasons |

See `docs/REQUIREMENTS.md` Chapter 7 for full schema definitions.

---

## 6. API Routes

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET/POST | `/api/auth/[...nextauth]` | - | NextAuth handler |
| POST | `/api/auth/merge` | Required | Merge anonymous data to authenticated user |
| POST | `/api/contact` | No | Create lead with enrichment (source_channel, recent_views) |
| GET | `/api/leads` | Required | List leads (filter by builder or email) |
| POST | `/api/leads` | Required | Create lead manually |
| GET/PATCH | `/api/leads/[id]` | Required | Get/update single lead |
| GET | `/api/builders` | No | List active builders |
| GET/POST | `/api/events` | No/Required | List/create open house events |
| POST | `/api/events/track` | No | Receive behavioral events (batch) |
| GET | `/api/events/history` | No | Get browsing history for a user/anonymous_id |
| GET/POST/DELETE | `/api/favorites` | No | CRUD favorites (supports anonymous_id) |
| GET | `/api/stats` | Required | KPI statistics (admin or builder-specific) |
| POST | `/api/chat` | No | AI chat with GPT-4o (SSE streaming + log persistence) |

---

## 7. Authentication & Authorization

### 7.1 Roles

| Role | Access |
|------|--------|
| `anonymous` | Public pages, AI chat, form submissions, favorites (via anonymous_id) |
| `user` | + User dashboard, favorites (via user_id), browsing history |
| `builder` | + Builder dashboard, own leads |
| `admin` | Everything including CMS, admin panel |

### 7.2 Middleware Rules

```
/admin/*              → admin only (bypassed in dev mode)
/appadmin/*           → admin only (bypassed in dev mode)
/dashboard/builder/*  → admin only (Phase 1 restriction)
/dashboard/user/*     → admin only (Phase 1 restriction)
```

**Phase 2 plan:** Change dashboard routes to allow builder/user roles respectively.

---

## 8. Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=sk-...

# Optional (features degrade gracefully without these)
GOOGLE_CLIENT_ID=               # Google OAuth login
GOOGLE_CLIENT_SECRET=           # Google OAuth login
STRIPE_API_KEY=                 # Payment (Phase 3)
STRIPE_SECRET_KEY=              # Payment (Phase 3)
RESEND_API_KEY=                 # Email notifications
NEXT_PUBLIC_GA4_ID=             # Google Analytics
```

---

## 9. What Is Implemented vs. What Is Not

### ✅ Implemented (Phase 0 + Phase 1 data foundation)

| Category | What's Done |
|----------|-------------|
| Consumer site | 20 pages — property detail, articles, interviews, voices, seminars, news, magazine, events, builders, loan simulator, consultation |
| B2B site | 8 pages — landing, services, advertising, partner, articles, news, seminars, contact |
| CMS admin | 27 pages — full CRUD for all content types, page editors, SEO, media, workflow, audit, backup |
| Builder dashboard | KPI cards, lead list, event list, profile (read-mostly) |
| Auth | NextAuth with Google OAuth + email/password, JWT, 3 roles |
| AI chat | GPT-4o with SSE streaming, session management, message persistence |
| Event tracking | anonymous_id system, useTrackEvent hook, sendBeacon batch queue, /api/events/track |
| Lead enrichment | source_channel inference, recent_views from user_events, anonymous_id linkage |
| Favorites | API + FavoriteButton component on property detail |
| DB schema | user_events, chat_sessions, chat_messages, extended leads/builders/favorites |
| Email | Resend notification foundation (src/lib/email.ts) |
| Merge | /api/auth/merge for anonymous→authenticated data linkage |

### 📋 Not Yet Implemented (Phase 2+)

| Category | What's Needed | Priority |
|----------|---------------|----------|
| user_profiles table | Family structure, budget, timing, preferences | Phase 2 |
| Comparison feature | Compare properties/builders side-by-side | Phase 2 |
| AI chat: intent extraction | Auto-extract tags, intent, summary from conversations | Phase 2 |
| AI chat: builder recommendation | Recommend builders based on user profile + behavior | Phase 2 |
| Recommendation logic | Match user profiles to builder structured data | Phase 2 |
| Intent-enriched leads | Attach interest tags, concerns, phase, temperature to leads | Phase 2 |
| Lead auto-scoring | Calculate temperature from behavioral data | Phase 2 |
| Admin analytics dashboard | Chat analytics, behavior analytics, funnel analysis | Phase 2 |
| Builder reports | Monthly lead analysis, content effectiveness | Phase 2 |
| GA4 custom events | Send tracked events to GA4 via gtag() | Phase 2 |
| User dashboard (live data) | Replace hardcoded data in favorites/history pages | Phase 2 |
| CMS content → Supabase | Migrate static TS data files to Supabase tables | Phase 2 |
| Stripe integration | Builder subscription billing | Phase 3 |
| AI Housing Concierge | Full conversational decision support | Phase 3 |
| AI Sales Agent | Proposal suggestions for builders | Phase 3 |
| Pre-meeting summary | Auto-generate lead context summaries | Phase 3 |

---

## 10. How to Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Setup

1. Create a Supabase project
2. Run `supabase/schema.sql` in SQL Editor (creates base tables)
3. Run `supabase/migrations/001_data_foundation.sql` (creates Phase 1 tables)
4. Copy Supabase URL and keys to `.env.local`

---

## 11. Key Design Decisions & Why

| Decision | Why |
|----------|-----|
| Content stored in TS files, not Supabase | Phase 0 speed. CMS edit UI works via in-memory store. Migration to Supabase is Phase 2 |
| sendBeacon for event tracking | Non-blocking, survives page close, doesn't affect Core Web Vitals |
| anonymous_id in localStorage | Persists across sessions without auth. Enables pre-login behavior tracking |
| Chat session per widget open | Keeps conversations focused. Avoids mixing different topics in one session |
| Lead enrichment at submission time | recent_views queried on-the-fly, not pre-computed. Avoids stale data |
| RLS policies set to allow-all for service role | API routes use service role key which bypasses RLS anyway. RLS is for future direct-client access |
| Builder structured data in DB columns, not JSONB | Enables SQL queries for recommendation matching. JSONB would require GIN indexes and complex queries |
| Favorites support both user_id and anonymous_id | Enables favorites before login, merged after login. Critical for data capture |

---

## 12. Common Development Tasks

### Adding a new content type
1. Create data file in `src/lib/` (e.g., `new-content-data.ts`)
2. Add store + hook in `src/lib/content-store.tsx`
3. Create page in `src/app/(user)/`
4. Create CMS page in `src/app/appadmin/`
5. Add `<TrackPageView>` for event tracking

### Adding a new API endpoint
1. Create `src/app/api/{name}/route.ts`
2. Use `createServerClient()` for Supabase access
3. Use `getToken()` from next-auth/jwt if auth is needed
4. Follow existing patterns in `src/app/api/contact/route.ts`

### Adding a new tracked event
1. Add event type to `EventType` union in `src/lib/use-track-event.ts`
2. Call `trackEvent({ eventType: 'new_event', contentType: '...', contentId: '...' })` in component
3. Or use `<TrackPageView eventType="new_event" />` in server component pages

### Modifying the database schema
1. Create new migration file in `supabase/migrations/`
2. Update `DbXxx` interface in `src/lib/supabase.ts`
3. Update frontend interface + converter in `src/lib/store.ts`
4. Run migration in Supabase SQL Editor

---

## 13. Related Documents

| Document | Path | Description |
|----------|------|-------------|
| Business Strategy (JP) | `docs/BUSINESS_STRATEGY.md` | Full business strategy with market analysis, revenue model, roadmap |
| Business Strategy (EN) | `docs/BUSINESS_STRATEGY_EN.md` | English translation |
| Requirements (JP) | `docs/REQUIREMENTS.md` | Full requirements: data models, AI specs, event tracking, KPIs |
| Requirements (EN) | `docs/REQUIREMENTS_EN.md` | English translation |
| Current Issues | `docs/00_CURRENT_ISSUES.md` | Analysis of what was wrong with the v1 documents |
| Implementation Plan | `docs/04_IMPLEMENTATION_PLAN.md` | Prioritized implementation items + AI data collection matrix |
| DB Migration | `supabase/migrations/001_data_foundation.sql` | Phase 1 schema changes |
| This Handover | `docs/HANDOVER.md` | You are here |

---

## 14. Next Steps for the Engineering Team

**Immediate (This Sprint):**
1. Verify event tracking is working: open the site, browse pages, check `user_events` table in Supabase
2. Verify chat persistence: send a chat message, check `chat_sessions` and `chat_messages` tables
3. Verify favorites: click the heart button on a property, check `favorites` table
4. Set up GA4 and send custom events (extend `use-track-event.ts` to call `gtag()`)

**Next Sprint:**
1. Connect user dashboard pages (`/dashboard/user/favorites` and `/dashboard/user/history`) to live API data instead of hardcoded mock data
2. Add `<TrackPageView>` to remaining pages that don't have it yet (articles list, builders list, event list, top page)
3. Begin CMS structured data entry: populate `design_taste`, `features`, `suitable_for` for existing builders in the CMS

**Phase 2 Planning:**
1. Read `docs/REQUIREMENTS.md` Chapter 8 (AI/Chat/Recommendation Requirements) for the full AI feature roadmap
2. Read `docs/04_IMPLEMENTATION_PLAN.md` for the prioritized backlog with 44 items
3. Design the `user_profiles` table and progressive profiling UX

---

*This handover document was created on 2026-03-22. For questions about design intent, refer to the business strategy and requirements documents. The codebase is the source of truth for implementation details.*
