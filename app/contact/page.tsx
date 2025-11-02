"use client";

import { useEffect } from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { CalendarBooking } from "@/components/booking/calendar-booking";
import Navbar from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
	useEffect(() => {
		const handleScroll = () => {
			const scrollPercent =
				window.scrollY /
				(document.documentElement.scrollHeight - window.innerHeight);
			document.documentElement.style.setProperty(
				"--scroll-progress",
				scrollPercent.toString()
			);
			const hueShift = scrollPercent * 30;
			document.documentElement.style.setProperty(
				"--scroll-hue",
				hueShift.toString()
			);
			const blob1Y = 20 + scrollPercent * 60;
			const blob2Y = 40 - scrollPercent * 30;
			document.documentElement.style.setProperty("--blob1-y", `${blob1Y}%`);
			document.documentElement.style.setProperty("--blob2-y", `${blob2Y}%`);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
				<div
					className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 transition-all duration-700 ease-out"
					style={{
						left: "10%",
						top: "var(--blob1-y, 20%)",
						background:
							"radial-gradient(circle, rgba(196, 151, 151, 0.4) 0%, transparent 70%)",
						filter: "hue-rotate(calc(var(--scroll-hue, 0) * 1deg))",
					}}
				/>
				<div
					className="absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-15 transition-all duration-700 ease-out"
					style={{
						right: "15%",
						top: "var(--blob2-y, 40%)",
						background:
							"radial-gradient(circle, rgba(131, 74, 73, 0.5) 0%, transparent 70%)",
						filter: "hue-rotate(calc(var(--scroll-hue, 0) * -1deg))",
					}}
				/>
			</div>

			<div className="relative min-h-screen bg-olive text-cream overflow-hidden">
				<Navbar />

				<main className="relative pt-32 pb-20 px-6 z-10">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-16">
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-cream mb-6">
								Let's Talk About Your Business
							</h1>
							<p className="text-base sm:text-lg md:text-xl text-cream/70 leading-relaxed max-w-3xl mx-auto">
								Ready to get started? Book a free consultation or reach out to
								us directly—all reports and communications are handled
								personally via email and phone.
							</p>
						</div>
						<div className="mb-16">
							<CalendarBooking />
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
							<div className="bg-cream/10 backdrop-blur-sm border-4 border-cream rounded-[32px] p-8 md:p-12 hover:scale-105 hover:shadow-2xl transition-all duration-500 text-center md:text-left">
								<div className="w-16 h-16 rounded-full bg-cream/20 flex items-center justify-center mb-6 mx-auto md:mx-0">
									<Phone className="w-8 h-8 text-cream" />
								</div>
								<h2 className="text-2xl md:text-3xl font-black text-cream mb-3">
									Call Us
								</h2>
								<p className="text-cream/70 mb-6 leading-relaxed">
									Speak directly with our team
								</p>
								<p className="text-xl md:text-2xl font-bold text-cream">
									(413) 377-8945
								</p>
							</div>

							<div className="bg-cream/10 backdrop-blur-sm border-4 border-cream rounded-[32px] p-8 md:p-12 hover:scale-105 hover:shadow-2xl transition-all duration-500 text-center md:text-left">
								<div className="w-16 h-16 rounded-full bg-cream/20 flex items-center justify-center mb-6 mx-auto md:mx-0">
									<Mail className="w-8 h-8 text-cream" />
								</div>
								<h2 className="text-2xl md:text-3xl font-black text-cream mb-3">
									Email Us
								</h2>
								<p className="text-cream/70 mb-6 leading-relaxed">
									We'll respond within 24 hours
								</p>
								<p className="text-xl md:text-2xl font-bold text-cream break-all">
									hello@cherdigitalanalytics.com
								</p>
							</div>
						</div>
						<div className="bg-olive/50 backdrop-blur-sm rounded-[32px] md:rounded-[48px] py-8 px-6 md:p-12 mb-12">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="text-center md:text-left md:flex md:gap-4">
									<div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center mx-auto md:mx-0 mb-4 md:mb-0 md:flex-shrink-0">
										<Clock className="w-6 h-6 text-rose" />
									</div>
									<div>
										<h3 className="text-lg md:text-xl font-bold text-cream mb-3">
											Business Hours
										</h3>
										<p className="text-sm md:text-base text-cream/70 leading-relaxed">
											Monday - Friday: 9:00 AM - 6:00 PM PST
											<br />
											Saturday: 10:00 AM - 2:00 PM PST
											<br />
											Sunday: Closed
										</p>
									</div>
								</div>

								<div className="text-center md:text-left md:flex md:gap-4">
									<div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center mx-auto md:mx-0 mb-4 md:mb-0 md:flex-shrink-0">
										<MapPin className="w-6 h-6 text-rose" />
									</div>
									<div>
										<h3 className="text-lg md:text-xl font-bold text-cream mb-3">
											Service Area
										</h3>
										<p className="text-sm md:text-base text-cream/70 leading-relaxed">
											We serve local businesses across the United States. Remote
											consultations available nationwide.
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-black text-cream mb-12">
								What Happens Next?
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
								<div className="border-4 border-rose rounded-[32px] p-8 hover:bg-rose/10 hover:scale-105 transition-all duration-500">
									<div className="w-16 h-16 rounded-full bg-rose/20 flex items-center justify-center mx-auto mb-6 text-rose font-black text-2xl">
										1
									</div>
									<h3 className="text-lg md:text-xl font-bold text-cream mb-4">
										Initial Conversation
									</h3>
									<p className="text-sm md:text-base text-cream/70 leading-relaxed">
										We'll discuss your business goals and current analytics
										setup—no forms, just a friendly chat.
									</p>
								</div>
								<div className="border-4 border-rose rounded-[32px] p-8 hover:bg-rose/10 hover:scale-105 transition-all duration-500">
									<div className="w-16 h-16 rounded-full bg-rose/20 flex items-center justify-center mx-auto mb-6 text-rose font-black text-2xl">
										2
									</div>
									<h3 className="text-lg md:text-xl font-bold text-cream mb-4">
										Personal Onboarding
									</h3>
									<p className="text-sm md:text-base text-cream/70 leading-relaxed">
										We'll set up tracking for your tools and get everything
										ready for your first report.
									</p>
								</div>
								<div className="border-4 border-rose rounded-[32px] p-8 hover:bg-rose/10 hover:scale-105 transition-all duration-500">
									<div className="w-16 h-16 rounded-full bg-rose/20 flex items-center justify-center mx-auto mb-6 text-rose font-black text-2xl">
										3
									</div>
									<h3 className="text-lg md:text-xl font-bold text-cream mb-4">
										Monthly Email Reports
									</h3>
									<p className="text-sm md:text-base text-cream/70 leading-relaxed">
										Receive clear, actionable insights every month, with ongoing
										support whenever you need it.
									</p>
								</div>
							</div>
						</div>
					</div>
				</main>

				<Footer />
			</div>
		</>
	);
}
