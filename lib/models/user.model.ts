import { supabaseAdmin } from "../supabase";
import { User } from "./types";

/**
 * User Model
 * Handles all database operations for users
 */

export class UserModel {
	/**
	 * Find user by ID
	 */
	static async findById(id: string): Promise<User | null> {
		const { data, error } = await supabaseAdmin
			.from("users")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (error) throw error;
		return data;
	}

	/**
	 * Find user by email
	 */
	static async findByEmail(email: string): Promise<User | null> {
		const { data, error } = await supabaseAdmin
			.from("users")
			.select("*")
			.eq("email", email)
			.maybeSingle();

		if (error) throw error;
		return data;
	}

	/**
	 * Get the primary user (co-founder)
	 * Assumes there's only one user in the system
	 */
	static async getPrimaryUser(): Promise<User | null> {
		const { data, error } = await supabaseAdmin
			.from("users")
			.select("*")
			.single();

		if (error) throw error;
		return data;
	}

	/**
	 * Update user's Google credentials
	 */
	static async updateGoogleCredentials(
		userId: string,
		refreshToken: string,
		calendarId: string
	): Promise<User> {
		const { data, error } = await supabaseAdmin
			.from("users")
			.update({
				google_refresh_token: refreshToken,
				google_calendar_id: calendarId,
			})
			.eq("id", userId)
			.select()
			.single();

		if (error) throw error;
		return data;
	}
}
