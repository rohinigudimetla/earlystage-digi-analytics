# 🚀 Setup Guide - Free Scheduling System

Your booking system is now **fully coded**! This guide will walk you through setting up the external services (all free) to make it work.

---

## ✅ What's Already Done

- ✅ Frontend booking component with real-time availability checking
- ✅ Backend API routes for availability and bookings
- ✅ Google Calendar integration (creates events with Meet links)
- ✅ Email service (sends confirmations to client and co-founder)
- ✅ Database integration ready (Supabase)

---

## 🎯 What You Need to Set Up (Step-by-Step)

### **Step 1: Set Up Supabase Database (5 minutes)**

Supabase is your PostgreSQL database - stores bookings, availability rules, etc.

1. Go to [https://supabase.com](https://supabase.com) and sign up (free)
2. Create a new project:

   - **Name:** cher-digital-analytics
   - **Database Password:** Choose a strong password
   - **Region:** Choose closest to you
   - Wait 2-3 minutes for setup to complete

3. **Run the SQL migration:**

   - Click **SQL Editor** in the left sidebar
   - Click **New Query**
   - Open `FREE_SCHEDULING_SYSTEM.md` file in this project
   - Copy the **entire SQL code** from the "Database Setup" section
   - Paste it into the SQL editor and click **RUN**
   - You should see "Success. No rows returned"

4. **Get your connection strings:**

   - Click **Settings** (gear icon) → **API**
   - Copy these two values:
     - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
     - `service_role` key (under "Project API keys") → This is your `SUPABASE_SERVICE_ROLE_KEY`

5. **Create your user record:**
   - Go to **Table Editor** → **users** table
   - Click **Insert row**
   - Fill in:
     - `email`: Your co-founder's email
     - `name`: Your co-founder's name
     - `google_calendar_id`: "primary" (this is the default calendar)
     - Leave `google_refresh_token` empty for now (we'll set this in Step 2)
   - Click **Save**

---

### **Step 2: Set Up Google Calendar API (10 minutes)**

This allows the system to check your calendar and create events.

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project:

   - Click the project dropdown (top left)
   - Click **NEW PROJECT**
   - **Project name:** cher-digital-analytics
   - Click **CREATE**

3. **Enable Calendar API:**

   - In the search bar at top, type "Google Calendar API"
   - Click **Google Calendar API**
   - Click **ENABLE**

4. **Create OAuth credentials:**

   - Go to **APIs & Services** → **Credentials**
   - Click **CREATE CREDENTIALS** → **OAuth client ID**
   - If prompted, click **CONFIGURE CONSENT SCREEN**:
     - Choose **External**
     - **App name:** Cher Digital Analytics Booking
     - **User support email:** Your email
     - **Developer contact:** Your email
     - Click **SAVE AND CONTINUE** (skip all other sections)
   - Now create the OAuth client:
     - **Application type:** Web application
     - **Name:** Booking System
     - **Authorized redirect URIs:** Add `https://developers.google.com/oauthplayground`
     - Click **CREATE**
   - Copy the **Client ID** and **Client Secret** → Save them!

5. **Get Refresh Token:**

   - Go to [OAuth Playground](https://developers.google.com/oauthplayground)
   - Click the gear icon (⚙️) in top right
   - Check ✅ "Use your own OAuth credentials"
   - Paste your **Client ID** and **Client Secret**
   - Close the settings
   - In the left panel, find **Calendar API v3**
   - Check ✅ `https://www.googleapis.com/auth/calendar`
   - Click **Authorize APIs**
   - Sign in with your **co-founder's Google account** (the calendar you want to sync)
   - Click **Allow**
   - Click **Exchange authorization code for tokens**
   - Copy the **Refresh token** → Save it!

6. **Update Supabase user record:**
   - Go back to Supabase → **Table Editor** → **users**
   - Click the user row you created
   - Paste the **Refresh token** into the `google_refresh_token` field
   - Click **Save**

---

### **Step 3: Set Up Email Service (3 minutes)**

Resend sends professional emails to clients and you.

1. Go to [https://resend.com](https://resend.com) and sign up (free)
2. **Create API Key:**

   - Go to **API Keys**
   - Click **Create API Key**
   - **Name:** Production
   - **Permission:** Full access
   - Click **Create**
   - Copy the API key → Save it!

3. **Email address:**
   - For testing: Use `onboarding@resend.dev` (pre-verified)
   - For production: Add your domain and verify it (follow their guide)

---

### **Step 4: Configure Environment Variables**

Now let's put all these keys into your project.

1. Open `.env.local` in your project
2. Paste this and **fill in your values**:

```bash
# Google Calendar API
GOOGLE_CLIENT_ID=your_client_id_from_step_2
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_2

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_step_1

# Resend Email Service
RESEND_API_KEY=re_xxxxx_from_step_3
FROM_EMAIL=onboarding@resend.dev

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### **Step 5: Set Default Availability (2 minutes)**

Tell the system when your co-founder is available for calls.

1. Go to Supabase → **Table Editor** → **availability_rules**
2. Click **Insert row** for each day you want to be available
3. Example (Monday 9 AM - 5 PM):
   - `user_id`: Copy from the `users` table (the UUID)
   - `day_of_week`: 1 (Monday = 1, Sunday = 0)
   - `start_time`: 09:00:00
   - `end_time`: 17:00:00
   - Click **Save**

Repeat for each business day (1-5 for Monday-Friday).

---

### **Step 6: Test It! 🎉**

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Navigate to the booking section (wherever you placed the `<CalendarBooking />` component)

4. **Test the flow:**
   - Select a date
   - You should see available time slots load (only times you set in Step 5)
   - Select a time
   - Fill in your name, email, phone
   - Click "Confirm Booking"
   - ✅ You should see "Call Scheduled!" with a Google Meet link
   - ✅ Check your co-founder's Google Calendar - event should appear!
   - ✅ Check both email inboxes - confirmation emails should arrive

---

## 🐛 Troubleshooting

### "Could not load available times"

- Check browser console (F12) for errors
- Verify `.env.local` variables are correct (restart dev server after changes!)
- Check Supabase logs: **Dashboard** → **Logs** → **API**

### "Booking failed"

- Check terminal for error messages
- Verify Google Calendar API is enabled
- Verify refresh token is correct in Supabase `users` table

### No email received

- Check spam folder
- If using `onboarding@resend.dev`, it only sends to your verified email
- Check Resend dashboard for delivery logs

### Google Calendar event not created

- Verify the refresh token belongs to the correct Google account
- Check that Calendar API is enabled in Google Cloud Console
- Look for errors in terminal logs

---

## 📊 Free Tier Limits

You're well within free limits for a professional service:

| Service                 | Free Tier                          | Your Usage                          |
| ----------------------- | ---------------------------------- | ----------------------------------- |
| **Supabase**            | 500 MB database, 50K monthly users | Minimal (just booking data)         |
| **Google Calendar API** | Unlimited calendar operations      | 1-2 per booking                     |
| **Resend**              | 3,000 emails/month                 | 2 per booking (client + co-founder) |
| **Vercel**              | Unlimited deployments              | 1 website                           |

**At 2 emails per booking, you can handle 1,500 bookings/month on the free tier!**

---

## 🚀 Next Steps

1. ✅ Complete the setup above
2. ✅ Test a booking end-to-end
3. 🔄 Build the admin dashboard (coming next - lets your co-founder manage bookings)
4. 🔄 Deploy to Vercel (push to GitHub, connect Vercel, add env vars)

---

## 📧 Questions?

Everything is commented in the code! Check:

- `FREE_SCHEDULING_SYSTEM.md` - Complete technical documentation
- `lib/google-calendar.ts` - How Google Calendar integration works
- `lib/email.ts` - Email templates
- `app/api/availability/route.ts` - How availability checking works
- `app/api/bookings/route.ts` - How booking creation works

**The system is ready to go! Just fill in the environment variables and test it out! 🎉**
