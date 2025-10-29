"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

// Simple cache for availability data (5 min TTL)
const availabilityCache = new Map<
	string,
	{ slots: TimeSlot[]; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	const availableDates = getAvailableDates();

	// Fetch availability with caching and debouncing
	const fetchAvailability = useCallback(async (date: Date) => {
		const dateStr = date.toISOString().split("T")[0];

		// Check cache first
		const cached = availabilityCache.get(dateStr);
		if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
			console.log("⚡ Using cached availability for", dateStr);
			setTimeSlots(cached.slots);
			setLoadingSlots(false);
			return;
		}

		try {
			const startTime = performance.now();
			const res = await fetch(`/api/availability?date=${dateStr}`);
			const duration = performance.now() - startTime;

			if (!res.ok) throw new Error("Failed to fetch availability");

			const data = await res.json();
			const slots = data.slots || [];

			// Cache the result
			availabilityCache.set(dateStr, { slots, timestamp: Date.now() });

			console.log(`⚡ Fetched availability in ${duration.toFixed(0)}ms`);
			setTimeSlots(slots);
			setLoadingSlots(false);
		} catch (err) {
			console.error("Error fetching availability:", err);
			setError("Could not load available times. Please try again.");
			setLoadingSlots(false);
		}
	}, []);

	// FETCH AVAILABLE TIME SLOTS when a date is selected (with debouncing)
	useEffect(() => {
		if (!selectedDate) {
			setTimeSlots([]);
			return;
		}

		// Reset state immediately
		setSelectedTime(null);
		setError(null);
		setLoadingSlots(true);

		// Clear any pending debounce timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Debounce: wait 150ms before fetching (in case user is clicking through dates quickly)
		debounceTimerRef.current = setTimeout(() => {
			fetchAvailability(selectedDate);
		}, 150);

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [selectedDate, fetchAvailability]);

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

			// Success! Clear cache for this date since availability changed
			availabilityCache.delete(dateStr);

			// Show confirmation with Google Meet link
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
			<div className="bg-burgundy rounded-[32px] font-sans p-12 text-center">
				<div className="w-16 h-16 bg-rose/20 flex items-center justify-center mx-auto mb-6 rounded-full">
					<CheckCircle2 className="w-16 h-16 text-cream" />
				</div>
				<h3 className="text-2xl font-bold text-cream mb-4 font-sans">
					Booking Confirmed!
				</h3>
				<p className="text-cream/90 mb-6 font-sans">
					We've sent a confirmation email with all the details.
				</p>

				{/* Show Google Meet link if available */}
				{meetingLink && (
					<div className="bg-rose/20 rounded-[24px] p-6 mb-6">
						<p className="text-sm text-cream mb-3 font-sans">
							Your Google Meet link:
						</p>
						<a
							href={meetingLink}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cream font-bold hover:text-cream/80 break-all font-sans"
						>
							{meetingLink}
						</a>
					</div>
				)}

				<button
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
					className="bg-rose text-charcoal hover:bg-rose/90 font-bold rounded-full font-sans px-8 py-4"
				>
					Book Another Call
				</button>
			</div>
		);
	}

	// MAIN BOOKING FORM
	return (
		<div
			ref={timeSectionRef}
			className="bg-burgundy rounded-[32px] font-sans p-6 md:p-8"
		>
			<div className="mb-8">
				<div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center mb-4">
					<Calendar className="w-6 h-6 text-cream" />
				</div>
				<h2 className="text-2xl font-bold text-cream font-sans">
					Schedule a Call
				</h2>
				<p className="text-cream/80 font-sans">
					Pick a date and time that works best for you
				</p>
			</div>
			<div className="space-y-8">
				{/* Error Message */}
				{error && (
					<div className="bg-rose/20 border border-rose/30 rounded-[24px] p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-rose mt-0.5" />
						<p className="text-sm text-cream font-sans">{error}</p>
					</div>
				)}

				{/* STEP 1: Date Selection */}
				<div>
					<h3 className="text-base font-bold text-cream mb-3 flex items-center gap-2 font-sans">
						<Calendar className="w-4 h-4" />
						Select a Date
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						{availableDates.slice(0, 9).map((date, index) => (
							<button
								key={index}
								onClick={() => setSelectedDate(date)}
								className={cn(
									"p-4 rounded-[24px] text-center transition-all font-sans font-medium",
									selectedDate?.toDateString() === date.toDateString()
										? "bg-rose text-cream shadow-lg scale-105"
										: "bg-rose/30 text-cream hover:bg-rose/50 hover:scale-105"
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
						<h3 className="text-base font-bold text-cream mb-3 flex items-center gap-2 font-sans">
							<Clock className="w-4 h-4" />
							Select a Time
						</h3>

						{loadingSlots ? (
							<div className="text-center py-8 text-cream/80 font-sans">
								Loading available times...
							</div>
						) : timeSlots.length === 0 ? (
							<p className="text-center py-8 text-cream/80 font-sans">
								No available times for this date. Please select another day.
							</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-4 gap-3">
								{timeSlots.map((slot) => (
									<button
										key={slot.time}
										onClick={() => slot.available && setSelectedTime(slot.time)}
										disabled={!slot.available}
										className={cn(
											"p-4 md:p-3 rounded-[24px] text-center transition-all font-sans font-medium",
											selectedTime === slot.time
												? "bg-rose text-cream shadow-lg scale-105"
												: slot.available
												? "bg-rose/30 text-cream hover:bg-rose/50 hover:scale-105"
												: "bg-charcoal/20 text-cream/40 cursor-not-allowed"
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
					<div className="space-y-6">
						<h3 className="text-base font-bold text-cream mb-4 font-sans">
							Your Information
						</h3>

						<div className="space-y-2">
							<label
								htmlFor="name"
								className="text-cream font-medium font-sans"
							>
								Name *
							</label>
							<input
								id="name"
								placeholder="Your full name"
								value={clientName}
								onChange={(e) => setClientName(e.target.value)}
								required
								className="w-full bg-rose/20 border-rose/30 text-cream placeholder:text-cream/50 rounded-[16px] font-sans px-6 py-3 border focus:outline-none focus:border-rose transition-colors"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="email"
								className="text-cream font-medium font-sans"
							>
								Email *
							</label>
							<input
								id="email"
								type="email"
								placeholder="your@email.com"
								value={clientEmail}
								onChange={(e) => setClientEmail(e.target.value)}
								required
								className="w-full bg-rose/20 border-rose/30 text-cream placeholder:text-cream/50 rounded-[16px] font-sans px-6 py-3 border focus:outline-none focus:border-rose transition-colors"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="phone"
								className="text-cream font-medium font-sans"
							>
								Phone
							</label>
							<input
								id="phone"
								type="tel"
								placeholder="(555) 123-4567"
								value={clientPhone}
								onChange={(e) => setClientPhone(e.target.value)}
								className="w-full bg-rose/20 border-rose/30 text-cream placeholder:text-cream/50 rounded-[16px] font-sans px-6 py-3 border focus:outline-none focus:border-rose transition-colors"
							/>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="message"
								className="text-cream font-medium font-sans"
							>
								What would you like to discuss?
							</label>
							<textarea
								id="message"
								placeholder="Tell us about your project or goals..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								rows={3}
								className="w-full bg-rose/20 border-rose/30 text-cream placeholder:text-cream/50 rounded-[16px] min-h-[100px] font-sans px-6 py-3 border focus:outline-none focus:border-rose transition-colors resize-none"
							/>
						</div>
					</div>
				)}

				{/* STEP 4: Booking Summary & Confirm Button */}
				{selectedDate && selectedTime && (
					<div className="space-y-4">
						<button
							onClick={handleBooking}
							className="w-full bg-rose text-charcoal hover:bg-rose/90 font-bold rounded-full py-6 font-sans disabled:opacity-50 disabled:cursor-not-allowed transition-all"
							disabled={isBooking || !clientName || !clientEmail}
						>
							{isBooking ? "Booking..." : "Confirm Booking"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
