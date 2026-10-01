import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

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

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
	process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"
);

export async function GET(request: NextRequest) {
	const oauth2Client = getOAuth2Client();
	try {
		const searchParams = request.nextUrl.searchParams;
		const code = searchParams.get("code");

		if (!code) {
			return NextResponse.json({ error: "No code provided" }, { status: 400 });
		}

		// Exchange code for tokens
		const { tokens } = await oauth2Client.getToken(code);
		const refreshToken = tokens.refresh_token;

		if (!refreshToken) {
			return NextResponse.json(
				{
					error:
						"No refresh token received. Make sure to revoke access and try again.",
				},
				{ status: 400 }
			);
		}

		// Get user email from ID token or use userinfo API as fallback
		let userEmail: string | null | undefined;

		if (tokens.id_token) {
			// Decode the ID token to get user email
			const clientId = process.env.GOOGLE_CLIENT_ID;
			if (!clientId) {
				throw new Error("GOOGLE_CLIENT_ID not configured");
			}
			const ticket = await oauth2Client.verifyIdToken({
				idToken: tokens.id_token,
				audience: clientId,
			});
			const payload = ticket.getPayload();
			userEmail = payload?.email;
		} else {
			// Fallback: use access token to get user info
			oauth2Client.setCredentials(tokens);
			const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
			const { data } = await oauth2.userinfo.get();
			userEmail = data.email;
		}

		if (!userEmail) {
			return NextResponse.json(
				{ error: "Could not get user email from token" },
				{ status: 400 }
			);
		}

		console.log("✅ Got refresh token for:", userEmail);
		console.log("🔑 Refresh Token:", refreshToken);

		// Update or insert user in database
		const { data: existingUser } = await supabase
			.from("users")
			.select("*")
			.eq("email", userEmail)
			.single();

		if (existingUser) {
			// Update existing user
			await supabase
				.from("users")
				.update({
					google_refresh_token: refreshToken,
					google_calendar_id: userEmail,
					updated_at: new Date().toISOString(),
				})
				.eq("email", userEmail);

			console.log("✅ Updated existing user in database");
		} else {
			// Create new user
			const { data: newUser, error: insertError } = await supabase
				.from("users")
				.insert({
					email: userEmail,
					name: "Admin", // Default name, can be updated later
					google_refresh_token: refreshToken,
					google_calendar_id: userEmail,
				})
				.select()
				.single();

			if (insertError) {
				console.error("❌ Database insert error:", insertError);
				throw insertError;
			}

			console.log("✅ Created new user in database");

			// Create default availability rules (Monday-Friday, 9 AM - 5 PM)
			const availabilityRules = [
				{ day_of_week: 1, start_time: "09:00:00", end_time: "17:00:00" }, // Monday
				{ day_of_week: 2, start_time: "09:00:00", end_time: "17:00:00" }, // Tuesday
				{ day_of_week: 3, start_time: "09:00:00", end_time: "17:00:00" }, // Wednesday
				{ day_of_week: 4, start_time: "09:00:00", end_time: "17:00:00" }, // Thursday
				{ day_of_week: 5, start_time: "09:00:00", end_time: "17:00:00" }, // Friday
			].map((rule) => ({
				user_id: newUser.id,
				...rule,
			}));

			const { error: rulesError } = await supabase
				.from("availability_rules")
				.insert(availabilityRules);

			if (rulesError) {
				console.error("⚠️ Failed to create availability rules:", rulesError);
				// Don't throw - user is created, they can add rules later
			} else {
				console.log("✅ Created default availability rules (Mon-Fri 9-5)");
			}
		}

		// Show success page
		return new NextResponse(
			`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Google Calendar Connected</title>
				<style>
					body {
						font-family: system-ui, -apple-system, sans-serif;
						max-width: 600px;
						margin: 100px auto;
						padding: 20px;
						text-align: center;
					}
					.success {
						background: #f0fdf4;
						border: 2px solid #86efac;
						border-radius: 8px;
						padding: 30px;
					}
					h1 { color: #15803d; margin: 0 0 10px 0; }
					p { color: #166534; margin: 10px 0; }
					code {
						background: #dcfce7;
						padding: 2px 6px;
						border-radius: 4px;
						font-size: 14px;
					}
				</style>
			</head>
			<body>
				<div class="success">
					<h1>✅ Success!</h1>
					<p>Google Calendar connected for:</p>
					<p><strong><code>${userEmail}</code></strong></p>
					<p style="margin-top: 20px;">
						Your refresh token has been saved to the database.<br>
						You can close this window and start using the booking system!
					</p>
				</div>
			</body>
			</html>
			`,
			{
				status: 200,
				headers: { "Content-Type": "text/html" },
			}
		);
	} catch (error: any) {
		console.error("❌ OAuth callback error:", error);
		return new NextResponse(
			`
			<!DOCTYPE html>
			<html>
			<head>
				<title>Error</title>
				<style>
					body {
						font-family: system-ui, -apple-system, sans-serif;
						max-width: 600px;
						margin: 100px auto;
						padding: 20px;
						text-align: center;
					}
					.error {
						background: #fef2f2;
						border: 2px solid #fca5a5;
						border-radius: 8px;
						padding: 30px;
					}
					h1 { color: #dc2626; margin: 0 0 10px 0; }
					p { color: #991b1b; margin: 10px 0; }
				</style>
			</head>
			<body>
				<div class="error">
					<h1>❌ Error</h1>
					<p>${error.message}</p>
					<p style="margin-top: 20px;">
						<a href="/api/auth/google">Try again</a>
					</p>
				</div>
			</body>
			</html>
			`,
			{
				status: 500,
				headers: { "Content-Type": "text/html" },
			}
		);
	}
}
