"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Search, TrendingUp, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AuditPage() {
	const [formData, setFormData] = useState({
		businessName: "",
		website: "",
		email: "",
		phone: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({ type: null, message: "" });

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus({ type: null, message: "" });

		try {
			const response = await fetch("/api/audit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			setSubmitStatus({
				type: "success",
				message:
					"🎉 Thank you! We've received your request and will reach out within 24 hours.",
			});

			// Don't clear form - let them see what they submitted
		} catch (error) {
			setSubmitStatus({
				type: "error",
				message:
					error instanceof Error
						? error.message
						: "Failed to submit. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

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
							<h1 className="text-5xl md:text-6xl font-black text-cream mb-6 tracking-tight uppercase">
								Get Your Free Website Audit
							</h1>
							<p className="text-xl text-cream/70 leading-relaxed max-w-3xl mx-auto">
								Discover what's working, what's not, and how to turn your
								website into a client-generating machine. No cost, no
								commitment—just honest insights.
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
							<div className="border-4 border-rose rounded-[32px] p-8 md:p-12 hover:bg-rose/10 hover:scale-105 transition-all duration-500">
								<h2 className="text-3xl font-black text-cream mb-8 tracking-tight uppercase">
									What You'll Get
								</h2>
								<div className="space-y-6">
									<div className="flex gap-4">
										<div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
											<Search className="w-6 h-6 text-rose" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-cream mb-2">
												SEO Analysis
											</h3>
											<p className="text-cream/70 leading-relaxed">
												See how your site ranks and what keywords you're missing
											</p>
										</div>
									</div>
									<div className="flex gap-4">
										<div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
											<TrendingUp className="w-6 h-6 text-rose" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-cream mb-2">
												Performance Review
											</h3>
											<p className="text-cream/70 leading-relaxed">
												Identify speed issues and technical problems holding you
												back
											</p>
										</div>
									</div>
									<div className="flex gap-4">
										<div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
											<Target className="w-6 h-6 text-rose" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-cream mb-2">
												Conversion Opportunities
											</h3>
											<p className="text-cream/70 leading-relaxed">
												Find out where you're losing potential clients
											</p>
										</div>
									</div>
									<div className="flex gap-4">
										<div className="w-12 h-12 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0">
											<Zap className="w-6 h-6 text-rose" />
										</div>
										<div>
											<h3 className="text-xl font-bold text-cream mb-2">
												Action Plan
											</h3>
											<p className="text-cream/70 leading-relaxed">
												Get clear next steps to improve your online presence
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-burgundy rounded-[32px] p-8 md:p-12 hover:scale-105 hover:shadow-2xl transition-all duration-500">
								<h2 className="text-3xl font-black text-cream mb-8 tracking-tight uppercase">
									Request Your Audit
								</h2>

								{submitStatus.type && (
									<div
										className={`mb-6 p-4 rounded-2xl ${
											submitStatus.type === "success"
												? "bg-rose/20 border border-rose/40 text-cream"
												: "bg-red-900/30 border border-red-500/40 text-red-200"
										}`}
									>
										{submitStatus.message}
									</div>
								)}

								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<label
											htmlFor="businessName"
											className="block text-cream font-bold mb-2"
										>
											Business Name
										</label>
										<input
											type="text"
											id="businessName"
											value={formData.businessName}
											onChange={(e) =>
												setFormData({
													...formData,
													businessName: e.target.value,
												})
											}
											className="w-full px-4 py-3 rounded-2xl bg-charcoal/30 border border-rose/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-rose transition-colors"
											placeholder="Your Salon Name"
											required
										/>
									</div>
									<div>
										<label
											htmlFor="website"
											className="block text-cream font-bold mb-2"
										>
											Website URL
										</label>
										<input
											type="url"
											id="website"
											value={formData.website}
											onChange={(e) =>
												setFormData({ ...formData, website: e.target.value })
											}
											className="w-full px-4 py-3 rounded-2xl bg-charcoal/30 border border-rose/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-rose transition-colors"
											placeholder="https://yourwebsite.com"
											required
										/>
									</div>
									<div>
										<label
											htmlFor="email"
											className="block text-cream font-bold mb-2"
										>
											Email
										</label>
										<input
											type="email"
											id="email"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											className="w-full px-4 py-3 rounded-2xl bg-charcoal/30 border border-rose/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-rose transition-colors"
											placeholder="your@email.com"
											required
										/>
									</div>
									<div>
										<label
											htmlFor="phone"
											className="block text-cream font-bold mb-2"
										>
											Phone Number
										</label>
										<input
											type="tel"
											id="phone"
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
											className="w-full px-4 py-3 rounded-2xl bg-charcoal/30 border border-rose/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-rose transition-colors"
											placeholder="(555) 123-4567"
											required
										/>
									</div>
									<Button
										type="submit"
										size="lg"
										disabled={isSubmitting}
										className="w-full bg-rose text-charcoal hover:bg-burgundy hover:text-cream font-bold rounded-full text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isSubmitting ? "Submitting..." : "Get My Free Audit"}
									</Button>
								</form>
							</div>
						</div>

						<div className="bg-olive/50 backdrop-blur-sm rounded-[48px] p-8 md:p-12 text-center">
							<h2 className="text-3xl font-black text-cream mb-4 tracking-tight uppercase">
								Why Get an Audit?
							</h2>
							<p className="text-xl text-cream/70 leading-relaxed max-w-3xl mx-auto">
								Most salons are losing clients because their website isn't
								optimized for local search, mobile users, or conversions. Our
								free audit shows you exactly where you're losing business—and
								how to fix it. No fluff, no sales pitch, just actionable
								insights you can use right away.
							</p>
						</div>
					</div>
				</main>

				<Footer />
			</div>
		</>
	);
}
