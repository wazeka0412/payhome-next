# Lead Management Rules
> Version 2.0 | 2026-04-02 | wazeka Inc.
>
> **v2.0 changes (pivot from catalog-request-centric model):**
> - Catalog request score reduced from +15 to +5 (lowest priority)
> - Open house reservation score raised from +15 to +30 (primary revenue driver)
> - New: AI diagnosis completed = +15
> - New: Member signup = +10
> - New: Deal closed = +50 (tracking only; triggers 3% commission)

---

## Chapter 1: Lead Scoring

### 1.1 Score Definition

Each lead is assigned a numeric score ranging from 0 to 100. The initial score for all new leads is 50 points. The score dynamically adjusts based on user behavior and engagement patterns.

### 1.2 Scoring Addition Rules (v2.0 — v4.0 strategy aligned)

The following behaviors add points to a lead's score. **Note: In v4.0, catalog requests are de-prioritized because builder hearings confirmed they produce low-quality leads.**

| # | Behavior | Points | Notes |
|---|----------|--------|-------|
| 1 | **Deal closed (contract signed)** | **+50** | Tracking only; triggers 3% commission |
| 2 | **Open house reservation** | **+30** | **Primary revenue driver (5万円 per booking)** |
| 3 | Consultation form submission | +20 | High-intent direct contact |
| 4 | AI home-building diagnosis completed | +15 | **NEW v2.0: member funnel entry** |
| 5 | Member signup (email / OAuth / magic link) | +10 | **NEW v2.0: unlocks personalization** |
| 6 | Chat session completed (5+ messages) | +10 | Meaningful conversation |
| 7 | Phone number provided | +10 | High contact willingness |
| 8 | Favorites added (3+ properties) | +5 | Browsing with intent |
| 9 | Comparison list created | +5 | Active evaluation phase |
| 10 | Catalog request (deprecated in v4.0) | **+5** | **DOWNGRADED from +15. Low quality lead. Kept only for backward compatibility.** |
| 11 | Email link clicked | +5 | Responsive to outreach |
| 12 | LINE friend added | +5 | Channel engagement |
| 13 | Property detail page viewed (3+ unique) | +3 | Research behavior |
| 14 | Return visit within 7 days | +3 | Sustained interest |
| 15 | Blog article read (3+ articles) | +2 | Educational engagement |

### 1.3 Score Decay Rules

Scores decay over time to reflect diminishing engagement:

| Condition | Action | Details |
|-----------|--------|---------|
| 30 days of inactivity | Score reduced by 10 points | Applied once at the 30-day mark |
| 60 days of inactivity | Score reduced by 20 points | Applied once at the 60-day mark (cumulative with 30-day decay) |
| Email bounce detected | Score reduced by 15 points | Applied per bounce event; indicates invalid contact |

### 1.4 Temperature Ranks

Leads are classified into temperature ranks based on their current score:

| Rank | Score Range | Description | Recommended Action |
|------|------------|-------------|-------------------|
| Hot | 70 - 100 | High purchase intent; actively evaluating | Immediate follow-up within 2 hours; assign to senior CS |
| Warm | 40 - 69 | Moderate interest; exploring options | Standard follow-up within 24 hours; nurture via email |
| Cold | 0 - 39 | Low engagement; passive or inactive | Automated nurture sequence; re-engage via content |

### 1.5 Temperature vs. Score Relationship

Temperature rank is derived directly from the lead score and updates in real time as the score changes. Temperature transitions trigger the following:

| Transition | Trigger | System Action |
|------------|---------|---------------|
| Cold -> Warm | Score reaches 40 | Assign to CS queue; send internal notification |
| Warm -> Hot | Score reaches 70 | Priority alert to CS team; SLA timer starts (2 hours) |
| Hot -> Warm | Score drops below 70 | Log downgrade; adjust follow-up priority |
| Warm -> Cold | Score drops below 40 | Move to automated nurture; archive from active queue |

---

## Chapter 2: Lead Status Transitions

### 2.1 Status Definitions

| Status | Code | Description |
|--------|------|-------------|
| New | `new` | Lead just created; awaiting initial contact |
| In Progress | `in_progress` | CS has made initial contact; actively communicating |
| Referred | `referred` | Lead has been forwarded to one or more partner builders |
| Met | `met` | User has met with a builder (online or in-person) |
| Closed | `closed` | Deal completed; user signed a contract or purchased |
| Lost | `lost` | Lead disqualified, unresponsive, or chose a competitor |

### 2.2 Allowed Status Transitions

| From | To | Condition |
|------|----|-----------|
| New | In Progress | CS initiates first contact |
| New | Lost | Duplicate or spam detected |
| In Progress | Referred | CS selects and notifies builders |
| In Progress | Lost | User explicitly declines or unresponsive after SLA |
| Referred | Met | Builder confirms meeting occurred |
| Referred | Lost | All builders declined or user cancelled |
| Met | Closed | Contract signed or purchase confirmed |
| Met | Lost | User chose competitor or abandoned |
| Lost | In Progress | Re-engagement detected (admin approval required) |

### 2.3 Transition Permissions

| Role | Allowed Transitions |
|------|-------------------|
| CS (Customer Success) | New -> In Progress, In Progress -> Referred, In Progress -> Lost |
| Sales / Builder | Referred -> Met, Met -> Closed, Met -> Lost |
| Admin | All transitions including Lost -> In Progress (re-activation) |

### 2.4 SLA per Status

Service Level Agreements define the maximum time a lead may remain in each status before escalation:

| Status | SLA Duration | Escalation Action |
|--------|-------------|-------------------|
| New | 2 hours | Auto-assign to available CS; send alert to CS manager |
| In Progress | 24 hours | Reminder notification to assigned CS; escalate if unactioned |
| Referred | 7 days | Follow-up reminder to builder; notify CS if no builder response |
| Met | 30 days | Status review reminder; prompt CS to confirm outcome |

---

## Chapter 3: Multi-Builder Selection Rules

### 3.1 Simultaneous Notification

When a lead is referred, all selected builders receive the notification simultaneously. There is no sequential routing or priority ordering among builders.

### 3.2 No Ownership Model

No single builder has exclusive ownership of a lead. Multiple builders may respond to the same lead independently. The user retains full choice over which builder(s) to engage with.

### 3.3 Privacy Rules

The following privacy constraints apply to multi-builder referrals:

| Rule | Description |
|------|-------------|
| Builder isolation | Builders cannot see which other builders received the same lead |
| User contact info | Full contact details are shared only after user consent |
| Lead source | Builders see 'Payhome' as the source; internal scoring is not disclosed |
| Communication history | Chat transcripts and internal notes are not shared with builders |

---

## Chapter 4: Duplicate Lead Handling

### 4.1 Duplicate Detection Criteria

A lead is considered a duplicate when **ALL** of the following conditions are met:

| Condition | Details |
|-----------|---------|
| Same email address | Case-insensitive match on the email field |
| Within 30 days | The new submission occurs within 30 calendar days of the existing lead |
| Same inquiry type | Both leads share the same form type (consultation, catalog, event, B2B) |

### 4.2 Handling Procedure

When a duplicate is detected:

| Step | Action |
|------|--------|
| 1 | Create a new lead record (do not merge or overwrite the original) |
| 2 | Add a system note: 'Duplicate of Lead #{original_id} detected on {date}' |
| 3 | Link the new record to the original via the `duplicate_of_lead_id` field |
| 4 | Notify the assigned CS agent of the duplicate for manual review |
| 5 | The new lead inherits the original lead's temperature rank but starts with a fresh score of 50 |
