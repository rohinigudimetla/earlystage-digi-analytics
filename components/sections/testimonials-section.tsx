"use client";

import { useEffect, useState, useRef } from "react";

export function TestimonialsSection() {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (!scrollContainer) return;

		let scrollAmount = 0;
		const scrollSpeed = 0.5;

		const scroll = () => {
			scrollAmount += scrollSpeed;
			if (scrollContainer) {
				scrollContainer.scrollLeft = scrollAmount;
				// Reset when reaching the end
				if (scrollAmount >= scrollContainer.scrollWidth / 2) {
					scrollAmount = 0;
				}
			}
		};

		const intervalId = setInterval(scroll, 20);

		return () => clearInterval(intervalId);
	}, []);

	const testimonials = [
		{
			quote:
				"The monthly email reports are so easy to understand—no confusing jargon. I finally know what's working and what's not.",
			author: "Maria Santos",
			business: "Bloom Flower Shop",
			initials: "MS",
		},
		{
			quote:
				"Cher Digital's reports helped us see which Facebook ads actually brought people through our door. We cut our ad spend by 40%.",
			author: "James Park",
			business: "Park's BBQ",
			initials: "JP",
		},
		{
			quote:
				"As a small salon owner, I don't have time for complicated analytics. The email reports give me exactly what I need to know in plain English.",
			author: "Tanya Williams",
			business: "Radiance Hair Studio",
			initials: "TW",
		},
	];

	// Duplicate testimonials for seamless loop
	const allTestimonials = [...testimonials, ...testimonials];

	return (
		<section
			ref={sectionRef}
			id="testimonials"
			className="py-32 px-6 bg-gradient-subtle relative overflow-hidden"
		>
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 left-10 w-80 h-80 bg-burgundy/10 rounded-full blur-3xl" />
			</div>

			<div className="max-w-7xl mx-auto relative z-10">
				<div
					className={`text-center mb-16 transition-all duration-1000 ${
						isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="text-4xl md:text-6xl font-black text-cream mb-6 tracking-tight">
						What Our Clients Say
					</h2>
					<p className="text-lg text-cream/80 max-w-3xl mx-auto leading-relaxed">
						Real results from real local businesses we've helped grow.
					</p>
				</div>

				<div className="relative">
					<div
						ref={scrollRef}
						className="flex gap-6 pb-8 overflow-hidden"
						style={{ scrollBehavior: "auto" }}
					>
						{allTestimonials.map((testimonial, index) => (
							<div key={index} className="flex-shrink-0 w-[350px]">
								<div className="flex flex-col items-center gap-4">
									<div className="w-20 h-20 rounded-full bg-burgundy border-4 border-cream/30 flex items-center justify-center shadow-lg">
										<span className="text-2xl font-black text-cream">
											{testimonial.initials}
										</span>
									</div>

									{/* Pill-shaped testimonial card with outline style */}
									<div className="border-4 border-burgundy rounded-[32px] p-6 hover:bg-burgundy/20 hover:scale-105 transition-all duration-500 min-h-[280px] flex flex-col">
										<p className="text-cream/90 leading-relaxed mb-4 italic flex-grow">
											"{testimonial.quote}"
										</p>
										<div className="border-t border-cream/20 pt-4">
											<p className="font-bold text-cream">
												{testimonial.author}
											</p>
											<p className="text-sm text-cream/70">
												{testimonial.business}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
