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
		<div className="relative min-h-screen w-full bg-olive text-cream overflow-hidden">
			<Navbar />

			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-10 w-64 h-64 bg-rose/20 rounded-full blur-3xl" />
				<div className="absolute bottom-40 left-20 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" />
			</div>

			<div className="relative pt-32 pb-20 px-6 md:px-12 flex items-center min-h-screen">
				<div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
					{/* Left side - Typography */}
					<div className="space-y-6">
						<div
							className={`transition-all duration-1000 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-20"
							}`}
						>
							<h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-cream uppercase tracking-tight leading-none mb-6 relative h-[200px] md:h-[250px]">
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
							<p className="text-lg md:text-xl text-cream/70 leading-relaxed max-w-xl">
								Get honest insights, easy reports and support you can trust.
							</p>
						</div>

						<div
							className={`flex flex-wrap gap-4 transition-all duration-1000 delay-200 ${
								isVisible
									? "opacity-100 translate-y-0"
									: "opacity-0 translate-y-20"
							}`}
						>
							<a href="/audit">
								<Button
									size="lg"
									className="bg-rose text-charcoal hover:bg-burgundy hover:text-cream font-bold rounded-full font-sans"
								>
									Book a Free Audit
								</Button>
							</a>
							<a href="/packages">
								<Button
									size="lg"
									variant="outline"
									className="!border-2 !border-cream !text-cream hover:!bg-cream hover:!text-olive font-bold !bg-transparent rounded-full font-sans"
								>
									Learn More
								</Button>
							</a>
						</div>
					</div>
					{/* Right side - Image or Placeholder */}
					<div
						className={`relative transition-all duration-1200 delay-300 ${
							isVisible
								? "opacity-100 translate-x-0"
								: "opacity-0 translate-x-20"
						}`}
					>
						<div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-rose border-2 border-rose/50 flex items-center justify-center">
							<div className="text-center p-12">
								<div className="text-6xl font-black text-charcoal/30 mb-4">
									📊
								</div>
								<p className="text-charcoal/70 text-sm font-medium">
									Analytics Dashboard Visualization
								</p>
							</div>
						</div>
						<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-burgundy/60 rounded-[24px] -z-10" />
						<div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-rose rounded-[20px] -z-10" />
					</div>
				</div>
			</div>
		</div>
	);
}
