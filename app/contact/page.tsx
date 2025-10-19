import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CalendarBooking } from "@/components/booking/calendar-booking";

/**
 * Contact page
 * Displays contact information as plain text (no clickable links or buttons per requirements)
 */
export default function ContactPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 py-20">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto">
						<div className="text-center mb-12">
							<h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
								Let's Talk About Your Business
							</h1>
							<p className="text-lg text-muted-foreground leading-relaxed">
								Ready to get started? Reach out to us directly—all reports and
								communications are handled personally via email and phone.
							</p>
						</div>

						<div className="mb-12">
							<CalendarBooking />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
							<Card className="border-2 border-primary/20">
								<CardHeader>
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
										<Phone className="w-6 h-6 text-primary" />
									</div>
									<CardTitle className="text-2xl font-serif">Call Us</CardTitle>
									<CardDescription>
										Speak directly with our team
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-semibold text-foreground">
										(555) 123-4567
									</p>
								</CardContent>
							</Card>

							<Card className="border-2 border-primary/20">
								<CardHeader>
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
										<Mail className="w-6 h-6 text-primary" />
									</div>
									<CardTitle className="text-2xl font-serif">
										Email Us
									</CardTitle>
									<CardDescription>
										We'll respond within 24 hours
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-semibold text-foreground">
										hello@cherdigital.com
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Additional Information */}
						<Card className="bg-secondary/5 border-border">
							<CardContent className="pt-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									<div className="flex gap-4">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
											<Clock className="w-5 h-5 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground mb-2">
												Business Hours
											</h3>
											<p className="text-sm text-muted-foreground leading-relaxed">
												Monday - Friday: 9:00 AM - 6:00 PM PST
												<br />
												Saturday: 10:00 AM - 2:00 PM PST
												<br />
												Sunday: Closed
											</p>
										</div>
									</div>

									<div className="flex gap-4">
										<div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
											<MapPin className="w-5 h-5 text-primary" />
										</div>
										<div>
											<h3 className="font-semibold text-foreground mb-2">
												Service Area
											</h3>
											<p className="text-sm text-muted-foreground leading-relaxed">
												We serve local businesses across the United States.
												Remote consultations available nationwide.
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* What to Expect */}
						<div className="mt-12 text-center">
							<h2 className="text-2xl font-serif font-bold text-foreground mb-6">
								What Happens Next?
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="p-6">
									<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">
										1
									</div>
									<h3 className="font-semibold text-foreground mb-2">
										Initial Conversation
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										We'll discuss your business goals and current analytics
										setup—no forms, just a friendly chat.
									</p>
								</div>
								<div className="p-6">
									<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">
										2
									</div>
									<h3 className="font-semibold text-foreground mb-2">
										Personal Onboarding
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										We'll set up tracking for your tools and get everything
										ready for your first report.
									</p>
								</div>
								<div className="p-6">
									<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">
										3
									</div>
									<h3 className="font-semibold text-foreground mb-2">
										Monthly Email Reports
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										Receive clear, actionable insights every month, with ongoing
										support whenever you need it.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
