import { NextResponse } from "next/server";
import { google } from "googleapis";

function getOAuth2Client() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	const appUrl = process.env.NEXT_PUBLIC_APP_URL;

	if (!clientId || !clientSecret || !appUrl) {
		throw new Error("Google OAuth credentials not configured");
	}

	return new google.auth.OAuth2(
		clientId,
		clientSecret,
		appUrl + "/api/auth/callback/google"
	);
}

export async function GET() {
	const oauth2Client = getOAuth2Client();

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
