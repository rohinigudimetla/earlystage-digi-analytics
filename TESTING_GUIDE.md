# 🧪 Testing Checklist

Use this to verify everything is working correctly.

## ✅ Pre-Testing Setup Verification

Before testing, make sure you've completed:

- [ ] Supabase project created
- [ ] SQL migration run successfully
- [ ] User record created in `users` table
- [ ] Google Calendar API enabled
- [ ] OAuth credentials created
- [ ] Refresh token obtained and saved to Supabase
- [ ] Resend API key created
- [ ] All environment variables in `.env.local`
- [ ] Dev server restarted after adding env vars

---

## 🧪 Test 1: Availability Check

**What we're testing:** Frontend can fetch available time slots from backend

1. Start dev server: `npm run dev`
2. Open browser dev tools (F12) → Network tab
3. Navigate to booking page
4. Click any date in the calendar
5. **Expected:**
   - Loading spinner appears briefly
   - Time slots appear (9 AM - 5 PM based on your availability rules)
   - In Network tab, see request to `/api/availability?date=YYYY-MM-DD`
   - Status: 200 OK

**If it fails:**

- Check console for errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- Check Supabase `availability_rules` table has records

---

## 🧪 Test 2: Booking Creation

**What we're testing:** Full booking flow works end-to-end

1. Select a date
2. Select an available time slot
3. Fill in the form:
   - **Name:** Test User
   - **Email:** your-test-email@example.com
   - **Phone:** (optional)
   - **Message:** This is a test booking
4. Click "Confirm Booking"
5. **Expected:**
   - Loading spinner shows "Confirming..."
   - Success screen appears: "Call Scheduled!"
   - Google Meet link button visible
   - In Network tab, see POST request to `/api/bookings`
   - Status: 200 OK

**If it fails:**

- Check terminal for error messages
- Common issues:
  - `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` incorrect
  - Refresh token invalid or expired
  - Calendar API not enabled

---

## 🧪 Test 3: Google Calendar Event

**What we're testing:** Event appears in co-founder's calendar

1. After successful booking, open Google Calendar
2. Navigate to the booked date and time
3. **Expected:**
   - Event appears with title "Consultation with [Client Name]"
   - Event description includes client email, phone, message
   - Google Meet link is attached
   - Event is 1 hour long

**If event doesn't appear:**

- Verify you're checking the correct Google account (same one used for refresh token)
- Check terminal logs for Google API errors
- Verify `google_calendar_id` in Supabase is "primary"

---

## 🧪 Test 4: Client Confirmation Email

**What we're testing:** Client receives booking confirmation

1. After booking, check the email inbox you provided
2. **Expected email content:**
   - **Subject:** "Your consultation is confirmed!"
   - **From:** onboarding@resend.dev (or your verified domain)
   - **Contains:**
     - Booking date and time
     - Google Meet link
     - "Add to Calendar" instructions

**If no email:**

- Check spam folder
- Go to Resend dashboard → **Logs**
- Verify `RESEND_API_KEY` is correct
- If using `onboarding@resend.dev`, it only sends to your registered email

---

## 🧪 Test 5: Co-founder Notification Email

**What we're testing:** You get notified of new bookings

1. After booking, check the email in your Supabase `users.email` field
2. **Expected email content:**
   - **Subject:** "New booking: [Client Name]"
   - **Contains:**
     - Client's full details (name, email, phone, message)
     - Date and time of booking
     - Google Meet link
     - Button to view in Google Calendar

**If no email:**

- Same troubleshooting as Test 4
- Verify the email address in `users` table is correct

---

## 🧪 Test 6: Database Record

**What we're testing:** Booking is saved to database

1. Go to Supabase → **Table Editor** → **bookings**
2. **Expected:**
   - New row appears with your test booking
   - Fields populated:
     - `client_name`, `client_email`, `client_phone`, `message`
     - `scheduled_date`, `scheduled_time`
     - `google_event_id` (not null)
     - `status` = "confirmed"
     - `created_at` = recent timestamp

**If no record:**

- Check terminal for database errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct

---

## 🧪 Test 7: Duplicate Booking Prevention

**What we're testing:** Can't double-book the same time slot

1. Create a booking for a specific date/time
2. Without refreshing, try to book the **same** date/time again
3. **Expected:**
   - Error message: "Time slot is no longer available"
   - Booking is NOT created

**If duplicate booking succeeds:**

- There's a race condition issue
- Check `app/api/bookings/route.ts` for the double-check logic

---

## 🧪 Test 8: Blocked Time Slots

**What we're testing:** Busy times show as unavailable

### Create a conflict:

1. Go to Google Calendar
2. Create a manual event on a business day during available hours (e.g., Tuesday 2:00 PM - 3:00 PM)
3. Title it "Existing Meeting"

### Test in booking form:

1. Navigate to booking page
2. Select the same date
3. **Expected:**
   - All time slots load
   - The 2:00 PM slot is **disabled** (grayed out, can't click)
   - Other slots are clickable

**If busy slot is not disabled:**

- Check if the calendar event is on the correct Google account
- Verify the event time overlaps with the slot time
- Check API response in Network tab for `available: false` flag

---

## 🧪 Test 9: No Availability

**What we're testing:** Graceful handling when no slots are available

### Create full day of conflicts:

1. In Google Calendar, create all-day event or multiple events covering all hours
2. Or, in Supabase, delete `availability_rules` for that day of week

### Test:

1. Select that date in booking form
2. **Expected:**
   - Loading completes
   - Message: "No available times for this date. Please select another day."
   - No time slots shown

---

## 🧪 Test 10: Form Validation

**What we're testing:** Can't submit without required fields

1. Select date and time
2. Leave name or email blank
3. Click "Confirm Booking"
4. **Expected:**
   - Error message: "Please fill in all required fields"
   - Booking is NOT created

---

## 📊 Success Criteria

All tests passing? You're ready for production! 🎉

**Final Checklist:**

- [ ] Availability loads correctly
- [ ] Booking creates successfully
- [ ] Google Calendar event appears
- [ ] Client email received
- [ ] Co-founder email received
- [ ] Database record created
- [ ] Duplicate prevention works
- [ ] Busy times are disabled
- [ ] Form validation works
- [ ] No console errors

---

## 🐛 Common Issues & Fixes

### "Network Error" or API not responding

```bash
# Restart dev server
npm run dev
```

### Environment variables not loading

```bash
# Make sure .env.local is in root directory
# Restart dev server after any changes
```

### Google Calendar API errors

- Verify API is enabled in Cloud Console
- Check refresh token hasn't expired (get a new one from OAuth Playground)
- Ensure Client ID and Secret match

### Email not sending

- Check Resend dashboard for delivery logs
- Verify API key is correct
- Remember: `onboarding@resend.dev` only sends to your registered email

### Database connection errors

- Verify Supabase project is active (not paused)
- Check service role key is correct
- Ensure SQL migration ran successfully

---

## 🚀 Next Steps After Testing

1. **Set real availability rules** in Supabase for your actual schedule
2. **Verify your domain** in Resend for professional emails
3. **Build admin dashboard** to manage bookings easily
4. **Deploy to production** on Vercel
5. **Update environment variables** in Vercel with production values

Happy testing! 🧪✨
