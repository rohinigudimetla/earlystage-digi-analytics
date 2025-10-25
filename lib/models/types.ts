/**
 * Database Types (TypeScript)
 * Central type definitions for all database entities
 */

export type Booking = {
	id: string;
	user_id: string;
	client_name: string;
	client_email: string;
	client_phone: string | null;
	scheduled_date: string; // "2025-10-20"
	scheduled_time: string; // "9:00 AM" or "15:00:00"
	status: "confirmed" | "cancelled" | "completed" | "no-show";
	message: string | null;
	google_event_id: string | null;
	created_at: string;
	updated_at: string;
};

export type AvailabilityRule = {
	id: string;
	user_id: string;
	day_of_week: number; // 0-6 (Sunday-Saturday)
	start_time: string; // "09:00:00"
	end_time: string; // "17:00:00"
	timezone: string;
	is_active: boolean;
	created_at: string;
};

export type BlockedSlot = {
	id: string;
	user_id: string;
	blocked_date: string; // "2025-10-20"
	start_time: string | null; // "09:00:00"
	end_time: string | null; // "17:00:00"
	reason: string | null;
	created_at: string;
};

export type User = {
	id: string;
	email: string;
	name: string;
	google_refresh_token: string | null;
	google_calendar_id: string | null;
	created_at: string;
	updated_at: string;
};

export type TimeSlot = {
	time: string; // "9:00 AM"
	timestamp: string; // ISO string
	available: boolean;
};

export type AvailabilityResponse = {
	date: string;
	slots: TimeSlot[];
	message?: string;
};
