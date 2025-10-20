# Enterprise-Level Scheduling System Design

## Cher Digital Analytics

---

## 1. System Overview

### Recommended Solution: **100% FREE - Google Calendar API + Supabase + Resend Free Tier**

**Why This Stack?**

- ✅ **Completely FREE** (within generous limits)
- ✅ Google Calendar API - Free, no limits on reads/writes
- ✅ Supabase Free Tier - 500MB database, 50,000 monthly active users
- ✅ Resend Free Tier - 3,000 emails/month, 100 emails/day
- ✅ Vercel Free Tier - Unlimited deployments
- ✅ Professional-grade, enterprise quality
- ✅ Full control over data and UX
- ✅ Scales to thousands of bookings/month

**Cost Breakdown (All Free Tiers):**

- Google Calendar API: **FREE** ✅
- Supabase: **FREE** (up to 500MB, 2GB bandwidth) ✅
- Resend Email: **FREE** (3,000 emails/month) ✅
- Vercel Hosting: **FREE** (unlimited sites) ✅
- **Total Monthly Cost: $0** 🎉

**Alternative Free Options:**

1. **Microsoft Graph API** - Free, good for Outlook/Office 365
2. **Mailgun Free Tier** - 5,000 emails/month (alternative to Resend)
3. **Neon Database** - Free tier PostgreSQL with generous limits
4. **Brevo (formerly Sendinblue)** - 300 emails/day free

---

## 2. Architecture Design

```
┌─────────────────────────────────────────────────────────────┐
│                     User Experience Flow                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (React Component)              │
│  • CalendarBooking Component                                │
│  • Fetches available slots from API                         │
│  • Displays only available times                            │
│  • Handles booking submission                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│           Next.js API Routes (/app/api/...)                 │
│  • GET  /api/availability?date=YYYY-MM-DD                   │
│  • POST /api/bookings (create new booking)                  │
│  • GET  /api/bookings (admin - list all)                    │
│  • DELETE /api/bookings/:id (cancel booking)                │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Supabase Database      │  │  Google Calendar API     │
│  (PostgreSQL) - FREE     │  │  - FREE                  │
│  • bookings table        │  │  • Calendar Sync         │
│  • users table           │  │  • Availability Check    │
│  • availability_rules    │  │  • Conflict Detection    │
│  • blocked_slots         │  │  • Event Creation        │
└──────────────────────────┘  └──────────────────────────┘
                ▲                           │
                │                           ▼
                │            ┌──────────────────────────┐
                │            │  Co-Founder's Calendar   │
                │            │  (Google Calendar)       │
                └────────────│  • Real-time sync        │
                             │  • Busy/free status      │
                             └──────────────────────────┘
```

---

## 3. Database Schema (Supabase/PostgreSQL)

```sql
-- Users/Admins table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin', -- 'admin' or 'client'
  calendar_provider TEXT, -- 'google', 'outlook', etc.
  calendar_token TEXT, -- encrypted OAuth token
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Availability Rules (co-founder's general availability)
CREATE TABLE availability_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blocked Slots (manual overrides for vacations, meetings, etc.)
CREATE TABLE blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id), -- co-founder
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INT DEFAULT 60,
  status TEXT DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'completed'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, scheduled_at) -- prevent double booking
);

-- Indexes for performance
CREATE INDEX idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_blocked_slots_user_id ON blocked_slots(user_id);
CREATE INDEX idx_availability_rules_user_id ON availability_rules(user_id);
```

---

## 4. API Endpoints Specification

### 4.1 GET `/api/availability`

**Purpose:** Fetch available time slots for a specific date

**Request:**

```typescript
GET /api/availability?date=2025-10-20
```

**Response:**

```json
{
	"date": "2025-10-20",
	"availableSlots": [
		{
			"time": "9:00 AM",
			"timestamp": "2025-10-20T09:00:00Z",
			"available": true
		},
		{
			"time": "10:00 AM",
			"timestamp": "2025-10-20T10:00:00Z",
			"available": true
		},
		{
			"time": "11:00 AM",
			"timestamp": "2025-10-20T11:00:00Z",
			"available": false
		},
		{
			"time": "2:00 PM",
			"timestamp": "2025-10-20T14:00:00Z",
			"available": true
		}
	]
}
```

**Logic:**

1. Query availability_rules for the day of week
2. Check blocked_slots for manual overrides
3. Check bookings table for existing appointments
4. Sync with Cal.com/Google Calendar for external events
5. Return merged availability

---

### 4.2 POST `/api/bookings`

**Purpose:** Create a new booking

**Request:**

```json
{
	"clientName": "John Doe",
	"clientEmail": "john@example.com",
	"clientPhone": "+1234567890",
	"scheduledAt": "2025-10-20T14:00:00Z",
	"notes": "Interested in analytics dashboard"
}
```

**Response:**

```json
{
	"success": true,
	"booking": {
		"id": "abc-123-def",
		"scheduledAt": "2025-10-20T14:00:00Z",
		"confirmationSent": true
	}
}
```

**Logic:**

1. Validate slot is still available (race condition check)
2. Create booking in database
3. Create event in Cal.com/Google Calendar
4. Send confirmation emails (to client and co-founder)
5. Return booking details

---

### 4.3 GET `/api/bookings` (Admin Only)

**Purpose:** List all bookings for admin dashboard

**Response:**

```json
{
	"bookings": [
		{
			"id": "abc-123",
			"clientName": "John Doe",
			"clientEmail": "john@example.com",
			"scheduledAt": "2025-10-20T14:00:00Z",
			"status": "confirmed"
		}
	]
}
```

---

## 5. Implementation Options

### Option A: Full Cal.com Integration (Recommended)

**Pros:**

- Fastest to implement
- Professional-grade features out of the box
- Calendar sync built-in
- Email notifications included
- Mobile apps available for co-founder

**Cons:**

- Less control over UX
- Pricing scales with usage

**Implementation:**

```typescript
// Use Cal.com embed or API
import Cal, { getCalApi } from "@calcom/embed-react";

<Cal
	calLink="yourcompany/consultation"
	style={{ width: "100%", height: "100%", overflow: "scroll" }}
	config={{ layout: "month_view" }}
/>;
```

---

### Option B: Custom Build with Google Calendar API

**Pros:**

- Full control over UX
- Free (only pay for infrastructure)
- Complete customization

**Cons:**

- More development time (2-3 weeks)
- Need to build email notifications
- Need to handle OAuth flows
- Ongoing maintenance

**Key Libraries:**

- `googleapis` - Google Calendar API
- `@supabase/supabase-js` - Database
- `nodemailer` or `resend` - Email notifications
- `react-query` - Data fetching

---

### Option C: Hybrid Approach (Best of Both Worlds)

**Use Cal.com API for backend, custom frontend**

**Pros:**

- Keep your custom UI
- Leverage Cal.com's calendar sync
- Professional backend without building it

**Implementation Flow:**

1. Co-founder sets up Cal.com account
2. Connects Google Calendar to Cal.com
3. Your app uses Cal.com API to fetch availability
4. Your custom UI displays available slots
5. Booking goes through Cal.com API
6. Cal.com handles calendar updates and emails

---

## 6. Security Considerations

### 6.1 Authentication

- Admin dashboard: NextAuth.js with email/password
- API endpoints: Protected with JWT tokens
- Rate limiting: Prevent booking spam

### 6.2 Data Protection

- Encrypt calendar OAuth tokens
- HTTPS only
- GDPR compliance for client data
- Data retention policies

### 6.3 Booking Integrity

- Optimistic locking to prevent double-booking
- Transaction-based booking creation
- Webhook verification for external calendar events

---

## 7. Email Notifications

**Service Options:**

1. **Resend** (Recommended) - Developer-friendly, great deliverability
2. **SendGrid** - Enterprise-grade, more features
3. **AWS SES** - Cheapest, good for high volume

**Email Templates Needed:**

1. Booking confirmation (to client)
2. New booking notification (to co-founder)
3. Reminder email (24 hours before)
4. Cancellation confirmation
5. Rescheduling notification

---

## 8. Admin Dashboard Features

### Required Features:

- ✅ View upcoming bookings (calendar view)
- ✅ Set weekly availability (recurring schedule)
- ✅ Block specific dates/times (vacations, meetings)
- ✅ Cancel/reschedule bookings
- ✅ View client contact information
- ✅ Export bookings to CSV
- ✅ Analytics (bookings per week, conversion rate)

### Tech Stack:

- Next.js App Router
- Shadcn UI components
- React Query for data fetching
- Zustand or Context for state management

---

## 9. Recommended Implementation Plan

### Phase 1: Quick Start (1 week)

1. Set up Cal.com account
2. Connect co-founder's Google Calendar
3. Embed Cal.com widget in your app
4. Test booking flow

### Phase 2: Custom Integration (2-3 weeks)

1. Set up Supabase database
2. Create API routes for availability
3. Build custom CalendarBooking component
4. Integrate Cal.com API
5. Add email notifications

### Phase 3: Admin Dashboard (1-2 weeks)

1. Build admin authentication
2. Create booking management UI
3. Add availability configuration
4. Implement analytics

### Phase 4: Polish & Launch (1 week)

1. Add reminder emails
2. Implement cancellation flow
3. Add Google Calendar meeting links
4. Testing and QA

---

## 10. Cost Estimate

### Option A: Cal.com

- Free tier: Limited features
- Pro: $12/seat/month
- Total: ~$150/year

### Option B: Custom Build

- Supabase: $0-25/month (free tier sufficient initially)
- Resend Email: $0-20/month (free tier: 3,000 emails/month)
- Hosting: $0 (Vercel free tier)
- Total: ~$0-540/year

### Option C: Hybrid

- Cal.com API: $29/month
- Supabase: $0-25/month
- Resend: $0-20/month
- Total: ~$350-900/year

---

## 11. Next Steps - Choose Your Path

### Path 1: Quick Launch (Recommended to Start)

Use Cal.com embed, get feedback, iterate

### Path 2: Full Custom Build

Maximum control, longer timeline

### Path 3: Hybrid

Best balance of speed and customization

**Which path would you like to pursue?** I can start implementing immediately!
