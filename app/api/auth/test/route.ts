import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
	const oauth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback/google"
	);

	const diagnostics = {
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
		redirectUri: process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback/google",
		appUrl: process.env.NEXT_PUBLIC_APP_URL,
		supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
		supabaseConfigured: !!(
			process.env.NEXT_PUBLIC_SUPABASE_URL &&
			process.env.SUPABASE_SERVICE_ROLE_KEY
		),
		authUrl: oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: ["https://www.googleapis.com/auth/calendar"],
			prompt: "consent",
		}),
	};

	return NextResponse.json(diagnostics, { status: 200 });
}
