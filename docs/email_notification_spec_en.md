# Email Notification Specification
> Version 1.0 | 2026-03-22 | wazeka Inc.

---

## Chapter 1: Notification Types

The Payhome platform sends 7 types of email notifications. Each type is triggered by specific user or system actions.

| # | Email Type | Trigger | Recipient | Priority | Status |
|---|-----------|---------|-----------|----------|--------|
| 1 | Lead notification (to builder) | New lead referred to builder | Builder contact email | High | Implemented |
| 2 | Lead notification (to admin) | Any new lead created | Admin team | Medium | Implemented |
| 3 | Inquiry confirmation (to user) | Consultation form submitted | User email | High | Implemented |
| 4 | Event reservation confirmation (to user) | Event reservation submitted | User email | High | Implemented |
| 5 | Event reservation notification (to builder) | Event reservation for builder's event | Builder contact email | High | Implemented |
| 6 | Lead follow-up reminder | Lead unhandled for 24 hours | Assigned CS agent | Medium | Planned |
| 7 | Builder follow-up reminder | Referred lead unactioned for 7 days | Builder contact email | Medium | Planned |

---

## Chapter 2: Email Specifications

### 2.1 Lead Notification (to Builder)

| Attribute | Specification |
|-----------|--------------|
| Send Condition | Lead status changes to 'Referred' and builder is among selected builders |
| Recipient | Builder's registered contact email address |
| Timing | Immediately upon referral (async, non-blocking) |
| Subject Line | `[Payhome Lead] {user_name} ({area} / {budget} / {layout})` |
| Body Contents | Lead name, contact method preference, area, budget range, layout preference, message excerpt (first 200 chars), link to builder dashboard |
| Retry Logic | Up to 3 retries with exponential backoff (1min, 5min, 15min) |

### 2.2 Lead Notification (to Admin)

| Attribute | Specification |
|-----------|--------------|
| Send Condition | Any new lead record is created (all form types) |
| Recipient | Admin distribution list (configured via environment variable) |
| Timing | Immediately upon lead creation (async) |
| Subject Line | `[Payhome Admin] New Lead: {user_name} - {form_type}` |
| Body Contents | Lead ID, form type, user name, email, phone (if provided), area, budget, submission timestamp, link to admin dashboard |
| Retry Logic | Up to 3 retries with exponential backoff (1min, 5min, 15min) |

### 2.3 Inquiry Confirmation (to User)

| Attribute | Specification |
|-----------|--------------|
| Send Condition | User submits a consultation form (type: consultation only) |
| Recipient | User's submitted email address |
| Timing | Immediately after successful form submission |
| Subject Line | `[Payhome] Thank you for your consultation request` |
| Body Contents | Greeting with user name, summary of submitted details (area, budget, layout), expected response timeline (within 2 business days), support contact info, link to FAQ |
| Retry Logic | Up to 3 retries with exponential backoff (1min, 5min, 15min) |

### 2.4 Event Reservation Confirmation (to User)

| Attribute | Specification |
|-----------|--------------|
| Send Condition | User submits an event reservation form |
| Recipient | User's submitted email address |
| Timing | Immediately after successful reservation |
| Subject Line | `[Payhome] Event Reservation Confirmed: {event_name} on {date}` |
| Body Contents | Greeting with user name, event name, date and time, venue/online link, builder name, cancellation policy, support contact info |
| Retry Logic | Up to 3 retries with exponential backoff (1min, 5min, 15min) |

### 2.5 Event Reservation Notification (to Builder)

| Attribute | Specification |
|-----------|--------------|
| Send Condition | User reserves a spot at the builder's event |
| Recipient | Builder's registered contact email address |
| Timing | Immediately after successful reservation |
| Subject Line | `[Payhome Event] New Reservation: {event_name} - {user_name}` |
| Body Contents | Event name, date and time, user name, user contact info (email, phone if provided), number of attendees, current total reservations, link to builder dashboard |
| Retry Logic | Up to 3 retries with exponential backoff (1min, 5min, 15min) |

### 2.6 Lead Follow-up Reminder

| Attribute | Specification |
|-----------|--------------|
| Send Condition | Lead remains in 'New' status for 24+ hours without CS contact |
| Recipient | Assigned CS agent (or CS manager if unassigned) |
| Timing | Daily batch at 9:00 AM JST; checks all leads meeting the condition |
| Subject Line | `[Payhome Reminder] Unhandled Lead: {user_name} ({hours_elapsed}h elapsed)` |
| Body Contents | Lead ID, user name, form type, submission time, hours elapsed, temperature rank, link to lead detail in admin dashboard |
| Retry Logic | No retry (daily batch will re-send next day if still unhandled) |

### 2.7 Builder Follow-up Reminder

| Attribute | Specification |
|-----------|--------------|
| Send Condition | Lead remains in 'Referred' status for 7+ days without builder action |
| Recipient | Builder's registered contact email address |
| Timing | Triggered during daily batch at 9:00 AM JST |
| Subject Line | `[Payhome Reminder] Pending Lead Follow-up: {user_name} (referred {days_elapsed} days ago)` |
| Body Contents | Lead reference number, user name (partial), area, budget range, referral date, days elapsed, action required prompt, link to builder dashboard |
| Retry Logic | No retry (daily batch will re-send next day if still unactioned) |

---

## Chapter 3: Technical Specifications

### 3.1 Email Service Provider

| Attribute | Value |
|-----------|-------|
| Provider | Resend (resend.com) |
| Sender Address | `noreply@payhome.jp` |
| Sender Display Name | Payhome |
| API Integration | Resend SDK via server-side API routes |

### 3.2 Sending Architecture

All emails are sent asynchronously to avoid blocking user-facing operations. The sending flow is:

| Step | Description |
|------|------------|
| 1 | Trigger event occurs (form submission, status change, scheduled batch) |
| 2 | Email job is queued in the application layer |
| 3 | Resend API is called with the constructed email payload |
| 4 | Response status is logged (success/failure) |
| 5 | On failure, retry logic is applied per email type specification |

### 3.3 Error Handling

| Error Type | Handling |
|-----------|---------|
| API timeout | Retry with exponential backoff (max 3 attempts) |
| Invalid recipient | Log error; mark lead with 'email_invalid' flag; reduce lead score by 15 |
| Rate limit exceeded | Queue email for retry after cooldown period |
| Template rendering error | Log error with full context; send fallback plain-text version |
| Network failure | Retry with exponential backoff (max 3 attempts) |

### 3.4 Environment Variables

| Variable | Description | Example |
|----------|------------|---------|
| `RESEND_API_KEY` | API key for Resend service | `re_xxxxxxxxxxxx` |
| `EMAIL_FROM` | Sender email address | `noreply@payhome.jp` |
| `ADMIN_EMAIL` | Admin notification recipient(s) | `admin@payhome.jp` |
| `CS_MANAGER_EMAIL` | CS manager fallback email | `cs-manager@payhome.jp` |
| `BASE_URL` | Application base URL for email links | `https://payhome.jp` |
