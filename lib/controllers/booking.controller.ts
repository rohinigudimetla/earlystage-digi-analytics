import { UserModel, BookingModel } from "../models";
import {
	createCalendarEvent,
	setCredentials,
	clearCalendarCache,
} from "../services/google-calendar.service";
import {
	sendClientConfirmation,
	sendCofounderNotification,
} from "../services/email.service";

/**
 * Booking Controller
 * Business logic for creating and managing bookings
 */

export interface CreateBookingDTO {
	date: string; // "2025-10-20"
	time: string; // "9:00 AM"
	clientName: string;
	clientEmail: string;
	clientPhone?: string;
	message?: string;
}

export class BookingController {
	/**
	 * Create a new booking
	 */
	static async createBooking(data: CreateBookingDTO): Promise<{
		success: boolean;
		booking: any;
		meetingLink: string;
		message: string;
	}> {
		console.log(`📝 New booking request from ${data.clientEmail}`);

		// Convert date + time into a proper timestamp
		const scheduledTime = this.parseDateTime(data.date, data.time);

		if (!scheduledTime) {
			throw new Error("Invalid date or time format");
		}

		console.log(
			`📅 Booking requested for: ${scheduledTime.toISOString()} (${
				data.date
			} at ${data.time})`
		);

		// Get co-founder user record
		const user = await UserModel.getPrimaryUser();

		if (!user) {
			throw new Error("System not configured. Please contact support.");
		}

		// Double-check availability (prevent race condition)
		const existingBooking = await BookingModel.findByDateTime(
			user.id,
			data.date,
			data.time
		);

		if (existingBooking) {
			console.log(`⚠️ Slot already booked!`);
			throw new Error(
				"This time slot is no longer available. Please choose another time."
			);
		}

		console.log(`✅ Slot is available, proceeding with booking`);

		// Create Google Calendar event
		let calendarEvent;
		let meetingLink = "TBD";

		if (user.google_refresh_token && user.google_calendar_id) {
			try {
				setCredentials(user.google_refresh_token);
				const endTime = new Date(scheduledTime.getTime() + 60 * 60 * 1000); // +1 hour

				console.log(`📆 Creating Google Calendar event...`);

				calendarEvent = await createCalendarEvent(user.google_calendar_id, {
					summary: `Consultation: ${data.clientName}`,
					description: `
Client: ${data.clientName}
Email: ${data.clientEmail}
Phone: ${data.clientPhone || "Not provided"}
Message: ${data.message || "None"}
					`.trim(),
					startTime: scheduledTime,
					endTime,
					attendees: [data.clientEmail, user.email],
				});

				meetingLink = calendarEvent.hangoutLink || "TBD";
				console.log(`✅ Google Calendar event created with Meet link`);

				// Clear calendar cache after creating event
				clearCalendarCache();
			} catch (error) {
				console.error("⚠️ Failed to create calendar event:", error);
			}
		}

		// Create booking in database
		console.log(`💾 Saving booking to database...`);

		const booking = await BookingModel.create({
			user_id: user.id,
			client_name: data.clientName,
			client_email: data.clientEmail,
			client_phone: data.clientPhone || null,
			scheduled_date: data.date,
			scheduled_time: data.time,
			message: data.message || null,
			google_event_id: calendarEvent?.id || null,
		});

		console.log(`✅ Booking saved with ID: ${booking.id}`);

		// Send confirmation emails
		console.log(`📧 Sending confirmation emails...`);
		console.log(`📧 Co-founder email: ${user.email}`);
		console.log(`📧 Client email: ${data.clientEmail}`);

		try {
			await sendClientConfirmation({
				clientName: data.clientName,
				clientEmail: data.clientEmail,
				scheduledAt: scheduledTime,
				meetingLink,
			});

			await sendCofounderNotification({
				cofounderEmail: user.email,
				clientName: data.clientName,
				clientEmail: data.clientEmail,
				clientPhone: data.clientPhone || null,
				scheduledAt: scheduledTime,
				notes: data.message || null,
				meetingLink,
			});

			console.log(`✅ Confirmation emails sent successfully`);
		} catch (emailError) {
			console.error(
				"⚠️ Failed to send emails (but booking was created):",
				emailError
			);
		}

		return {
			success: true,
			booking: {
				id: booking.id,
				scheduledAt: scheduledTime.toISOString(),
				meetingLink,
			},
			meetingLink,
			message: "Booking confirmed! Check your email for details.",
		};
	}

	/**
	 * Get all bookings (for admin dashboard)
	 */
	static async getAllBookings() {
		const bookings = await BookingModel.findAll();
		return { bookings };
	}

	/**
	 * Helper: Convert date + time strings into a Date object
	 */
	private static parseDateTime(dateStr: string, timeStr: string): Date | null {
		try {
			const [year, month, day] = dateStr.split("-").map(Number);
			const [time, period] = timeStr.split(" ");
			const [hours, minutes] = time.split(":").map(Number);

			let hour24 = hours;
			if (period === "PM" && hours !== 12) {
				hour24 = hours + 12;
			} else if (period === "AM" && hours === 12) {
				hour24 = 0;
			}

			return new Date(year, month - 1, day, hour24, minutes, 0, 0);
		} catch (error) {
			console.error("❌ Failed to parse date/time:", error);
			return null;
		}
	}
}
