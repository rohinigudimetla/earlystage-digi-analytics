import { NextRequest, NextResponse } from "next/server";
import { AvailabilityController } from "@/lib/controllers";
import { PerformanceMonitor } from "@/lib/utils/performance";

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
 *   "slots": [
 *     { "time": "9:00 AM", "timestamp": "2025-10-20T09:00:00Z", "available": true },
 *     { "time": "10:00 AM", "timestamp": "2025-10-20T10:00:00Z", "available": false },
 *     { "time": "11:00 AM", "timestamp": "2025-10-20T11:00:00Z", "available": true }
 *   ]
 * }
 */

export async function GET(request: NextRequest) {
	PerformanceMonitor.start("total-request");

	try {
		const searchParams = request.nextUrl.searchParams;
		const dateParam = searchParams.get("date");

		if (!dateParam) {
			return NextResponse.json(
				{ error: "Date parameter is required. Use format: ?date=YYYY-MM-DD" },
				{ status: 400 }
			);
		}

		PerformanceMonitor.start("controller");
		const result = await AvailabilityController.getAvailableSlots(dateParam);
		PerformanceMonitor.end("controller");

		PerformanceMonitor.end("total-request");

		return NextResponse.json(result);
	} catch (error: any) {
		console.error("❌ Availability API error:", error);
		PerformanceMonitor.end("total-request");
		return NextResponse.json(
			{ error: "Failed to fetch availability", details: error.message },
			{ status: 500 }
		);
	}
}
