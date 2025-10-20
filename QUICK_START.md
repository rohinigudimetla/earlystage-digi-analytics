# ⚡ Quick Start - Get Your Booking System Running

**Goal:** Get from code to working booking system in 30 minutes!

---

## 📋 Prerequisites

- [ ] This Next.js project (already done ✅)
- [ ] Gmail/Google account for calendar (your co-founder's)
- [ ] Email address for sending notifications

---

## 🚀 Fast Track (30 minutes)

### **1️⃣ Supabase Setup (5 min)**

```bash
1. Go to https://supabase.com → Sign up
2. "New Project" → Name: cher-analytics → Pick a password → Create
3. Wait 2 minutes for setup...
4. Copy Project URL and service_role key (Settings → API)
5. Paste into .env.local (see template below)
```

**Run SQL Migration:**

```bash
1. In Supabase → SQL Editor → New Query
2. Copy ALL SQL from FREE_SCHEDULING_SYSTEM.md (Database Setup section)
3. Paste → Run
4. Should see "Success. No rows returned"
```

**Create User:**

```bash
1. Table Editor → users → Insert row
2. Fill: email, name, google_calendar_id="primary"
3. Save
```

---

### **2️⃣ Google Calendar API (10 min)**

```bash
1. https://console.cloud.google.com → New Project
2. Search "Google Calendar API" → Enable
3. Credentials → Create OAuth Client ID
   - Configure Consent Screen if needed (External, fill name/emails)
   - Application type: Web
   - Authorized redirect: https://developers.google.com/oauthplayground
   - Copy Client ID and Secret
4. Paste into .env.local
```

**Get Refresh Token:**

```bash
1. https://developers.google.com/oauthplayground
2. Settings (gear icon) → Use your own OAuth credentials → Paste ID & Secret
3. Select Calendar API v3 → Check "https://www.googleapis.com/auth/calendar"
4. Authorize APIs → Sign in with co-founder's Google account
5. Exchange code for tokens → Copy "Refresh token"
6. Go to Supabase → users table → Paste token in google_refresh_token field
```

---

### **3️⃣ Resend Email (3 min)**

```bash
1. https://resend.com → Sign up
2. API Keys → Create API Key → Full access → Copy
3. Paste into .env.local
4. Use FROM_EMAIL=onboarding@resend.dev for testing
```

---

### **4️⃣ Environment Variables (2 min)**

Create/edit `.env.local` in project root:

```bash
# Google Calendar
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxx
FROM_EMAIL=onboarding@resend.dev

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### **5️⃣ Set Availability (5 min)**

In Supabase → Table Editor → `availability_rules` → Insert rows:

| user_id          | day_of_week | start_time | end_time |
| ---------------- | ----------- | ---------- | -------- |
| (your user UUID) | 1           | 09:00:00   | 17:00:00 |
| (your user UUID) | 2           | 09:00:00   | 17:00:00 |
| (your user UUID) | 3           | 09:00:00   | 17:00:00 |
| (your user UUID) | 4           | 09:00:00   | 17:00:00 |
| (your user UUID) | 5           | 09:00:00   | 17:00:00 |

_Days: 0=Sunday, 1=Monday, ..., 6=Saturday_

---

### **6️⃣ Test It! (5 min)**

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Navigate to wherever you placed <CalendarBooking />
# Try booking:
  1. Select a weekday date
  2. Select a time (should see 9 AM - 5 PM)
  3. Fill form: name, email
  4. Confirm
  5. Check Google Calendar → event should appear!
  6. Check email → confirmation should arrive!
```

---

## ✅ Success Checklist

After testing, you should see:

- [ ] Time slots load when selecting a date
- [ ] "Call Scheduled!" success screen
- [ ] Google Calendar event with Meet link
- [ ] Email to client (confirmation)
- [ ] Email to co-founder (notification)
- [ ] Booking record in Supabase `bookings` table

---

## 🐛 Quick Troubleshooting

**No time slots loading?**
→ Check `.env.local` has all variables
→ Restart dev server: `npm run dev`

**"Booking failed" error?**
→ Check terminal for error logs
→ Verify Google refresh token is in Supabase users table

**No email received?**
→ Check spam folder
→ `onboarding@resend.dev` only sends to your registered email
→ Check Resend dashboard → Logs

**Calendar event not created?**
→ Verify Calendar API is enabled
→ Check refresh token is from correct Google account

---

## 📚 Detailed Guides

- **SETUP_GUIDE.md** - Comprehensive setup with screenshots
- **TESTING_GUIDE.md** - 10 test cases to verify everything
- **PROJECT_SUMMARY.md** - What we built and why

---

## 🎯 Next Steps

Once it's working:

1. ✅ Deploy to Vercel (push to GitHub, connect Vercel, add env vars)
2. ✅ Verify custom domain in Resend for branded emails
3. 🔄 Build admin dashboard (coming next!)

---

## 💡 Pro Tips

- **Testing:** Use your own email first to avoid spamming clients
- **Availability:** Can set different hours per day (e.g., Friday 9-12 only)
- **Timezone:** Currently uses browser timezone (works great for local businesses)
- **Meet Links:** Automatic! Google creates them for every booking

---

**That's it! You now have a professional scheduling system! 🎉**

_Any issues? Check terminal logs and browser console (F12) for detailed error messages._
