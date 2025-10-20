"use client";

import { useState, useEffect, useRef } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Calendar,
	Clock,
	CheckCircle2,
	Loader2,
	AlertCircle,
	ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Calendar booking component for scheduling consultation calls
 * NOW CONNECTS TO REAL BACKEND:
 * - Fetches actual availability from your co-founder's Google Calendar
 * - Creates real calendar events with Google Meet links
 * - Sends confirmation emails to both client and co-founder
 */

// TIME SLOT TYPE - represents a single bookable time slot
interface TimeSlot {
	time: string; // e.g., "9:00 AM"
	available: boolean; // false if co-founder is busy at this time
}

// Generate available dates for the next 14 days (excluding weekends for now - can be configured later)
function getAvailableDates() {
	const dates = [];
	const today = new Date();
	let daysAdded = 0;
	const currentDate = new Date(today);

	while (daysAdded < 14) {
		currentDate.setDate(currentDate.getDate() + 1);
		const dayOfWeek = currentDate.getDay();

		// Skip weekends (0 = Sunday, 6 = Saturday)
		if (dayOfWeek !== 0 && dayOfWeek !== 6) {
			dates.push(new Date(currentDate));
			daysAdded++;
		}
	}

	return dates;
}

export function CalendarBooking() {
	// STEP 1: Date & Time Selection State
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

	// STEP 2: Available Time Slots (fetched from backend)
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
	const [loadingSlots, setLoadingSlots] = useState(false);

	// STEP 3: Client Information Form
	const [clientName, setClientName] = useState("");
	const [clientEmail, setClientEmail] = useState("");
	const [clientPhone, setClientPhone] = useState("");
	const [message, setMessage] = useState("");

	// STEP 4: Booking State
	const [isBooking, setIsBooking] = useState(false);
	const [isBooked, setIsBooked] = useState(false);
	const [meetingLink, setMeetingLink] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const timeSectionRef = useRef<HTMLDivElement>(null);

	const availableDates = getAvailableDates();

	// FETCH AVAILABLE TIME SLOTS when a date is selected
	// This calls our /api/availability endpoint to check what times are free
	useEffect(() => {
		if (!selectedDate) {
			setTimeSlots([]);
			return;
		}

		// When date changes, reset selected time and fetch new availability
		setSelectedTime(null);
		setLoadingSlots(true);
		setError(null);

		// Format date as YYYY-MM-DD for the API
		const dateStr = selectedDate.toISOString().split("T")[0];

		fetch(`/api/availability?date=${dateStr}`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch availability");
				return res.json();
			})
			.then((data) => {
				// API returns array of {time: "9:00 AM", available: true/false}
				console.log("📅 API Response:", data); // DEBUG: See what we get
				console.log("📅 Slots:", data.slots); // DEBUG: See the slots
				setTimeSlots(data.slots || []);
				setLoadingSlots(false);
			})
			.catch((err) => {
				console.error("Error fetching availability:", err);
				setError("Could not load available times. Please try again.");
				setLoadingSlots(false);
			});
	}, [selectedDate]);

	// AUTO-SCROLL to center the card when date or time is selected
	// This gives a smooth UX - the booking form scrolls into perfect view
	useEffect(() => {
		if ((selectedDate || selectedTime) && timeSectionRef.current) {
			setTimeout(() => {
				const element = timeSectionRef.current;
				if (!element) return;

				const elementRect = element.getBoundingClientRect();
				const elementTop = elementRect.top + window.scrollY;
				const elementHeight = elementRect.height;

				const navbarHeight = 64;
				const viewportHeight = window.innerHeight;
				const availableHeight = viewportHeight - navbarHeight;
				const scrollToPosition =
					elementTop - (availableHeight / 2 - elementHeight / 2) - navbarHeight;

				window.scrollTo({
					top: scrollToPosition,
					behavior: "smooth",
				});
			}, 100);
		}
	}, [selectedDate, selectedTime]);

	// HANDLE BOOKING SUBMISSION
	// This sends the booking to our backend which:
	// 1. Creates a Google Calendar event
	// 2. Saves booking to database
	// 3. Sends confirmation emails
	const handleBooking = async () => {
		if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
			setError("Please fill in all required fields");
			return;
		}

		setIsBooking(true);
		setError(null);

		try {
			const dateStr = selectedDate.toISOString().split("T")[0];

			const response = await fetch("/api/bookings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					date: dateStr,
					time: selectedTime,
					clientName,
					clientEmail,
					clientPhone,
					message,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Booking failed");
			}

			const data = await response.json();

			// Success! Show confirmation with Google Meet link
			setMeetingLink(data.meetingLink);
			setIsBooked(true);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err: any) {
			console.error("Booking error:", err);
			setError(err.message || "Failed to create booking. Please try again.");
		} finally {
			setIsBooking(false);
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

	// SUCCESS SCREEN - Shows after booking is confirmed
	if (isBooked && selectedDate && selectedTime) {
		return (
			<Card className="border-2 border-primary/20">
				<CardContent className="pt-12 pb-12 text-center">
					<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
						<CheckCircle2 className="w-8 h-8 text-primary" />
					</div>
					<h3 className="text-2xl font-serif font-bold text-foreground mb-4">
						Call Scheduled!
					</h3>
					<p className="text-lg text-muted-foreground mb-2">
						{formatDate(selectedDate)} at {selectedTime}
					</p>
					<p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-6">
						We've sent you a confirmation email with all the details. Looking
						forward to speaking with you!
					</p>

					{/* Show Google Meet link if available */}
					{meetingLink && (
						<div className="mb-6">
							<Button
								onClick={() => window.open(meetingLink, "_blank")}
								variant="default"
								className="gap-2"
							>
								<ExternalLink className="w-4 h-4" />
								Join Google Meet
							</Button>
						</div>
					)}

					<Button
						onClick={() => {
							setIsBooked(false);
							setSelectedDate(null);
							setSelectedTime(null);
							setClientName("");
							setClientEmail("");
							setClientPhone("");
							setMessage("");
							setMeetingLink(null);
						}}
						variant="outline"
					>
						Schedule Another Call
					</Button>
				</CardContent>
			</Card>
		);
	}

	// MAIN BOOKING FORM
	return (
		<Card ref={timeSectionRef} className="border-2 border-primary/20">
			<CardHeader>
				<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
					<Calendar className="w-6 h-6 text-primary" />
				</div>
				<CardTitle className="text-2xl font-serif">Schedule a Call</CardTitle>
				<CardDescription>
					Pick a date and time that works best for you
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Error Message */}
				{error && (
					<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
						<p className="text-sm text-destructive">{error}</p>
					</div>
				)}

				{/* STEP 1: Date Selection */}
				<div>
					<h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
						<Calendar className="w-4 h-4" />
						Select a Date
					</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{availableDates.slice(0, 9).map((date, index) => (
							<button
								key={index}
								onClick={() => setSelectedDate(date)}
								className={cn(
									"p-3 rounded-lg border-2 text-sm font-medium transition-all hover:border-primary/50",
									selectedDate?.toDateString() === date.toDateString()
										? "border-primary bg-primary/5 text-foreground"
										: "border-border text-muted-foreground hover:text-foreground"
								)}
							>
								{formatDate(date)}
							</button>
						))}
					</div>
				</div>

				{/* STEP 2: Time Selection (only shows when date is selected) */}
				{selectedDate && (
					<div>
						<h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
							<Clock className="w-4 h-4" />
							Select a Time
						</h3>

						{loadingSlots ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="w-6 h-6 animate-spin text-primary" />
								<span className="ml-2 text-sm text-muted-foreground">
									Checking availability...
								</span>
							</div>
						) : timeSlots.length === 0 ? (
							<p className="text-sm text-muted-foreground py-4">
								No available times for this date. Please select another day.
							</p>
						) : (
							<div className="grid grid-cols-3 gap-2">
								{timeSlots.map((slot) => (
									<button
										key={slot.time}
										onClick={() => slot.available && setSelectedTime(slot.time)}
										disabled={!slot.available}
										className={cn(
											"p-3 rounded-lg border-2 text-sm font-medium transition-all",
											selectedTime === slot.time
												? "border-primary bg-primary/5 text-foreground"
												: slot.available
												? "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
												: "border-border bg-muted text-muted-foreground/50 cursor-not-allowed opacity-50"
										)}
									>
										{slot.time}
									</button>
								))}
							</div>
						)}
					</div>
				)}

				{/* STEP 3: Client Information Form (shows when time is selected) */}
				{selectedTime && (
					<div className="space-y-4 pt-4 border-t border-border">
						<h3 className="font-semibold text-foreground mb-3">
							Your Information
						</h3>

						<div className="space-y-2">
							<Label htmlFor="name">
								Full Name <span className="text-destructive">*</span>
							</Label>
							<Input
								id="name"
								placeholder="John Doe"
								value={clientName}
								onChange={(e) => setClientName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">
								Email <span className="text-destructive">*</span>
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="john@example.com"
								value={clientEmail}
								onChange={(e) => setClientEmail(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								type="tel"
								placeholder="+1 (555) 123-4567"
								value={clientPhone}
								onChange={(e) => setClientPhone(e.target.value)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Message (Optional)</Label>
							<Textarea
								id="message"
								placeholder="Tell us what you'd like to discuss..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								rows={3}
							/>
						</div>
					</div>
				)}

				{/* STEP 4: Booking Summary & Confirm Button */}
				{selectedDate && selectedTime && (
					<div className="pt-4 border-t border-border space-y-4">
						<div className="bg-secondary/5 rounded-lg p-4">
							<p className="text-sm text-muted-foreground mb-1">
								Your selected time:
							</p>
							<p className="text-lg font-semibold text-foreground">
								{formatDate(selectedDate)} at {selectedTime}
							</p>
						</div>
						<Button
							onClick={handleBooking}
							className="w-full"
							size="lg"
							disabled={isBooking || !clientName || !clientEmail}
						>
							{isBooking ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Confirming...
								</>
							) : (
								"Confirm Booking"
							)}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
