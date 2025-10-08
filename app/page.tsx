import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { WhatWeDoSection } from "@/components/sections/what-we-do-section";
import { ProcessSection } from "@/components/sections/process-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";

/**
 * Landing page for Cher Digital Analytics
 * Showcases services, testimonials, and FAQ
 */
export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<HeroSection />
				<div className="container mx-auto px-4">
					<hr className="border-t border-secondary/30" />
				</div>
				<WhatWeDoSection />
				<ProcessSection />
				<TestimonialsSection />
				<FAQSection />
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
