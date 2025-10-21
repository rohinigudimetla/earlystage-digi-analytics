import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCalendarBusyTimes, setCredentials } from "@/lib/google-calendar";
import {
	startOfDay,
	endOfDay,
	setHours,
	setMinutes,
	format,
	isBefore,
	addHours,
} from "date-fns";

/**
 * GET /api/availability?date=YYYY-MM-DD
 *
 * This API endpoint returns available time slots for a specific date.
 *
 * HOW IT WORKS:
 * 1. Get co-founder's weekly schedule (e.g., "Monday 9am-5pm")
 * 2. Check Google Calendar for existing meetings/events
 * 3. Check database for bookings already made
 * 4. Check database for manually blocked times (vacations, etc.)
 * 5. Combine all this data to return only AVAILABLE slots
 *
 * EXAMPLE RESPONSE:
 * {
 *   "date": "2025-10-20",
 *   "availableSlots": [
 *     { "time": "9:00 AM", "timestamp": "2025-10-20T09:00:00Z", "available": true },
 *     { "time": "10:00 AM", "timestamp": "2025-10-20T10:00:00Z", "available": false },
 *     { "time": "11:00 AM", "timestamp": "2025-10-20T11:00:00Z", "available": true }
 *   ]
 * }
 */

export async function GET(request: NextRequest) {
	try {
		// STEP 1: Get the date from URL parameter
		const searchParams = request.nextUrl.searchParams;
		const dateParam = searchParams.get("date"); // e.g., "2025-10-20"

		if (!dateParam) {
			return NextResponse.json(
				{ error: "Date parameter is required. Use format: ?date=YYYY-MM-DD" },
				{ status: 400 }
			);
		}

		// Parse date correctly to avoid timezone issues
		// "2025-10-20" should be treated as local date, not UTC
		const [year, month, day] = dateParam.split("-").map(Number);
		const targetDate = new Date(year, month - 1, day); // month is 0-indexed
		const dayOfWeek = targetDate.getDay(); // 0=Sunday, 1=Monday, etc.

		console.log(`📅 Checking availability for ${dateParam} (day ${dayOfWeek})`);

		// STEP 2: Get co-founder's user record from database
		const { data: user, error: userError } = await supabaseAdmin
			.from("users")
			.select("*")
			.single();

		if (userError || !user) {
			console.error("❌ User not found:", userError);
			return NextResponse.json(
				{ error: "System not configured. Please contact support." },
				{ status: 500 }
			);
		}

		console.log(`👤 Found user: ${user.email}`);

		// STEP 3: Get availability rules for this day of week
		// For example: "Every Monday from 9am-5pm"
		const { data: rules, error: rulesError } = await supabaseAdmin
			.from("availability_rules")
			.select("*")
			.eq("user_id", user.id)
			.eq("day_of_week", dayOfWeek);

		if (rulesError) {
			console.error("❌ Error fetching rules:", rulesError);
			return NextResponse.json(
				{ error: "Failed to fetch availability rules" },
				{ status: 500 }
			);
		}

		// If no rules set for this day, return empty
		if (!rules || rules.length === 0) {
			console.log(`⚠️ No availability rules set for day ${dayOfWeek}`);
			return NextResponse.json({
				date: dateParam,
				availableSlots: [],
				message: "No availability set for this day of the week",
			});
		}

		console.log(`✅ Found ${rules.length} availability rule(s)`);

		// STEP 4: Get blocked slots for this specific date
		// These are manual overrides (vacations, sick days, etc.)
		const { data: blockedSlots } = await supabaseAdmin
			.from("blocked_slots")
			.select("*")
			.eq("user_id", user.id)
			.eq("blocked_date", dateParam);

		console.log(`🚫 Found ${blockedSlots?.length || 0} blocked slot(s)`);

		// STEP 5: Get existing bookings for this date
		const { data: bookings } = await supabaseAdmin
			.from("bookings")
			.select("*")
			.eq("user_id", user.id)
			.eq("scheduled_date", dateParam)
			.eq("status", "confirmed");

		console.log(`📅 Found ${bookings?.length || 0} existing booking(s)`);
		if (bookings && bookings.length > 0) {
			console.log(
				`   Booked times: ${bookings.map((b) => b.scheduled_time).join(", ")}`
			);
		}

		// STEP 6: Get Google Calendar busy times
		let busyTimes: any[] = [];
		if (user.google_refresh_token && user.google_calendar_id) {
			try {
				setCredentials(user.google_refresh_token);
				busyTimes = await getCalendarBusyTimes(
					startOfDay(targetDate),
					endOfDay(targetDate),
					user.google_calendar_id
				);
				console.log(
					`📆 Google Calendar shows ${busyTimes.length} busy time(s)`
				);
			} catch (error) {
				console.error("⚠️ Failed to fetch Google Calendar busy times:", error);
				// Continue without Google Calendar data (use database only)
			}
		}

		// STEP 7: Generate time slots from availability rules
		const slots = [];

		for (const rule of rules) {
			// Parse start/end times (e.g., "09:00:00" -> 9 hours, 0 minutes)
			const [startHour, startMin] = rule.start_time.split(":").map(Number);
			const [endHour, endMin] = rule.end_time.split(":").map(Number);

			// Create Date objects for start and end of availability window
			let currentTime = setMinutes(setHours(targetDate, startHour), startMin);
			const endTime = setMinutes(setHours(targetDate, endHour), endMin);

			// Generate hourly slots (9am, 10am, 11am, etc.)
			while (isBefore(currentTime, endTime)) {
				// Check if this slot is available

				// Check 1: Is it blocked manually?
				const isBlocked = blockedSlots?.some((block) => {
					if (!block.start_time || !block.end_time) return false; // Whole day block
					const blockStart = new Date(`${dateParam}T${block.start_time}`);
					const blockEnd = new Date(`${dateParam}T${block.end_time}`);
					return blockStart <= currentTime && blockEnd > currentTime;
				});

				// Check 2: Is there already a booking at this exact time?
				// Database stores time as "15:00:00" (24-hour), convert to match
				const currentTimeIn24Hour = format(currentTime, "HH:mm:ss"); // "15:00:00"
				const isBooked = bookings?.some(
					(booking) => booking.scheduled_time === currentTimeIn24Hour
				);

				// Debug logging
				if (isBooked) {
					console.log(
						`   🔴 ${format(
							currentTime,
							"h:mm a"
						)} (${currentTimeIn24Hour}) is BOOKED`
					);
				} // Check 3: Is co-founder busy on Google Calendar?
				const isBusy = busyTimes.some(
					(busy: any) =>
						new Date(busy.start) <= currentTime &&
						new Date(busy.end) > currentTime
				);

				// Slot is available ONLY if all checks pass
				const available = !isBlocked && !isBooked && !isBusy;

				slots.push({
					time: format(currentTime, "h:mm a"), // "9:00 AM"
					timestamp: currentTime.toISOString(), // "2025-10-20T09:00:00.000Z"
					available,
				});

				// Move to next hour
				currentTime = addHours(currentTime, 1);
			}
		}

		console.log(
			`✅ Generated ${slots.length} total slot(s), ${
				slots.filter((s) => s.available).length
			} available`
		);

		return NextResponse.json({
			date: dateParam,
			slots: slots, // Changed from availableSlots to slots to match frontend
		});
	} catch (error: any) {
		console.error("❌ Availability API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch availability", details: error.message },
			{ status: 500 }
		);
	}
}
