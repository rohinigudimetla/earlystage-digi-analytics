"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Calendar booking component for scheduling consultation calls
 * Allows users to select a date and time slot for a call with the company
 */

// Generate available dates for the next 14 days (excluding weekends)
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

// Available time slots (9 AM - 5 PM, hourly)
const timeSlots = [
	"9:00 AM",
	"10:00 AM",
	"11:00 AM",
	"12:00 PM",
	"1:00 PM",
	"2:00 PM",
	"3:00 PM",
	"4:00 PM",
	"5:00 PM",
];

export function CalendarBooking() {
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [isBooked, setIsBooked] = useState(false);

	const availableDates = getAvailableDates();

	const handleBooking = () => {
		if (selectedDate && selectedTime) {
			setIsBooked(true);
			window.scrollTo({ top: 0, behavior: "smooth" });
			// In a real implementation, this would send the booking to a backend
			console.log("[v0] Booking scheduled:", {
				date: selectedDate,
				time: selectedTime,
			});
		}
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-US", {
			weekday: "short",
			month: "short",
			day: "numeric",
		});
	};

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
						We'll send you a confirmation email shortly with all the details.
						Looking forward to speaking with you!
					</p>
					<Button
						onClick={() => {
							setIsBooked(false);
							setSelectedDate(null);
							setSelectedTime(null);
						}}
						variant="outline"
					>
						Schedule Another Call
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-2 border-primary/20">
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
				{/* Date Selection */}
				<div>
					<h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
						<Calendar className="w-4 h-4" />
						Select a Date
					</h3>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{availableDates.slice(0, 9).map((date, index) => (
							<button
								key={index}
								onClick={() => {
									setSelectedDate(date);
									setSelectedTime(null); // Reset time when date changes
								}}
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

				{/* Time Selection */}
				{selectedDate && (
					<div>
						<h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
							<Clock className="w-4 h-4" />
							Select a Time
						</h3>
						<div className="grid grid-cols-3 gap-2">
							{timeSlots.map((time) => (
								<button
									key={time}
									onClick={() => setSelectedTime(time)}
									className={cn(
										"p-3 rounded-lg border-2 text-sm font-medium transition-all hover:border-primary/50",
										selectedTime === time
											? "border-primary bg-primary/5 text-foreground"
											: "border-border text-muted-foreground hover:text-foreground"
									)}
								>
									{time}
								</button>
							))}
						</div>
					</div>
				)}

				{/* Booking Summary & Confirm Button */}
				{selectedDate && selectedTime && (
					<div className="pt-4 border-t border-border">
						<div className="bg-secondary/5 rounded-lg p-4 mb-4">
							<p className="text-sm text-muted-foreground mb-1">
								Your selected time:
							</p>
							<p className="text-lg font-semibold text-foreground">
								{formatDate(selectedDate)} at {selectedTime}
							</p>
						</div>
						<Button onClick={handleBooking} className="w-full" size="lg">
							Confirm Booking
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
