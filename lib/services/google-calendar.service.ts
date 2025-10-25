import { google } from "googleapis";

/**
 * Google Calendar Integration
 *
 * This file handles all communication with Google Calendar API:
 * - Checking availability (when co-founder is free/busy)
 * - Creating calendar events (when booking is made)
 * - Deleting calendar events (when booking is canceled)
 */

// Create OAuth2 client (handles authentication with Google)
const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID, // Your app's Google ID
	process.env.GOOGLE_CLIENT_SECRET, // Your app's Google secret
	process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback/google" // Where Google sends user after login
);

/**
 * Set the refresh token from database
 * This token allows us to access calendar without user re-logging in
 */
export function setCredentials(refreshToken: string) {
	oauth2Client.setCredentials({
		refresh_token: refreshToken,
	});
}

// Simple in-memory cache for Google Calendar API calls
const calendarCache = new Map<string, { busy: any[]; timestamp: number }>();
const CALENDAR_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

/**
 * Get busy times from Google Calendar with timeout and caching
 * Returns array of time blocks when co-founder is unavailable
 *
 * @param startDate - Start of date range to check
 * @param endDate - End of date range to check
 * @param calendarId - Email of the calendar to check
 * @returns Array of {start, end} time blocks that are busy
 */
export async function getCalendarBusyTimes(
	startDate: Date,
	endDate: Date,
	calendarId: string
) {
	const cacheKey = `${calendarId}-${startDate.toISOString()}-${endDate.toISOString()}`;

	// Check cache first
	const cached = calendarCache.get(cacheKey);
	if (cached && Date.now() - cached.timestamp < CALENDAR_CACHE_TTL) {
		console.log("⚡ Using cached Google Calendar data");
		return cached.busy;
	}

	const calendar = google.calendar({ version: "v3", auth: oauth2Client });

	// Add timeout to prevent hanging
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error("Google Calendar API timeout")), 3000);
	});

	try {
		const response = await Promise.race([
			calendar.freebusy.query({
				requestBody: {
					timeMin: startDate.toISOString(),
					timeMax: endDate.toISOString(),
					items: [{ id: calendarId }],
				},
			}),
			timeoutPromise,
		]);

		const busy = response.data.calendars?.[calendarId]?.busy || [];

		// Cache the result
		calendarCache.set(cacheKey, { busy, timestamp: Date.now() });

		return busy;
	} catch (error) {
		console.error("⚠️ Google Calendar API error:", error);
		// Return empty array on error - we'll only use database bookings
		return [];
	}
}

/**
 * Create a new calendar event
 * This runs when someone books a consultation
 *
 * @param calendarId - Email of calendar to add event to
 * @param event - Event details (title, time, attendees, etc.)
 * @returns The created Google Calendar event with meeting link
 */
export async function createCalendarEvent(
	calendarId: string,
	event: {
		summary: string; // Event title
		description: string; // Event details/notes
		startTime: Date; // When it starts
		endTime: Date; // When it ends
		attendees: string[]; // Email addresses to invite
	}
) {
	const calendar = google.calendar({ version: "v3", auth: oauth2Client });

	const response = await calendar.events.insert({
		calendarId,
		requestBody: {
			summary: event.summary,
			description: event.description,
			start: { dateTime: event.startTime.toISOString() },
			end: { dateTime: event.endTime.toISOString() },
			attendees: event.attendees.map((email) => ({ email })),
			// Auto-create Google Meet link
			conferenceData: {
				createRequest: {
					requestId: `booking-${Date.now()}`, // Unique ID for this meeting
					conferenceSolutionKey: { type: "hangoutsMeet" }, // Use Google Meet
				},
			},
		},
		conferenceDataVersion: 1, // Required to create Meet link
	});

	return response.data; // Returns event with hangoutLink (Google Meet URL)
}

/**
 * Delete a calendar event
 * This runs when a booking is canceled
 *
 * @param calendarId - Email of calendar
 * @param eventId - Google Calendar event ID to delete
 */
export async function deleteCalendarEvent(calendarId: string, eventId: string) {
	const calendar = google.calendar({ version: "v3", auth: oauth2Client });
	await calendar.events.delete({ calendarId, eventId });
	// Clear cache when event is deleted
	clearCalendarCache();
}

/**
 * Clear the calendar cache
 * Call this after creating/deleting events to ensure fresh data
 */
export function clearCalendarCache() {
	calendarCache.clear();
	console.log("🗑️ Cleared Google Calendar cache");
}
