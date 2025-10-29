"use client";

import { useEffect } from "react";
import RefinedHero from "@/components/sections/hero-section";
import { WhatWeDoSection } from "@/components/sections/what-we-do-section";
import { ProcessSection } from "@/components/sections/process-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/layout/footer";

export default function Page() {
	useEffect(() => {
		const handleScroll = () => {
			const scrollPercent =
				window.scrollY /
				(document.documentElement.scrollHeight - window.innerHeight);

			// Update CSS custom properties for background animation
			document.documentElement.style.setProperty(
				"--scroll-progress",
				scrollPercent.toString()
			);

			// Calculate dynamic hue shift based on scroll
			const hueShift = scrollPercent * 30; // Shift hue by up to 30 degrees
			document.documentElement.style.setProperty(
				"--scroll-hue",
				hueShift.toString()
			);

			// Calculate blob positions based on scroll
			const blob1Y = 20 + scrollPercent * 60;
			const blob2Y = 40 - scrollPercent * 30;
			const blob3Y = 50 + scrollPercent * 40;
			document.documentElement.style.setProperty("--blob1-y", `${blob1Y}%`);
			document.documentElement.style.setProperty("--blob2-y", `${blob2Y}%`);
			document.documentElement.style.setProperty("--blob3-y", `${blob3Y}%`);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll(); // Initial call

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
				<div
					className="absolute w-[500px] h-[500px] rounded-full blur-[90px] opacity-10 transition-all duration-1000 ease-out"
					style={{
						left: "50%",
						top: "var(--blob3-y, 50%)",
						transform: "translateX(-50%)",
						background:
							"radial-gradient(circle, rgba(196, 151, 151, 0.3) 0%, transparent 70%)",
					}}
				/>
			</div>

			<main className="relative min-h-screen bg-olive overflow-hidden z-10">
				<RefinedHero />
				<WhatWeDoSection />
				<ProcessSection />
				<TestimonialsSection />
				<FAQSection />
				<CTASection />
				<Footer />
			</main>
		</>
	);
}
