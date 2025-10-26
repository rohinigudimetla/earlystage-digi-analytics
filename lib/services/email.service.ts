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

/**
 * Send free audit request notification to Charishma
 * Alerts her when someone requests a free website audit
 */
export async function sendAuditRequestNotification(params: {
	businessName: string;
	website: string;
	email: string;
	phone: string;
}) {
	const { businessName, website, email, phone } = params;

	try {
		await resend.emails.send({
			from: process.env.FROM_EMAIL!,
			to: process.env.COFOUNDER_EMAIL!,
			subject: `🎯 New Audit Request: ${businessName}`,
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #c49797; color: #1b1b1d; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f6e3; padding: 30px; border-radius: 0 0 8px 8px; }
            .client-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border: 2px solid #c49797; }
            .info-row { margin: 15px 0; padding: 10px; border-bottom: 1px solid #f0f0f0; }
            .info-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #834a49; display: block; margin-bottom: 5px; }
            .value { color: #1b1b1d; font-size: 16px; }
            .website-link { 
              display: inline-block; 
              background: #3d4436; 
              color: #f8f6e3; 
              padding: 10px 20px; 
              text-decoration: none; 
              border-radius: 6px;
              margin: 10px 0;
            }
            .footer { 
              margin-top: 20px; 
              padding: 20px; 
              background: #3d4436; 
              color: #f8f6e3; 
              border-radius: 6px; 
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Free Audit Request!</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #834a49; font-weight: bold;">
                Someone just requested a free website audit!
              </p>
              
              <div class="client-info">
                <h3 style="color: #834a49; margin-top: 0;">📋 Business Details</h3>
                
                <div class="info-row">
                  <span class="label">Business Name:</span>
                  <span class="value">${businessName}</span>
                </div>
                
                <div class="info-row">
                  <span class="label">Website:</span>
                  <div style="margin-top: 8px;">
                    <a href="${website}" class="website-link" target="_blank">
                      Visit Website 🔗
                    </a>
                  </div>
                  <span class="value" style="display: block; margin-top: 5px; font-size: 14px; color: #666;">
                    ${website}
                  </span>
                </div>
                
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value">
                    <a href="mailto:${email}" style="color: #834a49; text-decoration: underline;">
                      ${email}
                    </a>
                  </span>
                </div>
                
                <div class="info-row">
                  <span class="label">Phone:</span>
                  <span class="value">
                    <a href="tel:${phone}" style="color: #834a49; text-decoration: underline;">
                      ${phone}
                    </a>
                  </span>
                </div>
              </div>
              
              <div class="footer">
                <p style="margin: 0; font-size: 14px;">
                  💡 <strong>Next Steps:</strong> Review their website and reach out within 24 hours to schedule the audit call.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
		});

		console.log(
			`✅ Audit request notification sent to ${process.env.COFOUNDER_EMAIL}`
		);
	} catch (error) {
		console.error("❌ Failed to send audit request notification:", error);
		throw error;
	}
}

/**
 * Send audit confirmation to client
 * Confirms their audit request was received
 */
export async function sendAuditConfirmation(params: {
	businessName: string;
	email: string;
}) {
	const { businessName, email } = params;

	try {
		await resend.emails.send({
			from: process.env.FROM_EMAIL!,
			to: email,
			subject: "We Got Your Audit Request! 🎉",
			html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #c49797; color: #1b1b1d; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f6e3; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight-box { 
              background: white; 
              padding: 20px; 
              border-radius: 6px; 
              margin: 20px 0; 
              border-left: 4px solid #c49797;
            }
            .footer { 
              margin-top: 20px; 
              padding: 20px; 
              background: #3d4436; 
              color: #f8f6e3; 
              border-radius: 6px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Thanks for Your Interest!</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #834a49;">
                Hi there from <strong>${businessName}</strong>,
              </p>
              
              <p style="font-size: 16px; color: #1b1b1d;">
                We received your request for a free website audit and we're excited to help! 🎉
              </p>
              
              <div class="highlight-box">
                <h3 style="color: #834a49; margin-top: 0;">📊 What Happens Next?</h3>
                <ol style="color: #1b1b1d; line-height: 1.8;">
                  <li><strong>We'll Review Your Site</strong> - Our team will do a thorough analysis</li>
                  <li><strong>We'll Reach Out</strong> - Expect to hear from us within 24 hours</li>
                  <li><strong>Get Your Results</strong> - We'll schedule a call to walk through our findings</li>
                </ol>
              </div>
              
              <p style="font-size: 16px; color: #1b1b1d;">
                We'll be looking at your SEO, performance, conversions, and more—everything that impacts your online success.
              </p>
              
              <div class="footer">
                <p style="margin: 0;">
                  <strong>Questions in the meantime?</strong><br/>
                  Just reply to this email—we're real people and we love to chat!
                </p>
                <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.8;">
                  - The Cher Digital Analytics Team
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
		});

		console.log(`✅ Audit confirmation sent to ${email}`);
	} catch (error) {
		console.error("❌ Failed to send audit confirmation:", error);
		throw error;
	}
}
