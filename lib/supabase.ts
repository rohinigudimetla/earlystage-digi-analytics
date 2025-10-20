import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client
 *
 * This file creates a connection to your Supabase database.
 * Supabase is like a simplified PostgreSQL database with a nice API.
 *
 * We use two types of clients:
 * 1. Public client - For frontend (limited permissions)
 * 2. Service client - For backend (full admin access)
 */

//  ============================================
//  PUBLIC CLIENT (Frontend - Browser)
//  ============================================
// This client is used in browser/client components
// It has Row Level Security (RLS) which means users can only
// see/modify data they're allowed to

export const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

//  ============================================
//  SERVICE CLIENT (Backend - API Routes)
//  ============================================
// This client bypasses RLS and has full admin access
// ONLY use this in API routes (server-side), NEVER in browser

export const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	}
);

/**
 * Database Types (TypeScript)
 * These help with autocomplete and type safety
 */

export type Booking = {
	id: string;
	user_id: string;
	client_name: string;
	client_email: string;
	client_phone: string | null;
	scheduled_at: string;
	duration_minutes: number;
	status: "confirmed" | "cancelled" | "completed" | "no-show";
	notes: string | null;
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
	start_time: string;
	end_time: string;
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
