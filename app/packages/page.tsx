"use client";

import { useEffect, useState, useRef } from "react";
import { Check, TrendingUp, Sparkles, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

export default function PackagesPage() {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);

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

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					setIsVisible(true);
				}
			},
			{ threshold: 0.1 }
		);

		if (sectionRef.current) observer.observe(sectionRef.current);

		return () => observer.disconnect();
	}, []);

	const packages = [
		{
			name: "The Glow Starter",
			icon: TrendingUp,
			price: "$450",
			period: "/month",
			description:
				"Perfect for salons ready to shine online and attract local clients.",
			features: [
				"AI-Powered Google Business Profile Setup + Optimization",
				"Local SEO & Keyword Strategy",
				"AI Analytics Dashboard (Looker Studio)",
				"Website Landing Page Maintenance",
				"Monthly Performance Monitoring",
			],
			setupOption: "Website Setup or Redesign: $800 one-time",
			color: "rose",
			popular: false,
		},
		{
			name: "The Digital Makeover",
			icon: Sparkles,
			price: "$850",
			period: "/month",
			description: "For growing salons that want to turn clicks into clients.",
			features: [
				"Everything in Glow Starter",
				"Google + Meta Ads Management (2 platforms)",
				"Conversion Tracking Setup",
				"Custom Website (Up to 3 Pages)",
				"Monthly Strategy Report + Consultation",
			],
			addOns: [
				"Full Website Build: $900 one-time",
				"Booking Integration: $100 setup",
			],
			color: "burgundy",
			popular: true,
		},
		{
			name: "The Luxe Growth Suite",
			icon: Crown,
			price: "$1,200",
			period: "/month",
			description: "For salons ready to scale, automate, and dominate locally.",
			features: [
				"Everything in Digital Makeover",
				"AI-Powered Ad Testing & Budget Optimization",
				"Email + SMS Remarketing Setup",
				"Advanced Local SEO + Review Strategy",
				"Full Analytics Dashboard (Ad ROI + Traffic)",
				"Quarterly Growth Strategy Call",
			],
			addOns: [
				"Automated Review Funnel: $100 setup",
				"Premium Landing Page: $150/month",
			],
			color: "rose",
			popular: false,
		},
	];

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
				<div
					className="absolute w-[500px] h-[500px] rounded-full blur-[90px] opacity-10 transition-all duration-1000 ease-out"
					style={{
						left: "50%",
						top: "calc(50% + var(--scroll-progress, 0) * 40%)",
						transform: "translateX(-50%)",
						background:
							"radial-gradient(circle, rgba(196, 151, 151, 0.3) 0%, transparent 70%)",
					}}
				/>
			</div>

			<div className="relative min-h-screen bg-olive overflow-hidden z-10">
				<Navbar />

				{/* Hero Section */}
				<section className="pt-32 pb-20 px-6">
					<div className="max-w-6xl mx-auto text-center">
						<h1 className="text-5xl md:text-7xl font-black text-cream mb-6 uppercase tracking-tight">
							Choose Your Growth Path
						</h1>
						<p className="text-xl md:text-2xl text-cream/70 max-w-3xl mx-auto leading-relaxed">
							Transparent pricing. No hidden fees. No surprises. Just results
							that fill your chairs.
						</p>
					</div>
				</section>

				{/* Packages Grid */}
				<section ref={sectionRef} className="py-20 px-6">
					<div className="max-w-7xl mx-auto">
						<div className="grid md:grid-cols-3 gap-8">
							{packages.map((pkg, index) => {
								const Icon = pkg.icon;
								return (
									<div
										key={index}
										className={`relative bg-olive/50 backdrop-blur-sm border-2 border-${
											pkg.color
										} rounded-[48px] p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
											isVisible
												? "opacity-100 translate-y-0"
												: "opacity-0 translate-y-10"
										} ${pkg.popular ? "md:scale-105 shadow-xl" : ""}`}
										style={{ transitionDelay: `${index * 100}ms` }}
									>
										{pkg.popular && (
											<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-burgundy text-cream px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
												Most Popular
											</div>
										)}

										<div className="flex items-center gap-4 mb-6">
											<div
												className={`w-16 h-16 rounded-full bg-${pkg.color} flex items-center justify-center`}
											>
												<Icon className="w-8 h-8 text-cream" />
											</div>
											<h3 className="text-2xl font-black text-cream">
												{pkg.name}
											</h3>
										</div>

										<div className="mb-6">
											<div className="flex items-baseline gap-2">
												<span className="text-4xl font-black text-cream">
													{pkg.price}
												</span>
												<span className="text-cream/60">{pkg.period}</span>
											</div>
											<p className="text-cream/70 mt-2 leading-relaxed">
												{pkg.description}
											</p>
										</div>

										<div className="space-y-3 mb-8">
											{pkg.features.map((feature, i) => (
												<div key={i} className="flex items-start gap-3">
													<Check
														className={`w-5 h-5 text-${pkg.color} flex-shrink-0 mt-0.5`}
													/>
													<span className="text-cream/80 text-sm leading-relaxed">
														{feature}
													</span>
												</div>
											))}
										</div>

										{pkg.setupOption && (
											<div className="mb-6 p-4 bg-cream/5 rounded-2xl border border-cream/10">
												<p className="text-xs text-cream/60 uppercase tracking-wider mb-1">
													Optional Setup
												</p>
												<p className="text-sm text-cream/80">
													{pkg.setupOption}
												</p>
											</div>
										)}

										{pkg.addOns && (
											<div className="mb-6 p-4 bg-cream/5 rounded-2xl border border-cream/10">
												<p className="text-xs text-cream/60 uppercase tracking-wider mb-2">
													Add-Ons Available
												</p>
												{pkg.addOns.map((addOn, i) => (
													<p key={i} className="text-sm text-cream/80 mb-1">
														• {addOn}
													</p>
												))}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-32 px-6">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl md:text-5xl font-black text-cream mb-6 uppercase tracking-tight">
							Ready to Grow Your Salon?
						</h2>
						<p className="text-xl text-cream/70 mb-8 leading-relaxed">
							Book a free consultation and get a complimentary site audit. No
							pressure, just insights.
						</p>
						<a href="/contact">
							<Button className="bg-rose text-charcoal hover:bg-burgundy hover:text-cream font-bold text-lg px-8 rounded-full hover:scale-105 transition-transform">
								Get In Touch
								<ArrowRight className="w-5 h-5 ml-2" />
							</Button>
						</a>
					</div>
				</section>

				<Footer />
			</div>
		</>
	);
}
