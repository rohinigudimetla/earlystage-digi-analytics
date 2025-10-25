import { supabaseAdmin } from "../supabase";
import { Booking } from "./types";

/**
 * Booking Model
 * Handles all database operations for bookings
 */

export class BookingModel {
	/**
	 * Find a booking by ID
	 */
	static async findById(id: string): Promise<Booking | null> {
		const { data, error } = await supabaseAdmin
			.from("bookings")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) throw error;
		return data;
	}

	/**
	 * Find all bookings for a specific date
	 */
	static async findByDate(
		userId: string,
		date: string
	): Promise<Booking[] | null> {
		const { data, error } = await supabaseAdmin
			.from("bookings")
			.select("*")
			.eq("user_id", userId)
			.eq("scheduled_date", date)
			.eq("status", "confirmed");

		if (error) throw error;
		return data;
	}

	/**
	 * Find a booking by date and time
	 */
	static async findByDateTime(
		userId: string,
		date: string,
		time: string
	): Promise<Booking | null> {
		const { data, error } = await supabaseAdmin
			.from("bookings")
			.select("*")
			.eq("user_id", userId)
			.eq("scheduled_date", date)
			.eq("scheduled_time", time)
			.eq("status", "confirmed")
			.maybeSingle();

		if (error) throw error;
		return data;
	}

	/**
	 * Get all bookings (for admin dashboard)
	 */
	static async findAll(): Promise<Booking[] | null> {
		const { data, error } = await supabaseAdmin
			.from("bookings")
			.select("*")
			.order("scheduled_date", { ascending: true })
			.order("scheduled_time", { ascending: true });

		if (error) throw error;
		return data;
	}

	/**
	 * Create a new booking
	 */
	static async create(bookingData: {
		user_id: string;
		client_name: string;
		client_email: string;
		client_phone?: string | null;
		scheduled_date: string;
		scheduled_time: string;
		message?: string | null;
		google_event_id?: string | null;
	}): Promise<Booking> {
		const { data, error } = await supabaseAdmin
			.from("bookings")
			.insert({
				user_id: bookingData.user_id,
				client_name: bookingData.client_name,
				client_email: bookingData.client_email,
				client_phone: bookingData.client_phone || null,
				scheduled_date: bookingData.scheduled_date,
				scheduled_time: bookingData.scheduled_time,
				status: "confirmed",
				message: bookingData.message || null,
				google_event_id: bookingData.google_event_id || null,
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	/**
	 * Update booking status
	 */
	static async updateStatus(
		id: string,
		status: "confirmed" | "cancelled" | "completed" | "no-show"
	): Promise<Booking> {
		const { data, error } = await supabaseAdmin
			.from("bookings")
			.update({ status })
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	/**
	 * Delete a booking
	 */
	static async delete(id: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from("bookings")
			.delete()
			.eq("id", id);

		if (error) throw error;
	}
}
