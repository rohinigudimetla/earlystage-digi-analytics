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
 * Database Types
 * Import from models/types.ts for type definitions
 */
export type {
	Booking,
	AvailabilityRule,
	BlockedSlot,
	User,
} from "./models/types";
