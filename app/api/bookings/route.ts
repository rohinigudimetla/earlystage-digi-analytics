import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createCalendarEvent, setCredentials } from "@/lib/google-calendar";
import { sendClientConfirmation, sendCofounderNotification } from "@/lib/email";
import { z } from "zod";

/**
 * Helper function to convert date + time strings into a Date object
 * Example: "2025-10-20" + "2:00 PM" -> Date object for Oct 20, 2025 at 2:00 PM
 */
function parseDateTime(dateStr: string, timeStr: string): Date | null {
	try {
		// Parse date (format: "2025-10-20")
		const [year, month, day] = dateStr.split("-").map(Number);

		// Parse time (format: "9:00 AM" or "2:00 PM")
		const [time, period] = timeStr.split(" ");
		const [hours, minutes] = time.split(":").map(Number);

		// Convert to 24-hour format
		let hour24 = hours;
		if (period === "PM" && hours !== 12) {
			hour24 = hours + 12;
		} else if (period === "AM" && hours === 12) {
			hour24 = 0;
		}

		// Create Date object in local timezone
		return new Date(year, month - 1, day, hour24, minutes, 0, 0);
	} catch (error) {
		console.error("❌ Failed to parse date/time:", error);
		return null;
	}
}

/**
 * POST /api/bookings
 *
 * This API endpoint creates a new booking.
 *
 * HOW IT WORKS:
 * 1. Validate the request data
 * 2. Double-check the time slot is still available (prevent race conditions)
 * 3. Create Google Calendar event with Meet link
 * 4. Save booking to database
 * 5. Send confirmation emails to client and co-founder
 *
 * EXAMPLE REQUEST:
 * POST /api/bookings
 * {
 *   "date": "2025-10-20",
 *   "time": "2:00 PM",
 *   "clientName": "John Doe",
 *   "clientEmail": "john@example.com",
 *   "clientPhone": "+1234567890",
 *   "message": "Interested in analytics dashboard"
 * }
 */

// Data validation schema using Zod
// Frontend sends date and time separately, we combine them into a timestamp
const bookingSchema = z.object({
	date: z.string(), // Format: "2025-10-20"
	time: z.string(), // Format: "9:00 AM"
	clientName: z.string().min(2, "Name must be at least 2 characters"),
	clientEmail: z.string().email("Valid email required"),
	clientPhone: z.string().optional(),
	message: z.string().optional(),
});

export async function POST(request: NextRequest) {
	try {
		// STEP 1: Parse and validate request body
		const body = await request.json();
		const validated = bookingSchema.parse(body);

		console.log(`📝 New booking request from ${validated.clientEmail}`);

		// Convert date + time into a proper timestamp
		// Example: "2025-10-20" + "2:00 PM" -> Date object
		const scheduledTime = parseDateTime(validated.date, validated.time);

		if (!scheduledTime) {
			return NextResponse.json(
				{ error: "Invalid date or time format" },
				{ status: 400 }
			);
		}

		console.log(
			`📅 Booking requested for: ${scheduledTime.toISOString()} (${
				validated.date
			} at ${validated.time})`
		);

		// STEP 2: Get co-founder user record
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

		// STEP 3: Double-check availability (prevent race condition)
		// Someone else might have booked this slot 1 second ago!
		const { data: existingBooking } = await supabaseAdmin
			.from("bookings")
			.select("*")
			.eq("user_id", user.id)
			.eq("scheduled_date", validated.date)
			.eq("scheduled_time", validated.time)
			.eq("status", "confirmed")
			.maybeSingle();

		if (existingBooking) {
			console.log(`⚠️ Slot already booked!`);
			return NextResponse.json(
				{
					error:
						"This time slot is no longer available. Please choose another time.",
				},
				{ status: 409 } // 409 = Conflict
			);
		}

		console.log(`✅ Slot is available, proceeding with booking`);

		// STEP 4: Create Google Calendar event
		let calendarEvent;
		let meetingLink = "TBD";

		if (user.google_refresh_token && user.google_calendar_id) {
			try {
				setCredentials(user.google_refresh_token);
				const endTime = new Date(scheduledTime.getTime() + 60 * 60 * 1000); // +1 hour

				console.log(`📆 Creating Google Calendar event...`);

				calendarEvent = await createCalendarEvent(user.google_calendar_id, {
					summary: `Consultation: ${validated.clientName}`,
					description: `
Client: ${validated.clientName}
Email: ${validated.clientEmail}
Phone: ${validated.clientPhone || "Not provided"}
Message: ${validated.message || "None"}
          `.trim(),
					startTime: scheduledTime,
					endTime,
					attendees: [validated.clientEmail, user.email],
				});

				meetingLink = calendarEvent.hangoutLink || "TBD";
				console.log(`✅ Google Calendar event created with Meet link`);
			} catch (error) {
				console.error("⚠️ Failed to create calendar event:", error);
				// Continue anyway - we'll send the meeting link later
			}
		}

		// STEP 5: Create booking in database
		console.log(`💾 Saving booking to database...`);

		const { data: booking, error: bookingError } = await supabaseAdmin
			.from("bookings")
			.insert({
				user_id: user.id,
				client_name: validated.clientName,
				client_email: validated.clientEmail,
				client_phone: validated.clientPhone || null,
				scheduled_date: validated.date, // Store as date: "2025-10-20"
				scheduled_time: validated.time, // Store as time: "11:00 AM"
				status: "confirmed",
				message: validated.message || null,
				google_event_id: calendarEvent?.id || null,
			})
			.select()
			.single();

		if (bookingError) {
			console.error("❌ Failed to save booking:", bookingError);
			throw bookingError;
		}

		console.log(`✅ Booking saved with ID: ${booking.id}`);

		// STEP 6: Send confirmation emails
		console.log(`📧 Sending confirmation emails...`);

		try {
			// Email to client
			await sendClientConfirmation({
				clientName: validated.clientName,
				clientEmail: validated.clientEmail,
				scheduledAt: scheduledTime,
				meetingLink,
			});

			// Email to co-founder
			await sendCofounderNotification({
				cofounderEmail: user.email,
				clientName: validated.clientName,
				clientEmail: validated.clientEmail,
				clientPhone: validated.clientPhone || null,
				scheduledAt: scheduledTime,
				notes: validated.message || null,
				meetingLink,
			});

			console.log(`✅ Confirmation emails sent successfully`);
		} catch (emailError) {
			console.error(
				"⚠️ Failed to send emails (but booking was created):",
				emailError
			);
			// Don't fail the request - booking was successful
		}

		// STEP 7: Return success response
		return NextResponse.json({
			success: true,
			booking: {
				id: booking.id,
				scheduledAt: booking.scheduled_at,
				meetingLink,
			},
			message: "Booking confirmed! Check your email for details.",
		});
	} catch (error: any) {
		console.error("❌ Booking API error:", error);

		// Handle validation errors from Zod
		if (error.name === "ZodError") {
			return NextResponse.json(
				{ error: "Invalid booking data", details: error.errors },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to create booking", details: error.message },
			{ status: 500 }
		);
	}
}

/**
 * GET /api/bookings
 *
 * Admin endpoint to list all bookings
 * (For future admin dashboard)
 */
export async function GET(request: NextRequest) {
	try {
		const { data: bookings, error } = await supabaseAdmin
			.from("bookings")
			.select("*")
			.order("scheduled_date", { ascending: true })
			.order("scheduled_time", { ascending: true });

		if (error) throw error;

		return NextResponse.json({ bookings });
	} catch (error: any) {
		console.error("❌ Failed to fetch bookings:", error);
		return NextResponse.json(
			{ error: "Failed to fetch bookings" },
			{ status: 500 }
		);
	}
}
