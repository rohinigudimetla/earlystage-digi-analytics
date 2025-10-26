"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
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

		return () => observer.disconnect();
	}, []);

	return (
		<section ref={sectionRef} id="cta" className="py-24 px-6 bg-olive">
			<div className="max-w-4xl mx-auto text-center bg-olive/50 backdrop-blur-sm rounded-[48px] p-12 md:p-16">
				<div
					className={`transition-all duration-1000 ${
						isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
					}`}
				>
					<h2 className="text-4xl md:text-5xl font-black text-cream mb-6 uppercase tracking-tight">
						Contact Us
					</h2>
					<p className="text-lg text-cream/70 mb-4 leading-relaxed">
						All reports and communications are handled directly by email, so
						it's always personal.
					</p>
					<p className="text-base text-cream/60 mb-8 leading-relaxed">
						Ready to get started? Reach out today.
					</p>

					<a href="/contact">
						<Button
							size="lg"
							className="bg-rose text-charcoal hover:bg-burgundy hover:text-cream font-bold text-lg px-8 rounded-full hover:scale-105 transition-transform"
						>
							Get In Touch
							<ArrowRight className="w-5 h-5 ml-2" />
						</Button>
					</a>
				</div>
			</div>
		</section>
	);
}
