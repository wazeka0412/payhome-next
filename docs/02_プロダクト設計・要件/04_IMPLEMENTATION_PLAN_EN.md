# Implementation Backlog & AI Data Collection Matrix

**Date:** 2026-03-22

---

## 1. Immediate — Phase 1 (Data Foundation)

Items marked ✅ are already implemented. Remaining items are ready for the next sprint.

| # | Item | Priority | Effort | Dependencies | Status |
|---|------|----------|--------|-------------|--------|
| 1 | anonymous_id generation + localStorage persistence | S | Small | None | ✅ Done |
| 2 | user_events table creation (Supabase) | S | Small | None | ✅ Done |
| 3 | Event tracking API (POST /api/events/track) | S | Medium | #2 | ✅ Done |
| 4 | Frontend event tracking hook (useTrackEvent) | S | Medium | #3 | ✅ Done |
| 5 | Embed tracking on key pages (page_view/video_view/article_read) | S | Medium | #4 | ✅ Done (6 pages) |
| 6 | chat_sessions / chat_messages table creation | S | Small | None | ✅ Done |
| 7 | Extend AI chat API with log persistence | S | Medium | #6 | ✅ Done |
| 8 | Add source_channel / source_content_id to leads | S | Medium | #4 | ✅ Done |
| 9 | Add recent_views (last 5 viewed items) to leads | S | Medium | #2, #8 | ✅ Done |
| 10 | favorites table creation | A | Small | None | ✅ Done |
| 11 | Favorites API (GET/POST/DELETE /api/favorites) | A | Medium | #10 | ✅ Done |
| 12 | Add favorite button to property detail / builder pages | A | Medium | #11 | ✅ Done (property) |
| 13 | Browsing history page (/dashboard/user/history) with live data | A | Medium | #2 | API ready, page uses mock data |
| 14 | GA4 custom event sending design + implementation | A | Medium | None | Not started |
| 15 | Add structured columns to builders table (price_range/design_taste/features etc.) | A | Medium | None | ✅ Done |
| 16 | Add structured data input form to CMS builder edit page | A | Medium | #15 | Not started |
| 17 | Resend lead notification email implementation | B | Medium | None | ✅ Foundation done |
| 18 | anonymous_id → user_id merge on registration/login | A | Large | #1, #2 | ✅ Done (/api/auth/merge) |

---

## 2. Next Phase — Phase 2 (AI Activation)

| # | Item | Priority | Dependencies |
|---|------|----------|-------------|
| 19 | user_profiles table creation | A | None |
| 20 | Profile input UI (progressive profiling) | B | #19 |
| 21 | comparisons table creation | B | None |
| 22 | Comparison list feature (API + UI) | B | #21 |
| 23 | content_engagements table (daily aggregation batch) | B | #2 |
| 24 | AI chat: auto-generate conversation_summary on session end | A | #6, #7 |
| 25 | AI chat: extract extracted_tags / inferred_intent | A | #6, #7 |
| 26 | AI chat: user type diagnosis feature | B | #19, #25 |
| 27 | AI chat: builder recommendation feature | A | #15, #25 |
| 28 | builder_recommendations table + recommendation logic | A | #15, #19 |
| 29 | Intent-enriched leads (chat_summary/interest_tags/concerns) | A | #24, #25 |
| 30 | Lead auto-scoring based on behavioral data | B | #2, #9 |
| 31 | Admin panel: chat analytics dashboard | B | #6 |
| 32 | Admin panel: behavior analytics dashboard | B | #2, #23 |
| 33 | Admin panel: extended lead detail (behavior history + chat summary display) | A | #9, #24 |
| 34 | Builder monthly report auto-generation | B | #23 |
| 35 | LINE Messaging API integration | C | None |

---

## 3. Future — Phase 3+

| # | Item | Dependencies |
|---|------|-------------|
| 36 | AI Housing Concierge (full feature) | All of Phase 2 |
| 37 | AI Sales Agent (builder-facing proposal support) | All of Phase 2 |
| 38 | Pre-meeting summary auto-generation | #24, #29 |
| 39 | Next best action estimation | #28, #30 |
| 40 | Conversion prediction model | Sufficient data accumulation |
| 41 | Stripe payment integration (subscriptions) | After partner count growth |
| 42 | External CRM integration | After builder CRM usage survey |
| 43 | Area expansion (all Kyushu → Chugoku/Shikoku) | After Kyushu data accumulation |
| 44 | Housing market data analysis service | Sufficient data accumulation |

---

## AI Housing Concierge — Data Collection Item Matrix

This matrix defines **every data point** needed to evolve the platform into an AI Housing Concierge. Each item specifies what to collect, when, where to store it, what it's used for, and whether it's needed in the MVP.

### Phase 1 Items (MVP — Required Now)

| # | Data Item | Description | Collection Trigger | Storage | Usage | MVP |
|---|-----------|-------------|-------------------|---------|-------|-----|
| 1 | anonymous_id | Anonymous user identifier | First visit | localStorage + user_events | Track anonymous behavior, link on registration | ✅ |
| 2 | page_view | Page view event | Page display | user_events + GA4 | Browsing trend analysis, interest estimation | ✅ |
| 3 | video_view | Video view start | YouTube playback start | user_events + GA4 | Video content effectiveness measurement | ✅ |
| 4 | article_read | Article read completion | Scroll depth threshold | user_events + GA4 | Article effectiveness, interest analysis | ✅ |
| 5 | builder_detail_view | Builder detail page view | Builder detail page load | user_events + GA4 | Identify builders of interest | ✅ |
| 6 | event_detail_view | Event detail page view | Event detail page load | user_events + GA4 | Event effectiveness measurement | ✅ |
| 7 | favorite_add | Favorite added | Favorite button click | favorites + user_events | Explicit interest signal, recommendation input | ✅ |
| 8 | chat_message | Chat message content | Message send/receive | chat_messages | Intent extraction, summary generation, training data | ✅ |
| 9 | chat_session_start | Chat session started | Chat widget first message | chat_sessions + GA4 | AI usage rate measurement | ✅ |
| 10 | chat_session_end | Chat session ended | Conversation end (exit or explicit) | chat_sessions | Completion rate, summary trigger | ✅ |
| 11 | source_channel | Inbound channel | Lead creation | leads.source_channel | Channel-specific CV rate analysis | ✅ |
| 12 | source_content_id | Source content | Lead creation | leads.source_content_id | Content → CV contribution analysis | ✅ |
| 13 | recent_views | Recent browsing history | Lead creation | leads.recent_views (JSONB) | Lead context understanding, builder-facing data | ✅ |
| 14 | referrer | HTTP referrer | Page display | user_events.referrer | Inbound path analysis | ✅ |
| 15 | device_type | Device type | Page display | user_events.device_type | Device-specific analysis | ✅ |
| 16 | simulator_use | Loan simulator usage | Calculator execution | user_events + GA4 | Seriousness estimation | ✅ |
| 17 | tel_click | Phone number click | Phone number tap | GA4 | Offline CV measurement | ✅ |
| 18 | line_click | LINE friend add click | LINE button click | GA4 | LINE-channel CV measurement | ✅ |

### Phase 2 Items (AI Activation)

| # | Data Item | Description | Collection Trigger | Storage | Usage | MVP |
|---|-----------|-------------|-------------------|---------|-------|-----|
| 19 | comparison_add | Comparison list addition | Compare button click | comparisons + user_events | Comparison behavior analysis | ❌ |
| 20 | family_structure | Family structure | Profile input or chat inference | user_profiles | Personalization, recommendations | ❌ |
| 21 | age_range | Age range | Profile input or chat inference | user_profiles | Segment analysis | ❌ |
| 22 | planned_timing | Planned construction timing | Profile input or chat inference | user_profiles | Temperature estimation, priority judgment | ❌ |
| 23 | has_land | Land ownership | Profile input | user_profiles | Builder recommendation filter | ❌ |
| 24 | preferred_area | Preferred area | Profile input or form | user_profiles | Area matching | ❌ |
| 25 | budget_range | Budget range | Profile input or chat inference | user_profiles | Builder recommendation filter | ❌ |
| 26 | design_orientation | Design preference | Inferred from browsing patterns | user_profiles | Recommendation logic input | ❌ |
| 27 | performance_orientation | Performance preference | Inferred from browsing patterns | user_profiles | Recommendation logic input | ❌ |
| 28 | lifestyle_priorities | Lifestyle priorities | Profile input or chat inference | user_profiles | Recommendation logic input | ❌ |
| 29 | consideration_phase | Consideration phase | Auto-estimated from behavior patterns | user_profiles | Funnel analysis, next best action | ❌ |
| 30 | temperature | Engagement temperature score | Auto-calculated from behavioral scoring | user_profiles / leads | Lead priority, auto-scoring | ❌ |
| 31 | inferred_intent | Inferred intent | AI analysis at chat session end | chat_sessions | Lead quality improvement | ❌ |
| 32 | extracted_tags | Extracted tags | AI analysis at chat session end | chat_sessions | Intent structuring | ❌ |
| 33 | conversation_summary | Conversation summary | AI generation at chat session end | chat_sessions | Pre-meeting summary, lead quality | ❌ |
| 34 | recommended_action | Recommended action | Chat analysis | chat_sessions | Next best action suggestion | ❌ |
| 35 | lead_conversion | Lead conversion flag | Chat → form transition | chat_sessions | AI → CV rate measurement | ❌ |
| 36 | interest_tags | Interest tags | Combined inference from browsing + chat | leads | Lead quality improvement | ❌ |
| 37 | concerns | Concerns / anxieties | Extracted from chat | leads | Meeting preparation support | ❌ |
| 38 | recommendation_reason | Recommendation reason | Recommendation logic output | builder_recommendations | Transparency, trust | ❌ |

### Phase 3 Items (AI Full Operation)

| # | Data Item | Description | Collection Trigger | Storage | Usage | MVP |
|---|-----------|-------------|-------------------|---------|-------|-----|
| 39 | next_best_action | Next action estimation | Behavior pattern + conversion data analysis | chat_sessions / user_profiles | Advanced AI proposals | ❌ |
| 40 | conversion_reason | Conversion reason | Context analysis at form submission | leads | Conversion factor analysis | ❌ |

---

## Summary

**Phase 1 (MVP / Data Foundation):** Items #1-18 (18 items) — **15 already implemented**
**Phase 2 (AI Activation):** Items #19-38 (20 items)
**Phase 3 (AI Full Operation):** Items #39-40 (2 items)

The 18 Phase 1 items can be implemented without significantly changing the user experience — they are backend event sending and DB storage. **These determine the success or failure of AI utilization 6 months from now.**

The remaining Phase 1 items not yet implemented:
- #13: Connect browsing history page to live API data (API exists, page still uses mock data)
- #14: GA4 custom event integration (send tracked events to gtag())
- #16: CMS builder edit form with structured data input fields

---

*This document is based on the payhome-next codebase (2026-03-22) implementation state and future vision.*
