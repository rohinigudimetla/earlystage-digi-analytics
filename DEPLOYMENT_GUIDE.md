# 🚀 Production Deployment Guide

Complete step-by-step guide to deploy your booking system with a new Google Business account.

---

## 📋 Prerequisites Checklist

Before starting, have ready:

- [ ] New Google Workspace/Business email (e.g., `booking@cherdigitalanalytics.com`)
- [ ] Production domain (e.g., `www.cherdigitalanalytics.com`)
- [ ] Supabase account (keep existing project or create new one)
- [ ] Resend account with verified domain

---

## Step 1: Google Cloud Console Setup (20 minutes)

### A. Create New Google Cloud Project

1. Go to: https://console.cloud.google.com
2. Sign in with your **new Google Business account**
3. Click **"Select a project"** → **"New Project"**
4. **Project name:** `Cher Digital Analytics`
5. Click **"CREATE"**

### B. Enable Google Calendar API

1. In your new project, go to **"APIs & Services"** → **"Library"**
2. Search for: `Google Calendar API`
3. Click on it → Click **"ENABLE"**
4. Wait ~30 seconds for activation

### C. Create OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** → Click **"CREATE"**
3. Fill in:
   - **App name:** `Cher Digital Analytics Booking`
   - **User support email:** Your new business email
   - **Developer contact:** Your new business email
4. Click **"SAVE AND CONTINUE"**
5. **Scopes:** Skip for now → Click **"SAVE AND CONTINUE"**
6. **Test users:** Click **"+ ADD USERS"**
   - Add your business email
   - Click **"ADD"**
7. Click **"SAVE AND CONTINUE"** → **"BACK TO DASHBOARD"**

### D. Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. **Application type:** Web application
4. **Name:** `Booking System Web Client`
5. **Authorized JavaScript origins:**
   - Add: `http://localhost:3000` (for development)
   - Add: `https://www.cherdigitalanalytics.com` (your production domain)
6. **Authorized redirect URIs:**
   - Add: `http://localhost:3000/oauth2callback`
   - Add: `https://www.cherdigitalanalytics.com/oauth2callback`
7. Click **"CREATE"**
8. **COPY THESE VALUES** (you'll need them later):
   - ✅ Client ID (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
   - ✅ Client Secret (looks like: `GOCSPX-...`)

---

## Step 2: Get Google Calendar Refresh Token (10 minutes)

### A. Authorize Your Business Account

1. Open this URL (replace `YOUR_CLIENT_ID` with the Client ID from Step 1D):

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/oauth2callback&response_type=code&scope=https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/calendar.events&access_type=offline&prompt=consent
```

2. Sign in with your **new business email**
3. Click **"Allow"** to grant calendar permissions
4. You'll be redirected to `localhost:3000/oauth2callback?code=...`
5. **COPY the entire URL** from your browser's address bar

### B. Exchange Code for Refresh Token

1. Open PowerShell in your project directory
2. Extract the `code` parameter from the URL you copied
3. Run this command (replace `YOUR_CODE`, `YOUR_CLIENT_ID`, and `YOUR_CLIENT_SECRET`):

```powershell
$code = "YOUR_CODE_HERE"
$response = curl.exe -X POST "https://oauth2.googleapis.com/token" -d "code=$code&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&redirect_uri=http://localhost:3000/oauth2callback&grant_type=authorization_code"
$response | ConvertFrom-Json | Select-Object refresh_token
```

4. **COPY the refresh_token** value (starts with `1//0...`)

---

## Step 3: Supabase Database Setup (5 minutes)

### Option A: Use Existing Database (Recommended)

1. Go to: https://supabase.com/dashboard
2. Select your existing project
3. Go to **"Table Editor"** → **"users"** table
4. **Update the existing row:**
   - `email`: Your **new business email**
   - `name`: Your name or "Cher Digital Analytics"
   - `google_refresh_token`: Paste the token from Step 2B
   - `google_calendar_id`: Keep as `primary`
5. Click **"Save"**

### Option B: Fresh Start (New Database)

If you want to start fresh:

1. Create new Supabase project
2. Go to **"SQL Editor"** → **"New Query"**
3. Copy and paste the SQL from `database-migration.sql`
4. Update the INSERT statement with your new business email
5. Run the query
6. Save your new Supabase credentials

---

## Step 4: Resend Email Setup (10 minutes)

### A. Verify Your Production Domain

1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `cherdigitalanalytics.com`
4. Follow the DNS setup instructions to add:
   - SPF record
   - DKIM records
5. Wait for verification (usually 5-15 minutes)

### B. Update From Email

Once verified, you can use: `booking@cherdigitalanalytics.com`

---

## Step 5: Update Environment Variables

Update your `.env.local` file with the new credentials:

```bash
# Google Calendar API (from Step 1D)
GOOGLE_CLIENT_ID=YOUR_NEW_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_NEW_CLIENT_SECRET
GOOGLE_CALENDAR_ID=primary

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_KEY

# Resend Email Service
RESEND_API_KEY=YOUR_RESEND_API_KEY
FROM_EMAIL=booking@cherdigitalanalytics.com  # ← Update this

# Production URL
NEXT_PUBLIC_APP_URL=https://www.cherdigitalanalytics.com  # ← Update this
```

---

## Step 6: Test Everything Locally (15 minutes)

### A. Restart Development Server

```bash
npm run dev
```

### B. Test Availability

1. Open: http://localhost:3000/contact
2. Select a future date
3. Verify time slots appear correctly
4. Create an event in your **new business Google Calendar**
5. Refresh the booking page
6. **Verify:** That time slot is now unavailable ✅

### C. Test Booking

1. Select an available time slot
2. Fill in client details
3. Click **"Confirm Booking"**
4. **Check terminal:** Should see success messages
5. **Check Supabase:** Booking appears in `bookings` table
6. **Check Google Calendar:** Event created with Meet link
7. **Check Email:** Both you and client received emails

---

## Step 7: Deploy to Production

### Update Production Environment Variables

On Vercel/Netlify/your hosting platform:

1. Go to your project settings
2. Update **all environment variables** with production values
3. **CRITICAL:** Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Redeploy your application

### Verify Production OAuth

Make sure your Google OAuth Client has:

- ✅ Production domain in "Authorized JavaScript origins"
- ✅ Production domain + `/oauth2callback` in "Authorized redirect URIs"

---

## 🎯 Quick Reference: What Changed

| Item              | Old Value                      | New Value                          |
| ----------------- | ------------------------------ | ---------------------------------- |
| **Google Email**  | `rohinigudimetla174@gmail.com` | `booking@cherdigitalanalytics.com` |
| **Client ID**     | `540561661553-ck3jq...`        | Your new Client ID                 |
| **Client Secret** | `GOCSPX-Zdxd...`               | Your new Client Secret             |
| **Refresh Token** | Old token                      | New token from Step 2B             |
| **From Email**    | `onboarding@resend.dev`        | `booking@cherdigitalanalytics.com` |
| **App URL**       | `localhost:3000`               | `www.cherdigitalanalytics.com`     |

---

## 🚨 Common Issues & Solutions

### "invalid_grant" Error

- **Cause:** Refresh token has spaces or is incorrect
- **Fix:** Re-copy token from Step 2B, ensure no spaces

### No Time Slots Showing

- **Cause:** Availability rules not set for day of week
- **Fix:** Check Supabase → `availability_rules` table

### Google Calendar Events Not Created

- **Cause:** Refresh token not saved in Supabase
- **Fix:** Verify `users.google_refresh_token` field is filled

### Emails Not Sending

- **Cause:** Domain not verified in Resend
- **Fix:** Complete Step 4A DNS verification

---

## ✅ Final Checklist

Before going live:

- [ ] Google Cloud project created with new business account
- [ ] Google Calendar API enabled
- [ ] OAuth Client created with production domain
- [ ] Refresh token obtained and saved to Supabase
- [ ] Supabase users table updated with new business email
- [ ] Resend domain verified
- [ ] All environment variables updated
- [ ] Local testing completed successfully
- [ ] Production deployment updated
- [ ] End-to-end booking test on production domain

---

## 📞 Support

If you encounter issues during migration:

1. Check terminal logs for specific error messages
2. Verify all credentials are copied correctly (no spaces!)
3. Ensure OAuth redirect URIs match your domain exactly
4. Test locally first before deploying to production

---

**You're all set!** 🎉 This guide ensures a smooth transition to your new Google Business account.
