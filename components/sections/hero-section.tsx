"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";

export default function RefinedHero() {
	const [isVisible, setIsVisible] = useState(false);
	const [textIndex, setTextIndex] = useState(0);
	const headlines = [
		"Discover What Drives Your Business.",
		"Unlock Your Growth Potential.",
		"Start with a Free Site Audit.",
		"Transform Data Into Action.",
	];

	useEffect(() => {
		setIsVisible(true);

		// Morphing text interval
		const interval = setInterval(() => {
			setTextIndex((prev) => (prev + 1) % headlines.length);
		}, 4000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative min-h-screen w-full text-cream overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 w-full h-full">
				<img src="/leaves.jpg" alt="" className="w-full h-full object-cover" />
				<div className="absolute inset-0 bg-charcoal/70" />
			</div>

			<Navbar />

			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-10 w-64 h-64 bg-rose/20 rounded-full blur-3xl" />
				<div className="absolute bottom-40 left-20 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" />
			</div>

			<div className="relative pt-32 pb-20 px-6 md:px-12 flex items-center min-h-screen">
				<div className="max-w-4xl mx-auto w-full text-center">
					{/* Centered Typography */}
					<div className="space-y-6">
						<div
							className={`transition-all duration-1000 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-20"
							}`}
						>
							<h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-cream uppercase tracking-tight leading-none mb-0 relative h-[180px] sm:h-[160px] md:h-[250px] mx-auto px-6">
								{headlines.map((headline, index) => (
									<span
										key={index}
										className={`absolute inset-0 transition-all duration-1000 ${
											index === textIndex
												? "opacity-100 blur-0 scale-100"
												: "opacity-0 blur-sm scale-95 pointer-events-none"
										}`}
									>
										{headline}
									</span>
								))}
							</h1>
							<p className="text-base md:text-xl text-cream/70 leading-relaxed max-w-2xl mx-auto mb-8 px-6">
								Get honest insights, easy reports and support you can trust.
							</p>

							<div
								className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-200 ${
									isVisible
										? "opacity-100 translate-y-0"
										: "opacity-0 translate-y-20"
								}`}
							>
								<a href="/audit" className="w-full sm:w-auto">
									<Button
										size="lg"
										className="w-full sm:w-auto bg-rose text-charcoal hover:bg-burgundy hover:text-cream font-bold rounded-full font-sans"
									>
										Book a Free Audit
									</Button>
								</a>
								<a href="/packages" className="w-full sm:w-auto">
									<Button
										size="lg"
										variant="outline"
										className="w-full sm:w-auto !border-2 !border-cream !text-cream hover:!bg-cream hover:!text-olive font-bold !bg-transparent rounded-full font-sans"
									>
										Learn More
									</Button>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
