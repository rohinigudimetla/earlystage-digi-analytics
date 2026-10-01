"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";

export function TestimonialsSection() {
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);
	const scrollRef = useRef<HTMLDivElement>(null);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [isUserInteracting, setIsUserInteracting] = useState(false);
	const touchStartX = useRef(0);
	const touchEndX = useRef(0);
	const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
	const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

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
				"EarlyStage's reports helped us see which Facebook ads actually brought people through our door. We cut our ad spend by 35%.",
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

	const allTestimonials = [...testimonials, ...testimonials];

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

	useEffect(() => {
		const startAutoPlay = () => {
			if (autoPlayTimerRef.current) {
				clearInterval(autoPlayTimerRef.current);
			}

			autoPlayTimerRef.current = setInterval(() => {
				if (!isUserInteracting) {
					setCurrentIndex((prev) => (prev + 1) % testimonials.length);
				}
			}, 4000);
		};

		startAutoPlay();

		return () => {
			if (autoPlayTimerRef.current) {
				clearInterval(autoPlayTimerRef.current);
			}
			if (pauseTimerRef.current) {
				clearTimeout(pauseTimerRef.current);
			}
		};
	}, [isUserInteracting, testimonials.length]);

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		touchEndX.current = e.touches[0].clientX;
	};

	const handleTouchEnd = () => {
		const swipeDistance = touchStartX.current - touchEndX.current;
		const minSwipeDistance = 50;

		if (Math.abs(swipeDistance) > minSwipeDistance) {
			// User swiped, pause auto-play
			setIsUserInteracting(true);

			if (swipeDistance > 0) {
				// Swiped left, go to next
				setCurrentIndex((prev) => (prev + 1) % testimonials.length);
			} else {
				// Swiped right, go to previous
				setCurrentIndex(
					(prev) => (prev - 1 + testimonials.length) % testimonials.length
				);
			}

			// Resume auto-play after 5 seconds
			if (pauseTimerRef.current) {
				clearTimeout(pauseTimerRef.current);
			}
			pauseTimerRef.current = setTimeout(() => {
				setIsUserInteracting(false);
			}, 5000);
		}
	};

	return (
		<section
			ref={sectionRef}
			id="testimonials"
			className="py-16 md:py-32 px-4 md:px-6 bg-gradient-subtle relative overflow-hidden"
		>
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-20 left-10 w-80 h-80 bg-burgundy/10 rounded-full blur-3xl" />
			</div>

			<div className="max-w-7xl mx-auto relative z-10">
				<div
					className={`text-center mb-8 md:mb-16 transition-all duration-1000 ${
						isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="text-3xl md:text-6xl font-black text-cream mb-4 md:mb-6 tracking-tight">
						What Our Clients Say
					</h2>
					<p className="text-base md:text-lg text-cream/80 leading-relaxed px-2">
						Real results from real local businesses we've helped grow.
					</p>
				</div>

				<div className="md:hidden relative">
					<div
						className="overflow-hidden"
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<div
							className="flex transition-transform duration-500 ease-out"
							style={{ transform: `translateX(-${currentIndex * 100}%)` }}
						>
							{testimonials.map((testimonial, index) => (
								<div key={index} className="w-full flex-shrink-0 px-2">
									<div className="flex flex-col items-center gap-4">
										<div className="w-16 h-16 rounded-full bg-burgundy border-4 border-cream/30 flex items-center justify-center shadow-lg">
											<span className="text-xl font-black text-cream">
												{testimonial.initials}
											</span>
										</div>

										<div className="w-full border-4 border-burgundy rounded-3xl p-6 bg-olive/20 flex flex-col min-h-[280px]">
											<p className="text-cream/90 leading-relaxed mb-4 italic flex-grow text-sm">
												"{testimonial.quote}"
											</p>
											<div className="border-t border-cream/20 pt-4">
												<p className="font-bold text-cream text-sm">
													{testimonial.author}
												</p>
												<p className="text-xs text-cream/70">
													{testimonial.business}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Carousel indicators */}
					<div className="flex justify-center gap-2 mt-6">
						{testimonials.map((_, index) => (
							<button
								key={index}
								onClick={() => {
									setCurrentIndex(index);
									setIsUserInteracting(true);
									if (pauseTimerRef.current) {
										clearTimeout(pauseTimerRef.current);
									}
									pauseTimerRef.current = setTimeout(() => {
										setIsUserInteracting(false);
									}, 5000);
								}}
								className={`w-2 h-2 rounded-full transition-all duration-300 ${
									index === currentIndex ? "bg-rose w-8" : "bg-cream/30"
								}`}
								aria-label={`Go to testimonial ${index + 1}`}
							/>
						))}
					</div>
				</div>

				<div className="hidden md:block relative">
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
