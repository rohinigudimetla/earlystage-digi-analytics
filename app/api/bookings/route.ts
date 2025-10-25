import { NextRequest, NextResponse } from "next/server";
import { BookingController } from "@/lib/controllers";
import { z } from "zod";

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
const bookingSchema = z.object({
	date: z.string(),
	time: z.string(),
	clientName: z.string().min(2, "Name must be at least 2 characters"),
	clientEmail: z.string().email("Valid email required"),
	clientPhone: z.string().optional(),
	message: z.string().optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const validated = bookingSchema.parse(body);

		const result = await BookingController.createBooking({
			date: validated.date,
			time: validated.time,
			clientName: validated.clientName,
			clientEmail: validated.clientEmail,
			clientPhone: validated.clientPhone,
			message: validated.message,
		});

		return NextResponse.json(result);
	} catch (error: any) {
		console.error("❌ Booking API error:", error);

		// Handle validation errors from Zod
		if (error.name === "ZodError") {
			return NextResponse.json(
				{ error: "Invalid booking data", details: error.errors },
				{ status: 400 }
			);
		}

		// Handle business logic errors
		if (
			error.message.includes("no longer available") ||
			error.message.includes("System not configured")
		) {
			return NextResponse.json({ error: error.message }, { status: 409 });
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
		const result = await BookingController.getAllBookings();
		return NextResponse.json(result);
	} catch (error: any) {
		console.error("❌ Failed to fetch bookings:", error);
		return NextResponse.json(
			{ error: "Failed to fetch bookings" },
			{ status: 500 }
		);
	}
}
