import { NextResponse } from "next/server";
import {
	sendAuditRequestNotification,
	sendAuditConfirmation,
} from "@/lib/services/email.service";

/**
 * POST /api/audit
 * Handle free audit requests
 *
 * This endpoint:
 * 1. Validates the form data
 * 2. Sends notification email to the business owner
 * 3. Sends confirmation email to the client
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { businessName, website, email, phone } = body;

		// Validate required fields
		if (!businessName || !website || !email || !phone) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ error: "Invalid email format" },
				{ status: 400 }
			);
		}

		// Validate website URL format
		const urlRegex = /^https?:\/\/.+/;
		if (!urlRegex.test(website)) {
			return NextResponse.json(
				{ error: "Invalid website URL. Must start with http:// or https://" },
				{ status: 400 }
			);
		}

		console.log("📧 Attempting to send audit emails...");
		console.log("Environment check:", {
			hasResendKey: !!process.env.RESEND_API_KEY,
			hasFromEmail: !!process.env.FROM_EMAIL,
			hasCofounderEmail: !!process.env.COFOUNDER_EMAIL,
			cofounderEmail: process.env.COFOUNDER_EMAIL,
		});

		// Send notification to the business owner
		await sendAuditRequestNotification({
			businessName,
			website,
			email,
			phone,
		});

		// Send confirmation to client
		await sendAuditConfirmation({
			businessName,
			email,
		});

		console.log("✅ Both audit emails sent successfully");

		return NextResponse.json(
			{
				success: true,
				message: "Audit request submitted successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("❌ Error processing audit request:", error);
		return NextResponse.json(
			{
				error: "Failed to process audit request. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
