import { supabaseAdmin } from "../supabase";
import { AvailabilityRule, BlockedSlot } from "./types";

/**
 * Availability Model
 * Handles database operations for availability rules and blocked slots
 */

export class AvailabilityModel {
	/**
	 * Get availability rules for a specific day of week
	 */
	static async getRulesForDay(
		userId: string,
		dayOfWeek: number
	): Promise<AvailabilityRule[] | null> {
		const { data, error } = await supabaseAdmin
			.from("availability_rules")
			.select("*")
			.eq("user_id", userId)
			.eq("day_of_week", dayOfWeek);

		if (error) throw error;
		return data;
	}

	/**
	 * Get all availability rules for a user
	 */
	static async getAllRules(userId: string): Promise<AvailabilityRule[] | null> {
		const { data, error } = await supabaseAdmin
			.from("availability_rules")
			.select("*")
			.eq("user_id", userId)
			.order("day_of_week", { ascending: true });

		if (error) throw error;
		return data;
	}

	/**
	 * Get blocked slots for a specific date
	 */
	static async getBlockedSlotsForDate(
		userId: string,
		date: string
	): Promise<BlockedSlot[] | null> {
		const { data, error } = await supabaseAdmin
			.from("blocked_slots")
			.select("*")
			.eq("user_id", userId)
			.eq("blocked_date", date);

		if (error) throw error;
		return data;
	}

	/**
	 * Create a new availability rule
	 */
	static async createRule(ruleData: {
		user_id: string;
		day_of_week: number;
		start_time: string;
		end_time: string;
		timezone: string;
	}): Promise<AvailabilityRule> {
		const { data, error } = await supabaseAdmin
			.from("availability_rules")
			.insert({
				user_id: ruleData.user_id,
				day_of_week: ruleData.day_of_week,
				start_time: ruleData.start_time,
				end_time: ruleData.end_time,
				timezone: ruleData.timezone,
				is_active: true,
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	/**
	 * Create a blocked slot
	 */
	static async createBlockedSlot(slotData: {
		user_id: string;
		blocked_date: string;
		start_time?: string | null;
		end_time?: string | null;
		reason?: string | null;
	}): Promise<BlockedSlot> {
		const { data, error } = await supabaseAdmin
			.from("blocked_slots")
			.insert({
				user_id: slotData.user_id,
				blocked_date: slotData.blocked_date,
				start_time: slotData.start_time || null,
				end_time: slotData.end_time || null,
				reason: slotData.reason || null,
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	}

	/**
	 * Delete a blocked slot
	 */
	static async deleteBlockedSlot(id: string): Promise<void> {
		const { error } = await supabaseAdmin
			.from("blocked_slots")
			.delete()
			.eq("id", id);

		if (error) throw error;
	}

	/**
	 * Toggle availability rule active status
	 */
	static async toggleRuleStatus(
		id: string,
		isActive: boolean
	): Promise<AvailabilityRule> {
		const { data, error } = await supabaseAdmin
			.from("availability_rules")
			.update({ is_active: isActive })
			.eq("id", id)
			.select()
			.single();

		if (error) throw error;
		return data;
	}
}
