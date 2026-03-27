# Current Issues Analysis

**Date:** 2026-03-22

This document analyzes the problems found in the v1 business strategy and requirements documents, which led to the v2/v3 rewrites. Understanding these issues helps engineers grasp *why* the platform architecture prioritizes data collection over feature expansion.

---

## 1. Business Strategy Issues

### 1.1 Business definition stuck at "lead-referral media"
- Executive summary ended at "matching with builders" and "providing marketing support"
- No mention of supporting the consumer's decision-making process
- Value to builders was defined as "acquiring leads through YouTube reach" — pure referral
- No future vision for data accumulation and its uses

### 1.2 Competitive advantages were superficial
- Only quantitative metrics: "42,841 YouTube subscribers" and "257 videos"
- No deep analysis of the hiraya-specialized market positioning
- No mention of data accumulation as a competitive moat
- Competitor comparison limited to 3 entries (SUUMO / HOME'S / Housing YouTubers) — too shallow (Note: fixed in v2.0. Additionally, Japan's only hiraya-specialized portal, e-Hiraya net (Lib Work), was closed on January 31, 2026. There is now zero hiraya-specialized platforms in Japan. Payhome will be the first and only)

### 1.3 Revenue model had zero data/AI future revenue
- All 10 revenue items were existing "production services" / "listing fees" / "referral" types
- AI concierge fees, intent data analysis, sales support SaaS — all absent
- Low recurring revenue ratio, making the model hard to scale

### 1.4 Roadmap listed phase names without an evolution story
- Phase 0-3 were listed but "what connects to what" was unclear
- No connection between "data accumulation → AI evolution → SaaS transformation"
- AI chatbot appeared suddenly in Phase 3 with no discussion of the data foundation required to get there

### 1.5 No Data Strategy / AI Strategy chapter existed
- Technology strategy chapter was just a "tech stack list"
- Completely missing: what data to collect, what to use it for, how to evolve AI

---

## 2. Requirements Document Issues

### 2.1 Biased toward feature/screen listing
- 62-screen inventory was thorough, but "what data to capture" perspective was absent
- No screens were annotated with "events to track" or "data to accumulate"
- Property detail page requirements had no mention of "record view to user_events"

### 2.2 Data model limited to transaction processing
- Only 4 tables: users / leads / builders / events
- No user behavioral history (user_events)
- No chat session/message persistence structure
- No user profile concept (family structure, budget, consideration phase)
- No favorites or comparison history tables
- No content engagement aggregation table

### 2.3 Lead defined as nothing more than form submission data
- Missing: source channel, recent browsing history, chat summary, interest tags, concerns
- Missing: recommendation reason, consideration phase, engagement temperature
- Lead captured only "the moment of form submission" — all behavioral context leading to it was lost

### 2.4 AI chat requirements were a single vague line item
- Just "OpenAI GPT-4o / SSE / 1,000 tokens" implementation spec
- No functional decomposition: FAQ, profiling, recommendation, diagnosis, summary, lead-conversion judgment
- No MVP / next-phase / future staging
- No mention of conversation log persistence or utilization

### 2.5 User dashboard was deprioritized (📋 = backlog)
- Favorites, comparison, browsing history were postponed to Phase 2+
- These are the core of data accumulation and the training data source for AI concierge
- Postponing them means data doesn't accumulate while time passes

### 2.6 CMS requirements stopped at "content entry box"
- Builder/property/article registration fields had no AI-recommendation structured data (design taste, performance, suitable customer profiles)
- No design connection between "data registered in CMS" and "material for AI recommendations"

### 2.7 No event tracking / analytics requirements existed
- GA4 integration was 🔧 (partial), but no custom event definitions
- Undefined: which events fire on which pages, what gets measured
- KPIs were only platform-level coarse metrics — no funnel-specific or AI-specific KPIs

### 2.8 Development priority favored feature expansion over data foundation
- Phase 1 was "email notifications" + "CMS persistence" + "KPI reports"
- User event tracking, chat log persistence, and event measurement should have come first
- Risk of "features work but no data accumulates" persisting for too long

---

## 3. Missing Elements for AI Evolution

| Missing Element | Impact |
|----------------|--------|
| Unified user identifier design | Cannot connect anonymous → authenticated user data |
| Behavioral event definition & capture | No data exists for AI to learn from |
| Structured chat log persistence | Cannot extract intent or generate summaries from conversations |
| Progressive user profile building | No foundation for personalization |
| Structured content tags | No matching material for AI recommendations |
| Lead-to-behavior data linkage | Cannot answer "why did this person inquire?" |
| Favorites & comparison storage | Cannot visualize user's consideration status |
| Intent estimation logic design | Cannot auto-determine engagement temperature or consideration phase |

---

## 4. Priority Misalignment

### Original priorities (problematic)
```
Phase 0: Content publishing + CMS + Lead capture
Phase 1: Email notifications + CMS persistence + KPI reports  ← Feature-focused
Phase 2: RBAC + User DB + Stripe                              ← Data accumulation too late
Phase 3: Advanced AI chatbot                                   ← Cannot advance without data
```

### Corrected priorities
```
Phase 0: Content publishing + CMS + Lead capture (✅ Complete)
Phase 1: User identification + Event tracking + Chat logs + Lead enrichment  ← Data foundation
Phase 2: Favorites/comparison/history + CMS structured data + AI recommendation v1  ← Data activation
Phase 3: AI Concierge advancement + Builder reports + SaaS  ← AI full operation
```

**Core problem:** The original documents were optimized for "building working features," not for "accumulating data for future AI utilization." This has been corrected in the v2/v3 rewrites and the Phase 1 implementation.

---

*These issues informed the rewrite of the business strategy (v2.0) and requirements definition (v3.0).*
