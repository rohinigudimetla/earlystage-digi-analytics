"use client";

import { useEffect, useState, useRef } from "react";
import { BarChart3, TrendingUp, Users, Check } from "lucide-react";

export function WhatWeDoSection() {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);

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

		return () => {
			observer.disconnect();
		};
	}, []);

	const services = [
		{
			icon: BarChart3,
			title: "Simple Dashboards",
			description:
				"We create easy-to-understand dashboards that show you exactly what's working and what's notno confusing jargon, just clear insights.",
		},
		{
			icon: TrendingUp,
			title: "Transparent Pricing",
			description:
				"No hidden fees, no surprises. You'll know exactly what you're paying for, and you can upgrade or downgrade anytime.",
			features: [
				"Month-to-month billing",
				"Cancel anytime, no penalties",
				"Flexible plan upgrades",
				"Clear pricing breakdown",
			],
		},
		{
			icon: Users,
			title: "Personal Support",
			description:
				"Real people, real answers. When you reach out, you'll talk to someone who knows your businessnot a chatbot.",
		},
	];

	return (
		<section
			ref={sectionRef}
			id="what-we-do"
			className="py-16 md:py-24 px-4 sm:px-6 bg-olive relative overflow-hidden"
		>
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 md:top-40 left-5 md:left-10 w-48 md:w-72 h-48 md:h-72 bg-rose/10 rounded-full blur-3xl" />
				<div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-burgundy/10 rounded-full blur-3xl" />
			</div>

			<div className="w-full md:max-w-7xl mx-auto relative z-10 md:bg-olive/50 md:backdrop-blur-sm md:rounded-[48px] py-8 md:p-12">
				<div
					className={`mb-8 md:mb-16 transition-all duration-1000 ${
						isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="text-center text-3xl sm:text-4xl md:text-6xl font-black text-cream mb-3 md:mb-6 tracking-tight">
						What We Do
					</h2>
					<p className="text-center text-base md:text-lg text-cream/80 leading-relaxed">
						We help local businesses discover what drives real foot traffic and
						sales using simple dashboards, transparent pricing, and AI-powered
						insights.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-6 md:max-w-6xl md:mx-auto">
					<div
						className={`md:col-span-2 border-4 border-rose rounded-2xl md:rounded-[32px] p-5 md:p-8 hover:bg-rose/10 hover:scale-105 transition-all duration-500 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-20"
						}`}
						style={{ transitionDelay: "0ms" }}
					>
						<div className="w-14 h-14 md:w-16 md:h-16 bg-rose rounded-full flex items-center justify-center mb-4 md:mb-6">
							<BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-charcoal" />
						</div>
						<h3 className="text-lg md:text-2xl font-bold text-cream mb-2 md:mb-4">
							{services[0].title}
						</h3>
						<p className="text-sm md:text-base text-cream/70 leading-relaxed">
							{services[0].description}
						</p>
					</div>

					<div
						className={`md:col-span-4 bg-burgundy rounded-2xl md:rounded-[32px] p-5 md:p-8 flex flex-col hover:scale-105 hover:shadow-2xl transition-all duration-500 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-20"
						}`}
						style={{ transitionDelay: "150ms" }}
					>
						<div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-4 md:mb-8">
							<div className="w-14 h-14 md:w-16 md:h-16 bg-cream/20 rounded-full flex items-center justify-center flex-shrink-0">
								<TrendingUp className="w-7 h-7 md:w-8 md:h-8 text-cream" />
							</div>
							<div>
								<h3 className="text-lg md:text-2xl font-bold text-cream mb-2 md:mb-4">
									{services[1].title}
								</h3>
								<p className="text-sm md:text-base text-cream/80 leading-relaxed">
									{services[1].description}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mt-3 md:mt-8">
							{services[1].features?.map((feature, idx) => (
								<div key={idx} className="flex items-center gap-2">
									<div className="w-5 h-5 rounded-full bg-cream/20 flex items-center justify-center flex-shrink-0">
										<Check className="w-3 h-3 text-cream" />
									</div>
									<span className="text-cream/90 text-xs md:text-sm">
										{feature}
									</span>
								</div>
							))}
						</div>
					</div>

					<div
						className={`md:col-span-6 border-4 border-rose rounded-2xl md:rounded-[32px] p-5 md:p-8 hover:bg-gradient-to-r hover:from-rose/20 hover:to-burgundy/20 hover:scale-[1.02] transition-all duration-500 ${
							isVisible
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-20"
						}`}
						style={{ transitionDelay: "300ms" }}
					>
						<div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
							<div className="w-14 h-14 md:w-20 md:h-20 bg-rose rounded-full flex items-center justify-center flex-shrink-0">
								<Users className="w-7 h-7 md:w-10 md:h-10 text-charcoal" />
							</div>
							<div className="flex-1">
								<h3 className="text-lg md:text-3xl font-bold text-cream mb-2 md:mb-3">
									{services[2].title}
								</h3>
								<p className="text-sm md:text-lg text-cream/80 leading-relaxed">
									{services[2].description}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
