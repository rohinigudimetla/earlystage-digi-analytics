import {
	startOfDay,
	endOfDay,
	setHours,
	setMinutes,
	format,
	isBefore,
	addHours,
} from "date-fns";
import {
	UserModel,
	BookingModel,
	AvailabilityModel,
	TimeSlot,
} from "../models";
import {
	getCalendarBusyTimes,
	setCredentials,
} from "../services/google-calendar.service";

/**
 * Availability Controller
 * Business logic for checking available time slots
 */

export class AvailabilityController {
	/**
	 * Get available time slots for a specific date
	 */
	static async getAvailableSlots(dateParam: string): Promise<{
		date: string;
		slots: TimeSlot[];
		message?: string;
	}> {
		const startTime = Date.now();

		// Parse date correctly to avoid timezone issues
		const [year, month, day] = dateParam.split("-").map(Number);
		const targetDate = new Date(year, month - 1, day);
		const dayOfWeek = targetDate.getDay();

		console.log(`📅 Checking availability for ${dateParam} (day ${dayOfWeek})`);

		// Get co-founder's user record
		const user = await UserModel.getPrimaryUser();

		if (!user) {
			throw new Error("System not configured. Please contact support.");
		}

		console.log(`👤 Found user: ${user.email}`);

		// Get availability rules for this day of week
		const rules = await AvailabilityModel.getRulesForDay(user.id, dayOfWeek);

		if (!rules || rules.length === 0) {
			console.log(`⚠️ No availability rules set for day ${dayOfWeek}`);
			return {
				date: dateParam,
				slots: [],
				message: "No availability set for this day of the week",
			};
		}

		console.log(`✅ Found ${rules.length} availability rule(s)`);

		// ⚡ OPTIMIZATION: Run all data fetching in parallel instead of sequential
		const [blockedSlots, bookings, busyTimes] = await Promise.all([
			// Fetch blocked slots
			AvailabilityModel.getBlockedSlotsForDate(user.id, dateParam),

			// Fetch existing bookings
			BookingModel.findByDate(user.id, dateParam),

			// Fetch Google Calendar busy times (with error handling)
			(async () => {
				if (user.google_refresh_token && user.google_calendar_id) {
					try {
						setCredentials(user.google_refresh_token);
						return await getCalendarBusyTimes(
							startOfDay(targetDate),
							endOfDay(targetDate),
							user.google_calendar_id
						);
					} catch (error) {
						console.error(
							"⚠️ Failed to fetch Google Calendar busy times:",
							error
						);
						return [];
					}
				}
				return [];
			})(),
		]);

		console.log(`🚫 Found ${blockedSlots?.length || 0} blocked slot(s)`);
		console.log(`📅 Found ${bookings?.length || 0} existing booking(s)`);
		if (bookings && bookings.length > 0) {
			console.log(
				`   Booked times: ${bookings.map((b) => b.scheduled_time).join(", ")}`
			);
		}
		console.log(`📆 Google Calendar shows ${busyTimes.length} busy time(s)`);

		// Generate time slots from availability rules
		const slots = this.generateTimeSlots(
			targetDate,
			dateParam,
			rules,
			blockedSlots,
			bookings,
			busyTimes
		);

		const totalTime = Date.now() - startTime;
		console.log(
			`✅ Generated ${slots.length} total slot(s), ${
				slots.filter((s) => s.available).length
			} available in ${totalTime}ms`
		);

		return {
			date: dateParam,
			slots,
		};
	}

	/**
	 * Generate hourly time slots based on rules and check availability
	 */
	private static generateTimeSlots(
		targetDate: Date,
		dateParam: string,
		rules: any[],
		blockedSlots: any[] | null,
		bookings: any[] | null,
		busyTimes: any[]
	): TimeSlot[] {
		const slots: TimeSlot[] = [];

		for (const rule of rules) {
			// Parse start/end times
			const [startHour, startMin] = rule.start_time.split(":").map(Number);
			const [endHour, endMin] = rule.end_time.split(":").map(Number);

			// Create Date objects for start and end
			let currentTime = setMinutes(setHours(targetDate, startHour), startMin);
			const endTime = setMinutes(setHours(targetDate, endHour), endMin);

			// Generate hourly slots
			while (isBefore(currentTime, endTime)) {
				// Check 1: Is it blocked manually?
				const isBlocked = blockedSlots?.some((block) => {
					if (!block.start_time || !block.end_time) return false;
					const blockStart = new Date(`${dateParam}T${block.start_time}`);
					const blockEnd = new Date(`${dateParam}T${block.end_time}`);
					return blockStart <= currentTime && blockEnd > currentTime;
				});

				// Check 2: Is there already a booking at this exact time?
				const currentTimeIn24Hour = format(currentTime, "HH:mm:ss");
				const isBooked = bookings?.some(
					(booking) => booking.scheduled_time === currentTimeIn24Hour
				);

				if (isBooked) {
					console.log(
						`   🔴 ${format(
							currentTime,
							"h:mm a"
						)} (${currentTimeIn24Hour}) is BOOKED`
					);
				}

				// Check 3: Is co-founder busy on Google Calendar?
				const isBusy = busyTimes.some(
					(busy: any) =>
						new Date(busy.start) <= currentTime &&
						new Date(busy.end) > currentTime
				);

				// Slot is available only if all checks pass
				const available = !isBlocked && !isBooked && !isBusy;

				slots.push({
					time: format(currentTime, "h:mm a"),
					timestamp: currentTime.toISOString(),
					available,
				});

				// Move to next hour
				currentTime = addHours(currentTime, 1);
			}
		}

		return slots;
	}
}
