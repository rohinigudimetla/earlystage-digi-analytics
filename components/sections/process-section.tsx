"use client";

import { useEffect, useState, useRef } from "react";
import { Phone, UserCheck, Mail, MessageCircle } from "lucide-react";

export function ProcessSection() {
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

	const steps = [
		{
			icon: Phone,
			number: "01",
			title: "Reach Out",
			description:
				"Contact us to start—just email or call. No forms, no hassle.",
		},
		{
			icon: UserCheck,
			number: "02",
			title: "Personal Onboarding",
			description:
				"We'll connect with you to understand your goals and help set up tracking for tools you already use.",
		},
		{
			icon: Mail,
			number: "03",
			title: "Monthly Reports Made Easy",
			description:
				"You'll receive clear email reports every month, with a quick review explaining what's working and what can improve.",
		},
		{
			icon: MessageCircle,
			number: "04",
			title: "Ongoing Support",
			description:
				"Whenever you have a question, simply email—real answers, no robots.",
		},
	];

	return (
		<section
			ref={sectionRef}
			id="process"
			className="py-16 md:py-24 px-4 sm:px-6 bg-gradient-subtle relative overflow-hidden"
		>
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-10 md:top-20 right-10 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-rose rounded-full blur-3xl" />
				<div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-burgundy rounded-full blur-3xl" />
			</div>

			<div className="w-full md:max-w-7xl mx-auto relative z-10 md:bg-olive/50 md:rounded-[48px] py-8 md:p-12 md:shadow-xl">
				<div
					className={`mb-12 md:mb-16 transition-all duration-1000 ${
						isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-cream mb-4 md:mb-6 uppercase tracking-tight">
						What to Expect
					</h2>
					<p className="text-center text-base md:text-lg text-cream/70 leading-relaxed">
						Simple, personal, and straightforward—here's how we work together.
					</p>
				</div>

				<div className="relative md:max-w-4xl md:mx-auto">
					<div className="absolute left-1/2 top-0 bottom-0 w-1 bg-cream/30 -translate-x-1/2 hidden md:block" />

					<div className="space-y-6 md:space-y-12">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isEven = index % 2 === 0;

							return (
								<div
									key={index}
									className={`relative transition-all duration-700 ${
										isVisible
											? "opacity-100 translate-x-0"
											: `opacity-0 ${
													isEven ? "-translate-x-20" : "translate-x-20"
											  }`
									}`}
									style={{ transitionDelay: `${index * 150}ms` }}
								>
									<div className="md:hidden">
										<div className="border-4 border-cream/30 rounded-3xl p-6 bg-olive/20 hover:bg-burgundy/10 hover:border-burgundy transition-all duration-500">
											{/* Icon at top of card */}
											<div className="flex items-center justify-center mb-4">
												<div className="w-16 h-16 bg-burgundy rounded-full flex items-center justify-center border-4 border-cream/30 shadow-lg">
													<Icon className="w-8 h-8 text-cream" />
												</div>
											</div>

											{/* Card content */}
											<div className="text-center">
												<h3 className="text-xl font-bold text-cream mb-2">
													{step.title}
												</h3>
												<p className="text-sm text-cream/70 leading-relaxed">
													{step.description}
												</p>
											</div>
										</div>
									</div>

									{/* Desktop Layout: Alternating with center line */}
									<div
										className={`hidden md:flex items-center gap-8 ${
											isEven ? "flex-row" : "flex-row-reverse"
										}`}
									>
										{/* Content card */}
										<div className="flex-1">
											<div
												className={`border-4 border-cream/30 rounded-[28px] p-6 hover:bg-burgundy/10 hover:border-burgundy hover:scale-105 transition-all duration-500 ${
													isEven ? "text-right" : "text-left"
												}`}
											>
												<div
													className={`flex items-center gap-4 mb-4 ${
														isEven ? "justify-end" : "justify-start"
													}`}
												>
													<span className="text-5xl font-black text-burgundy/40">
														{step.number}
													</span>
													<h3 className="text-2xl font-bold text-cream">
														{step.title}
													</h3>
												</div>
												<p className="text-base text-cream/70 leading-relaxed">
													{step.description}
												</p>
											</div>
										</div>

										{/* Center icon */}
										<div className="flex w-20 h-20 bg-burgundy rounded-full items-center justify-center flex-shrink-0 relative z-10 border-4 border-cream/30 shadow-lg">
											<Icon className="w-10 h-10 text-cream" />
										</div>

										{/* Spacer for alternating layout */}
										<div className="flex-1" />
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
