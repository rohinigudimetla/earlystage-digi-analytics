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
	const url = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: [
			"https://www.googleapis.com/auth/calendar",
			"https://www.googleapis.com/auth/userinfo.email",
			"openid",
		],
		prompt: "consent", // Force to get refresh token
	});

	return NextResponse.redirect(url);
}
