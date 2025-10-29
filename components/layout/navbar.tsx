"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<nav className="sticky top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-4 md:py-6 flex items-center justify-between">
			<Link href="/" className="relative z-50">
				<Image
					src="/cher (1)-cropped.svg"
					alt="Cher Digital Analytics"
					width={180}
					height={60}
					className="h-10 sm:h-12 md:h-14 w-auto"
					priority
				/>
			</Link>

			{/* Desktop menu - unchanged */}
			<div className="hidden md:flex items-center gap-6 lg:gap-8 font-sans">
				<a
					href="/#what-we-do"
					className="text-sm text-cream/70 hover:text-rose transition-colors"
				>
					What We Do
				</a>
				<a
					href="/packages"
					className="text-sm text-cream/70 hover:text-rose transition-colors"
				>
					Packages
				</a>
				<a
					href="/#testimonials"
					className="text-sm text-cream/70 hover:text-rose transition-colors"
				>
					Testimonials
				</a>
				<a
					href="/#faq"
					className="text-sm text-cream/70 hover:text-rose transition-colors"
				>
					FAQ
				</a>
				<a
					href="/audit"
					className="text-sm text-cream/70 hover:text-rose transition-colors"
				>
					Free Audit
				</a>
				<a
					href="/contact"
					className="bg-rose text-charcoal px-4 lg:px-6 py-2 rounded-full font-bold hover:bg-burgundy hover:text-cream transition-all text-sm"
				>
					Contact
				</a>
			</div>

			<button
				onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				className="md:hidden z-50 text-cream p-2 transition-transform duration-300 hover:scale-110 active:scale-95"
				aria-label="Toggle menu"
			>
				{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			{isMobileMenuOpen && (
				<div className="fixed inset-0 bg-burgundy/98 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300">
					<div className="flex flex-col items-center justify-center h-full gap-8 font-sans">
						<a
							href="/#what-we-do"
							className="text-xl text-cream hover:text-rose transition-all hover:scale-110 animate-in slide-in-from-top-4 fade-in duration-500"
							style={{
								animationDelay: "100ms",
								animationFillMode: "backwards",
							}}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							What We Do
						</a>
						<a
							href="/packages"
							className="text-xl text-cream hover:text-rose transition-all hover:scale-110 animate-in slide-in-from-top-4 fade-in duration-500"
							style={{
								animationDelay: "150ms",
								animationFillMode: "backwards",
							}}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Packages
						</a>
						<a
							href="/#testimonials"
							className="text-xl text-cream hover:text-rose transition-all hover:scale-110 animate-in slide-in-from-top-4 fade-in duration-500"
							style={{
								animationDelay: "200ms",
								animationFillMode: "backwards",
							}}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Testimonials
						</a>
						<a
							href="/#faq"
							className="text-xl text-cream hover:text-rose transition-all hover:scale-110 animate-in slide-in-from-top-4 fade-in duration-500"
							style={{
								animationDelay: "250ms",
								animationFillMode: "backwards",
							}}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							FAQ
						</a>
						<a
							href="/audit"
							className="text-xl text-cream hover:text-rose transition-all hover:scale-110 animate-in slide-in-from-top-4 fade-in duration-500"
							style={{
								animationDelay: "300ms",
								animationFillMode: "backwards",
							}}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Free Audit
						</a>
						<a
							href="/contact"
							className="bg-rose text-charcoal px-10 py-4 rounded-full font-bold hover:bg-cream hover:text-burgundy transition-all text-xl mt-6 hover:scale-110 hover:shadow-lg animate-in slide-in-from-top-4 fade-in duration-500"
							style={{
								animationDelay: "350ms",
								animationFillMode: "backwards",
							}}
							onClick={() => setIsMobileMenuOpen(false)}
						>
							Contact
						</a>
					</div>
				</div>
			)}
		</nav>
	);
}
