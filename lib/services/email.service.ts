import { Resend } from "resend";

/**
 * Email Service using Resend
 *
 * Resend is a developer-friendly email service.
 * Free tier: 3,000 emails/month (plenty for 100+ bookings)
 *
 * This file sends:
 * 1. Confirmation emails to clients
 * 2. Notification emails to co-founder
 * 3. Reminder emails (future feature)
 */

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking confirmation to client
 * This runs immediately after a booking is created
 */
export async function sendClientConfirmation(params: {
	clientName: string;
	clientEmail: string;
	scheduledAt: Date;
	meetingLink: string;
}) {
	const { clientName, clientEmail, scheduledAt, meetingLink } = params;

	// Format the date nicely
	const formattedDate = scheduledAt.toLocaleString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short",
	});

	try {
		await resend.emails.send({
			from: process.env.FROM_EMAIL!,
			to: clientEmail,
			subject: "Your Consultation is Confirmed! 🎉",
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { 
              display: inline-block; 
              background: #6366f1; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 6px;
              margin: 20px 0;
            }
            .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Consultation Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${clientName},</p>
              
              <p>Great news! Your consultation with <strong>Cher Digital Analytics</strong> has been scheduled.</p>
              
              <div class="details">
                <h3>📅 Meeting Details</h3>
                <p><strong>Date & Time:</strong><br/>${formattedDate}</p>
                <p><strong>Duration:</strong> 1 hour</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${meetingLink}" class="button">Join Google Meet</a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                <strong>What to expect:</strong><br/>
                We'll discuss your analytics needs and how we can help your business grow with simple, actionable insights.
              </p>
              
              <p style="color: #666; font-size: 14px;">
                We've also sent you a Google Calendar invite. Looking forward to speaking with you!
              </p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;"/>
              
              <p style="color: #999; font-size: 12px;">
                Need to reschedule? Reply to this email and we'll work it out!
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
		});

		console.log(`✅ Confirmation email sent to ${clientEmail}`);
	} catch (error) {
		console.error("❌ Failed to send client confirmation:", error);
		throw error;
	}
}

/**
 * Send new booking notification to co-founder
 * Alerts her that someone just booked
 */
export async function sendCofounderNotification(params: {
	cofounderEmail: string;
	clientName: string;
	clientEmail: string;
	clientPhone: string | null;
	scheduledAt: Date;
	notes: string | null;
	meetingLink: string;
}) {
	const {
		cofounderEmail,
		clientName,
		clientEmail,
		clientPhone,
		scheduledAt,
		notes,
		meetingLink,
	} = params;

	const formattedDate = scheduledAt.toLocaleString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short",
	});

	try {
		await resend.emails.send({
			from: process.env.FROM_EMAIL!,
			to: cofounderEmail,
			subject: `New Booking: ${clientName} - ${scheduledAt.toLocaleDateString()}`,
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .client-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .info-row { margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
            .button { 
              display: inline-block; 
              background: #10b981; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Consultation Booked!</h1>
            </div>
            <div class="content">
              <p>You have a new consultation scheduled.</p>
              
              <div class="client-info">
                <h3>👤 Client Information</h3>
                <div class="info-row">
                  <span class="label">Name:</span> ${clientName}
                </div>
                <div class="info-row">
                  <span class="label">Email:</span> <a href="mailto:${clientEmail}">${clientEmail}</a>
                </div>
                <div class="info-row">
                  <span class="label">Phone:</span> ${
										clientPhone || "Not provided"
									}
                </div>
                <div class="info-row">
                  <span class="label">Scheduled:</span> ${formattedDate}
                </div>
                ${
									notes
										? `
                <div class="info-row">
                  <span class="label">Notes:</span><br/>
                  <p style="margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px;">
                    ${notes}
                  </p>
                </div>
                `
										: ""
								}
              </div>
              
              <div style="text-align: center;">
                <a href="${meetingLink}" class="button">Join Google Meet</a>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                This event has been added to your Google Calendar with a Meet link.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
		});

		console.log(`✅ Notification email sent to ${cofounderEmail}`);
	} catch (error) {
		console.error("❌ Failed to send cofounder notification:", error);
		throw error;
	}
}

/**
 * Send cancellation email to client
 * For future use when implementing cancellation feature
 */
export async function sendCancellationEmail(params: {
	clientName: string;
	clientEmail: string;
	scheduledAt: Date;
}) {
	const { clientName, clientEmail, scheduledAt } = params;

	const formattedDate = scheduledAt.toLocaleString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});

	try {
		await resend.emails.send({
			from: process.env.FROM_EMAIL!,
			to: clientEmail,
			subject: "Booking Cancelled - Cher Digital Analytics",
			html: `
        <h2>Booking Cancelled</h2>
        <p>Hi ${clientName},</p>
        <p>Your consultation scheduled for <strong>${formattedDate}</strong> has been cancelled.</p>
        <p>If you'd like to reschedule, please visit our website or reply to this email.</p>
        <p>Thank you!</p>
      `,
		});

		console.log(`✅ Cancellation email sent to ${clientEmail}`);
	} catch (error) {
		console.error("❌ Failed to send cancellation email:", error);
		throw error;
	}
}
