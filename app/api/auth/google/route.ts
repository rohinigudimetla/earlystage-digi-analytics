import { NextResponse } from "next/server";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.NEXT_PUBLIC_APP_URL + "/api/auth/callback/google"
);

export async function GET() {
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
