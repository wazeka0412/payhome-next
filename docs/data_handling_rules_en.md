# Data Handling Rules
> Version 1.0 | 2026-03-22 | wazeka Inc.

---

## Chapter 1: Event Data Handling

### 1.1 Event Types

The platform tracks 17 event types. Each event type has a designated PII flag indicating whether the event payload may contain personally identifiable information.

| # | Event Type | Category | PII Flag | Description |
|---|-----------|----------|----------|-------------|
| 1 | page_view | Navigation | No | User views a page |
| 2 | property_view | Engagement | No | User views a property detail page |
| 3 | builder_view | Engagement | No | User views a builder profile page |
| 4 | search_performed | Navigation | No | User performs a property search |
| 5 | filter_applied | Navigation | No | User applies search filters |
| 6 | favorite_added | Engagement | No | User adds a property to favorites |
| 7 | favorite_removed | Engagement | No | User removes a property from favorites |
| 8 | comparison_created | Engagement | No | User creates a comparison list |
| 9 | comparison_updated | Engagement | No | User modifies a comparison list |
| 10 | chat_started | Chat | No | User opens chat widget |
| 11 | chat_message_sent | Chat | Yes | User sends a chat message (may contain PII) |
| 12 | chat_completed | Chat | No | Chat session reaches 5+ messages |
| 13 | form_submission | Conversion | Yes | User submits any form |
| 14 | cta_clicked | Engagement | No | User clicks a call-to-action element |
| 15 | email_opened | Email | No | User opens a marketing/notification email |
| 16 | email_link_clicked | Email | No | User clicks a link within an email |
| 17 | user_signup | Account | Yes | User creates an account |

### 1.2 PII Restrictions in Event Data

The following PII fields must NEVER be included in event metadata or properties:

| Prohibited Field | Reason | Alternative |
|-----------------|--------|-------------|
| Email address | Direct PII identifier | Use hashed user ID |
| Phone number | Direct PII identifier | Use hashed user ID |
| Full name | Direct PII identifier | Use anonymous_id or user_id |
| Physical address | Direct PII identifier | Use area/region code only |
| IP address | Indirect PII identifier | Use anonymized/truncated IP or omit |

### 1.3 Event Validation Rules

| Rule | Requirement | Action on Violation |
|------|------------|-------------------|
| anonymous_id required | Every event must include a valid anonymous_id | Reject event; log validation error |
| Metadata size limit | Event metadata must not exceed 10 KB | Truncate metadata; log warning |
| Deduplication window | Events with identical anonymous_id + event_type + timestamp within 1 second are duplicates | Discard duplicate; increment dedup counter |
| Timestamp required | Every event must include a valid ISO 8601 timestamp | Use server timestamp if missing; log warning |
| Event type validation | event_type must match one of the 17 defined types | Reject event; log unknown type error |

### 1.4 Rate Limits

| Limit | Value | Action on Exceed |
|-------|-------|-----------------|
| Events per day per user | 1,000 | Discard excess events; flag user for review |
| Events per batch request | 50 | Reject batch; return 413 error |
| Event ingestion rate (global) | 10,000 events/minute | Queue overflow; apply backpressure |

---

## Chapter 2: Data Retention

### 2.1 Retention Periods by Table

| Table | Retention Period | Deletion Method | Notes |
|-------|-----------------|----------------|-------|
| user_events | 12 months | Hard delete (batch job, monthly) | Anonymized aggregates retained indefinitely |
| chat_sessions | 24 months | Hard delete (batch job, monthly) | Session metadata retained; messages deleted |
| chat_messages | 12 months | Hard delete (batch job, monthly) | Linked to chat_sessions |
| leads | Indefinite | N/A (permanent record) | Anonymized on user deletion request |
| favorites | Indefinite | Deleted with user account | Tied to user lifecycle |
| users | Indefinite | Anonymized on deletion request | See Section 2.2 |
| builder_profiles | Indefinite | Archived on contract termination | Not deleted; marked inactive |

### 2.2 User Deletion Request Procedure

| Step | Action | Timeline |
|------|--------|----------|
| 1 | User submits deletion request via settings page or email to support | Day 0 |
| 2 | CS confirms request and verifies user identity | Within 2 business days |
| 3 | Account is deactivated (soft delete); user can no longer log in | Within 3 business days |
| 4 | All PII is anonymized: name -> 'Deleted User', email -> hash, phone -> null | Within 30 calendar days |
| 5 | Lead records are anonymized (name replaced, email hashed) but retained for business analytics | Within 30 calendar days |
| 6 | Event data with PII flags is purged | Within 30 calendar days |
| 7 | Confirmation email sent to user's original email address (final communication) | Upon completion |

---

## Chapter 3: Anonymous-to-Authenticated Merge

### 3.1 Merge Trigger

The merge process is triggered when a user logs in (authenticates) after previously browsing the platform anonymously. The system links the anonymous browsing history to the authenticated user profile.

### 3.2 Merge Targets

| Data Type | Merge Behavior | Conflict Resolution |
|-----------|---------------|-------------------|
| user_events | All events with matching anonymous_id are updated to include the authenticated user_id | No conflicts possible (additive) |
| favorites | Anonymous favorites are merged into authenticated favorites | Deduplication: if same property exists in both, keep authenticated version with earliest timestamp |
| chat_sessions | Anonymous chat sessions are linked to the authenticated user | No conflicts possible (additive) |

### 3.3 Post-Merge Handling

| Rule | Details |
|------|---------|
| Retain anonymous_id | The anonymous_id is preserved in all records even after merge for analytics continuity |
| One-time operation | Merge executes only once per anonymous_id + user_id pair; subsequent logins do not re-trigger |
| Audit trail | A merge event is logged with timestamp, anonymous_id, user_id, and count of merged records |

### 3.4 Multi-Device Handling

The merge applies to the current device only. Each device has its own anonymous_id. When a user logs in on a new device:

| Scenario | Behavior |
|----------|----------|
| User logs in on Device A | Device A's anonymous_id is merged with user_id |
| User logs in on Device B | Device B's anonymous_id is merged with user_id (separate merge operation) |
| User logs in on Device A again | No merge (already merged); session continues with authenticated user_id |

---

## Chapter 4: Favorites & Comparison Limits

### 4.1 Favorites Limits

| Parameter | Value | Behavior on Limit |
|-----------|-------|------------------|
| Maximum favorites per user | 100 | Display message: 'You have reached the maximum number of favorites. Please remove some to add new ones.' |
| Favorite data stored | property_id, user_id, created_at | Minimal storage footprint |
| Anonymous favorites | Stored via anonymous_id; merged on login | See Chapter 3 |

### 4.2 Comparison Limits

| Parameter | Value | Behavior on Limit |
|-----------|-------|------------------|
| Maximum items per comparison list | 5 | Prevent adding; show message to remove an item first |
| Maximum comparison lists per user | 10 | Prevent creating new list; prompt to delete an existing list |
| Comparison data stored | list_id, user_id, property_ids[], name, created_at, updated_at | Standard relational storage |

### 4.3 Lead Score Impact

| Behavior | Score Impact | Condition |
|----------|-------------|-----------|
| 3+ favorites added | +5 points | One-time bonus when user reaches 3 favorites |
| Comparison list created | +5 points | One-time bonus on first comparison list creation |
| Favorites removed (all) | No score change | Score additions are not reversed when favorites are removed |

---

## Chapter 5: Privacy Policy

### 5.1 PII Definition

For the purposes of this document, Personally Identifiable Information (PII) is defined as any data that can be used to identify, contact, or locate a specific individual, either directly or in combination with other data.

| Category | Examples | Classification |
|----------|----------|---------------|
| Direct identifiers | Full name, email address, phone number, physical address | PII - Restricted |
| Indirect identifiers | IP address, device fingerprint, browser user agent | PII - Sensitive |
| Behavioral data | Page views, search queries, click patterns, favorites | Non-PII |
| Derived data | Lead score, temperature rank, segment classification | Non-PII |

### 5.2 Storage Locations

| Data Type | Storage | Encryption |
|-----------|---------|-----------|
| User PII (name, email, phone) | Supabase PostgreSQL (users table) | Encrypted at rest (AES-256) |
| Lead PII | Supabase PostgreSQL (leads table) | Encrypted at rest (AES-256) |
| Chat messages (may contain PII) | Supabase PostgreSQL (chat_messages table) | Encrypted at rest (AES-256) |
| Event data (non-PII) | Supabase PostgreSQL (user_events table) | Encrypted at rest (AES-256) |
| Analytics aggregates | Supabase PostgreSQL (analytics tables) | Encrypted at rest (AES-256) |
| Session data | Server-side cookies / JWT tokens | Signed and encrypted |

### 5.3 PII and Behavioral Data Separation

PII and behavioral data must be stored and processed separately:

| Principle | Implementation |
|-----------|---------------|
| Separate tables | PII is stored in dedicated tables (users, leads); behavioral data in separate tables (user_events, favorites) |
| Join on ID only | Tables are linked via user_id or anonymous_id; PII fields are never duplicated in behavioral tables |
| Access control | PII tables have stricter Row Level Security (RLS) policies than behavioral tables |
| Export separation | Data exports for analytics exclude PII columns; PII exports require admin approval |

### 5.4 Builder Data Sharing Rules

Data shared with partner builders is governed by strict rules to protect user privacy:

| Data Category | Shared with Builder? | Conditions |
|--------------|---------------------|------------|
| User PII (name, email, phone) | Yes, after referral only | Shared only when lead status is 'Referred' and user has consented |
| Anonymized behavioral data | Yes | Aggregate trends only (e.g., '15 users viewed your profile this week') |
| Individual browsing history | No | Never shared with builders |
| Chat transcripts | No | Never shared with builders |
| Lead score / temperature | No | Internal metric; not disclosed to builders |
| Comparison data | No | User's comparison lists are private |
| Other builders' info | No | Builders cannot see which other builders a user is evaluating |
