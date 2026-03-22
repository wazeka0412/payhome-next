# AI Chat Operation Rules
> Version 1.0 | 2026-03-22 | wazeka Inc.

---

## Chapter 1: Session Management

### 1.1 Session Definition

A chat session begins when the user opens the chat widget and ends when the widget is closed or the session times out. Each session is assigned a unique session ID for tracking and analytics purposes.

### 1.2 Session Limits

| Parameter | Value | Rationale |
|---|---|---|
| Maximum messages per session | 50 messages | Cost control; prevents runaway conversations |
| Maximum characters per message | 500 characters | Input quality control; prevents abuse |
| Session timeout | 30 minutes of inactivity | Resource management; auto-closes idle sessions |
| Concurrent sessions per user | 1 | Prevents duplicate sessions and cost duplication |

### 1.3 Session Completion Definition

A session is considered "completed" when the user has sent 5 or more messages. Only completed sessions are counted in analytics and contribute to lead scoring (+10 points). Sessions with fewer than 5 messages are recorded but classified as "incomplete" in reporting.

---

## Chapter 2: Cost Management

### 2.1 GPT-4o Configuration

| Parameter | Value |
|---|---|
| Model | GPT-4o |
| max_tokens | 1000 |
| temperature | 0.7 |
| System prompt | Managed separately (see Chapter 6) |
| API provider | OpenAI |

### 2.2 Monthly Cost Estimate

| Metric | Estimate |
|---|---|
| Expected monthly sessions | 500 - 1,000 |
| Average messages per session | 8 - 12 |
| Average tokens per exchange | ~1,500 (input + output) |
| Estimated monthly cost | $50 - $100 |

### 2.3 Cost Alert Thresholds

| Threshold | Action |
|---|---|
| $100 / month | Warning: Send notification to admin; review usage patterns |
| $200 / month | Critical: Send urgent alert to admin; consider enabling cost reduction measures |

### 2.4 Cost Reduction Plans

The following measures can be activated if costs exceed thresholds:

| Priority | Measure | Expected Savings | Impact |
|---|---|---|---|
| 1 | Implement FAQ database for common questions | 30-40% reduction | Faster responses for common queries; reduces API calls |
| 2 | Model downgrade to GPT-4o-mini | 50-60% reduction | Slightly lower quality; acceptable for standard queries |
| 3 | Reduce max_tokens to 500 | 20-30% reduction | Shorter responses; may require multiple exchanges |
| 4 | Reduce session message limit to 30 | 15-20% reduction | Limits extended conversations |

---

## Chapter 3: Response Quality Rules

### 3.1 Must-Follow Rules

Every AI response must adhere to the following rules:

| # | Rule | Details |
|---|---|---|
| 1 | Language: Japanese only | All responses must be in Japanese regardless of user input language |
| 2 | Length: 3-5 sentences | Responses should be concise but informative; avoid single-word answers |
| 3 | Specific pricing | When discussing costs, provide specific price ranges (e.g., "30-40 million yen for this area") rather than vague statements |
| 4 | Partner builders only | Only recommend or mention builders that are registered partners on Payhome |
| 5 | No superlatives | Avoid words like "best", "cheapest", "number one", "guaranteed" to prevent misleading claims |
| 6 | Polite formal tone | Use desu/masu form consistently; maintain professional but approachable tone |
| 7 | Actionable advice | Each response should guide the user toward a next step (view property, request catalog, book consultation) |

### 3.2 Prohibited Topics

| # | Prohibited Topic | Required Response |
|---|---|---|
| 1 | Competitor criticism | Redirect to Payhome's strengths without naming or criticizing competitors |
| 2 | Loan approval predictions | "Loan approval depends on individual circumstances. We recommend consulting with a financial institution." |
| 3 | Legal advice | "For legal matters, please consult a qualified attorney or judicial scrivener." |
| 4 | Tax advice | "For tax-related questions, please consult a certified tax accountant." |
| 5 | Personal identifiable information | Never ask for or store PII in chat (full address, ID numbers, income details) |
| 6 | Internal business information | Never disclose partner commission rates, internal metrics, or business strategies |

### 3.3 Error Correction Procedure

| Step | Action |
|---|---|
| 1 | CS team identifies incorrect or problematic AI response in chat log review |
| 2 | Document the issue: session ID, message number, incorrect content, expected correct response |
| 3 | Report to PM/management for prompt adjustment (see Chapter 6) |
| 4 | If user was affected: CS contacts user directly to provide correct information |
| 5 | Add the scenario to the test conversation set for regression testing |

---

## Chapter 4: Lead Conversion Rules

### 4.1 Auto-Conversion Conditions

Automatic conversion from chat session to lead occurs when BOTH conditions are met:

| Condition | Threshold |
|---|---|
| Message count | 10 or more user messages in the session |
| Intent keyword detected | Message contains: consultation, quote, estimate, budget, visit, appointment, builder recommendation, land, property, floor plan, mortgage, loan |

### 4.2 CTA Injection Schedule

Call-to-action messages are injected at specific points in the conversation:

| Trigger | CTA Content | Format |
|---|---|---|
| 5th user message | Form link CTA | "Would you like personalized recommendations? Fill out our quick consultation form: [link]" |
| 10th user message | Phone/LINE CTA | "For immediate assistance, call us at [phone] or add us on LINE: [LINE ID]" |
| Session limit warning (45th msg) | Urgency CTA | "This session is nearing its limit. To continue the conversation, please contact us via [form/phone/LINE]." |

### 4.3 Manual Conversion (Phase 2)

In Phase 2, CS agents will be able to manually convert any chat session to a lead from the admin dashboard. The manual conversion interface will allow CS agents to review the chat transcript, extract relevant information, and create a lead with pre-populated fields.

---

## Chapter 5: Widget Display Rules

### 5.1 Pages Where Widget is Displayed

| Page Type | Display | Examples |
|---|---|---|
| Consumer pages | Yes | Home, property listings, property detail, builder list, builder detail, blog articles, about, FAQ |
| Business (B2B) pages | Yes | Builder signup, partner information pages |
| Admin pages | No | /admin/\*, /dashboard/\* |
| Authentication pages | No | /login, /signup, /reset-password |

### 5.2 Viewport Restrictions

| Condition | Behavior |
|---|---|
| Viewport width < 320px | Widget is hidden (too small for usable chat experience) |
| Viewport width 320-768px | Widget displayed as floating button; opens as full-screen overlay |
| Viewport width > 768px | Widget displayed as floating button; opens as side panel (400px width) |

---

## Chapter 6: Prompt Management

### 6.1 Update Permissions

| Change Type | Approval Required From |
|---|---|
| Minor wording adjustments | PM (Project Manager) |
| Tone or style changes | PM + Management |
| New topic coverage | PM + Management |
| System prompt restructuring | Management approval required |
| Model parameter changes | Management approval required |

### 6.2 Testing Requirements

Before any prompt change is deployed to production:

| Step | Requirement |
|---|---|
| 1 | Minimum 5 test conversations must be conducted covering diverse scenarios |
| 2 | Test scenarios must include: general inquiry, budget question, area question, prohibited topic, edge case |
| 3 | All test conversations must pass quality review by PM |
| 4 | Results documented with session IDs and reviewer comments |
| 5 | Staging deployment for 24-hour monitoring before production release |

### 6.3 Major Change Approval Process

| Step | Action |
|---|---|
| 1 | PM submits change proposal with rationale and expected impact |
| 2 | Management reviews and approves/rejects within 2 business days |
| 3 | If approved: implement in staging environment |
| 4 | Conduct 5+ test conversations (see 6.2) |
| 5 | PM reviews test results and signs off |
| 6 | Deploy to production with monitoring alert set for 48 hours |
| 7 | Post-deployment review after 1 week with metrics comparison |
