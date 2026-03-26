# Form Specification
> Version 1.0 | 2026-03-22 | wazeka Inc.

---

## Chapter 1: Common Rules

### 1.1 Validation Rules

| Field | Type | Required | Min | Max | Validation Rule |
|-------|------|----------|-----|-----|-----------------|
| name | text | Yes | 2 | 50 | Trim whitespace; reject if empty after trim |
| email | email | Yes | - | 254 | RFC 5322 compliant; case-insensitive |
| phone | tel | No | 10 | 13 | Digits only after stripping hyphens/spaces; Japanese format |
| area | select | Yes | - | - | Must match predefined area list |
| budget | select | Yes | - | - | Must match predefined budget range list |
| layout | select | No | - | - | Must match predefined layout list |
| message | textarea | No | - | 2000 | Strip HTML tags; trim whitespace |
| company_name | text | Conditional | 1 | 100 | Required for B2B contact form only |
| event_date | date | Conditional | - | - | Required for event reservation; must be future date |

### 1.2 Select Options

**Area Options:**

| Value | Display Label |
|-------|---------------|
| tokyo | Tokyo |
| kanagawa | Kanagawa |
| saitama | Saitama |
| chiba | Chiba |
| osaka | Osaka |
| hyogo | Hyogo |
| kyoto | Kyoto |
| aichi | Aichi |
| fukuoka | Fukuoka |
| other | Other |

**Budget Range Options:**

| Value | Display Label |
|-------|---------------|
| under_2000 | Under 20 million yen |
| 2000_3000 | 20 - 30 million yen |
| 3000_4000 | 30 - 40 million yen |
| 4000_5000 | 40 - 50 million yen |
| over_5000 | Over 50 million yen |
| undecided | Not yet decided |

**Layout Options:**

| Value | Display Label |
|-------|---------------|
| 2ldk | 2LDK |
| 3ldk | 3LDK |
| 4ldk | 4LDK |
| 5ldk_plus | 5LDK or larger |
| undecided | Not yet decided |

### 1.3 Security Measures

| Threat | Countermeasure |
|--------|----------------|
| XSS (Cross-Site Scripting) | All user input is sanitized and escaped before rendering; Content Security Policy headers applied |
| SQL Injection | Parameterized queries via Supabase client; no raw SQL concatenation |
| CSRF (Cross-Site Request Forgery) | CSRF tokens validated on all form submissions; SameSite cookie attribute set to 'Strict' |

---

## Chapter 2: Consultation Form

### 2.1 Field Specifications

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | Yes | Full name (2-50 characters) |
| email | email | Yes | RFC 5322 compliant |
| phone | tel | No | 10-13 digits; Japanese format |
| area | select | Yes | Predefined area list |
| budget | select | Yes | Predefined budget range list |
| layout | select | No | Predefined layout list |
| message | textarea | No | Free-text up to 2000 characters |
| selected_builders | multi-select | No | Pre-populated if user selects from builder list |

### 2.2 Post-Submission Flow

| Step | Action | Details |
|------|--------|---------|
| 1 | Create lead record | Insert into leads table with type='consultation', status='new', score=50 |
| 2 | Send confirmation email | Email type #3 (inquiry confirmation) sent to user |
| 3 | Notify admin | Email type #2 (lead notification to admin) sent |
| 4 | Notify builder(s) | If builders selected: email type #1 sent to each; status set to 'referred' |
| 5 | Track analytics event | Fire 'form_submission' event with form_type='consultation' |

---

## Chapter 3: Catalog Request Form

### 3.1 Field Specifications

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | Yes | Full name (2-50 characters) |
| email | email | Yes | RFC 5322 compliant |
| phone | tel | No | 10-13 digits |
| area | select | Yes | Predefined area list |
| budget | select | No | Predefined budget range list |
| selected_builders | multi-select | Yes | At least 1 builder must be selected |

### 3.2 Post-Submission Flow

| Step | Action | Details |
|------|--------|---------|
| 1 | Create lead record | Insert into leads table with type='catalog', status='new', score=50 |
| 2 | Notify admin | Email type #2 sent to admin team |
| 3 | Notify builder(s) | Email type #1 sent to each selected builder; status set to 'referred' |
| 4 | Track analytics event | Fire 'form_submission' event with form_type='catalog' |

---

## Chapter 4: Event Reservation Form

### 4.1 Field Specifications

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | text | Yes | Full name (2-50 characters) |
| email | email | Yes | RFC 5322 compliant |
| phone | tel | No | 10-13 digits |
| event_id | hidden | Yes | Pre-populated from event detail page |
| event_date | date | Yes | Must be a future date; pre-populated from event |
| attendees | number | No | Default: 1; max: 10 |
| message | textarea | No | Free-text up to 500 characters |

### 4.2 Post-Submission Flow

| Step | Action | Details |
|------|--------|---------|
| 1 | Create lead record | Insert into leads table with type='event', status='new', score=50 |
| 2 | Update reservation count | Increment the event's current_reservations count |
| 3 | Send confirmation to user | Email type #4 (event reservation confirmation) sent |
| 4 | Notify builder | Email type #5 (event reservation notification) sent to hosting builder |
| 5 | Notify admin | Email type #2 sent to admin team |
| 6 | Track analytics event | Fire 'form_submission' event with form_type='event_reservation' |

---

## Chapter 5: B2B Contact Form

### 5.1 Field Specifications

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| company_name | text | Yes | Company name (1-100 characters) |
| name | text | Yes | Contact person name (2-50 characters) |
| email | email | Yes | RFC 5322 compliant; business email preferred |
| phone | tel | Yes | 10-13 digits |
| message | textarea | Yes | Minimum 20 characters; max 2000 characters |

### 5.2 Post-Submission Flow

| Step | Action | Details |
|------|--------|---------|
| 1 | Create lead record | Insert into leads table with type='b2b_contact', status='new', score=50 |
| 2 | Notify admin | Email type #2 sent to admin team with B2B flag |
| 3 | Track analytics event | Fire 'form_submission' event with form_type='b2b_contact' |

---

## Chapter 6: Chat-to-Lead Conversion

### 6.1 Automatic Conversion Conditions

A chat session is automatically converted to a lead when **BOTH** of the following conditions are met:

| Condition | Details |
|-----------|---------|
| Message count threshold | User has sent 10 or more messages in the current session |
| Intent keyword detection | User message contains one or more intent keywords: consultation, quote, estimate, budget, visit, appointment, builder recommendation, land, property, floor plan, mortgage, loan |

### 6.2 Auto-Conversion Flow

| Step | Action |
|------|--------|
| 1 | System detects both conditions are met |
| 2 | Create lead record with type='chat_conversion', status='new', score=60 (bonus for engagement) |
| 3 | Extract available info from chat (name, area mentions, budget mentions) and populate lead fields |
| 4 | Display CTA in chat: 'Would you like to receive a personalized consultation? Fill out this short form.' |
| 5 | Notify admin via email type #2 |

### 6.3 Manual Conversion (Phase 2)

In Phase 2, CS agents will have the ability to manually convert any chat session to a lead from the admin dashboard. This feature includes:

| Feature | Description |
|---------|-------------|
| One-click conversion | Button on chat transcript view to create a lead from the conversation |
| Field pre-population | System suggests field values extracted from the chat conversation via AI |
| CS review | CS agent can review and edit extracted fields before creating the lead |
| Attribution tracking | Lead is tagged with source='chat_manual' and linked to the chat session ID |
