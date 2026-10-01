"use client";

import { useEffect, useState, useRef } from "react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
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

	const faqs = [
		{
			question: "What is EarlyStage and why choose us?",
			answer:
				"EarlyStage is a digital marketing agency built exclusively for nail salons, hair salons, and beauty studios. We understand that salons don't just need clicks — they need clients in chairs. We focus only on the beauty industry, so every strategy speaks your client's language. We blend data analytics with creativity, ensuring every campaign drives real appointments, not vanity metrics. We offer transparent pricing and detailed monthly reports, so you always know where your money is going and what's performing. Our team works like an extension of your salon, making marketing feel seamless and personal — never outsourced or confusing. At EarlyStage, we don't do generic. We do growth that feels as polished as your work.",
		},
		{
			question: "How do I get started with EarlyStage?",
			answer:
				"Getting started with EarlyStage is simple — just book a free consultation through our website. We'll begin with a complimentary site audit to review your current online presence, identify opportunities, and outline a strategy tailored to your salon's goals. Our services start at $400 per month, and we offer three transparent packages designed to fit different salon sizes and growth stages. Each plan combines the right mix of local SEO, Google and Meta Ads, website maintenance, keyword optimization, and performance reporting — so you always know exactly what you're getting and paying for. At EarlyStage, we believe in clarity, results, and relationships, not lock-in contracts. You'll know every detail before we begin, and you'll see measurable progress every month.",
		},
		{
			question: "How will I receive my reports?",
			answer:
				"You'll receive clear, easy-to-read email reports every month. Each report includes a summary of what's working, what needs attention, and actionable recommendations. We'll also schedule a brief call to walk through the highlights if you'd like.",
		},
		{
			question: "Do I need technical knowledge?",
			answer:
				"Not at all! We handle all the technical setup and present insights in plain English. If you ever have questions, just email us—we're here to help you understand your data, not confuse you with jargon.",
		},
		{
			question: "How do you communicate with clients?",
			answer:
				"Everything is personal and direct. We communicate via email and phone calls—no automated systems or chatbots. When you reach out, you'll get real answers from real people who know your business.",
		},
		{
			question: "What if I'm already using Google Analytics?",
			answer:
				"Perfect! We'll review your current setup, fix any tracking issues, and enhance it with additional insights. You'll get clearer, more actionable reports that help you make better business decisions.",
		},
	];

	return (
		<section
			ref={sectionRef}
			id="faq"
			className="py-8 md:py-32 px-4 md:px-6 bg-olive"
		>
			<div className="w-full md:max-w-5xl mx-auto md:bg-olive/50 md:backdrop-blur-sm md:rounded-[48px] py-8 md:p-12 md:shadow-xl">
				<div
					className={`mb-8 md:mb-16 transition-all duration-1000 ${
						isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
					}`}
				>
					<h2 className="text-center text-3xl md:text-5xl font-black text-cream mb-4 md:mb-6 uppercase tracking-tight">
						Frequently Asked Questions
					</h2>
					<p className="text-center text-base md:text-lg text-cream/70 leading-relaxed">
						Everything you need to know about working with EarlyStage Digital
						Analytics.
					</p>
				</div>

				<div
					className={`md:px-0 transition-all duration-1000 delay-200 ${
						isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
					}`}
				>
					<Accordion
						type="single"
						collapsible
						className="w-full space-y-3 md:space-y-4"
					>
						{faqs.map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="bg-transparent border-2 border-rose rounded-2xl md:rounded-[24px] px-4 md:px-6 data-[state=open]:border-burgundy data-[state=open]:bg-rose/10 data-[state=open]:shadow-lg transition-all duration-300 hover:border-burgundy/70 last:!border-b-2"
							>
								<AccordionTrigger className="text-left font-bold text-cream hover:text-rose hover:no-underline text-sm md:text-base py-4">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-cream/70 leading-relaxed text-sm md:text-base">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
