"use client";

import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Site header component with navigation
 * Magazine-style fixed header with search functionality
 */
export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-olive/95 backdrop-blur-sm border-b border-cream/10">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="text-2xl md:text-3xl font-bold tracking-tight text-cream hover:text-rose transition-colors"
					>
						Cher Digital
					</Link>

					<nav className="hidden md:flex items-center gap-8">
						<a
							href="/#what-we-do"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
						>
							What We Do
						</a>
						<Link
							href="/packages"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
						>
							Packages
						</Link>
						<a
							href="/#process"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
						>
							Process
						</a>
						<a
							href="/#testimonials"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
						>
							Testimonials
						</a>
						<a
							href="/#faq"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
						>
							FAQ
						</a>

						<div className="flex items-center gap-2">
							<div
								className={`overflow-hidden transition-all duration-500 ease-in-out ${
									isSearchOpen ? "w-64 opacity-100" : "w-0 opacity-0"
								}`}
							>
								<input
									type="text"
									placeholder="Search..."
									className="w-full px-6 py-2 bg-charcoal/50 border border-cream/30 rounded-full text-cream placeholder:text-cream/50 focus:outline-none focus:border-rose transition-colors"
									autoFocus={isSearchOpen}
								/>
							</div>
							<button
								onClick={() => setIsSearchOpen(!isSearchOpen)}
								className="text-cream hover:text-rose transition-colors p-2"
								aria-label="Search"
							>
								<Search size={20} />
							</button>
						</div>

						<Link href="/contact">
							<Button className="bg-rose text-charcoal hover:bg-burgundy hover:text-cream transition-all rounded-full">
								Contact Us
							</Button>
						</Link>
					</nav>

					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden text-cream"
					>
						{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{isMenuOpen && (
					<nav className="md:hidden mt-6 pb-4 flex flex-col gap-4">
						<a
							href="/#what-we-do"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
							onClick={() => setIsMenuOpen(false)}
						>
							What We Do
						</a>
						<Link
							href="/packages"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
							onClick={() => setIsMenuOpen(false)}
						>
							Packages
						</Link>
						<a
							href="/#process"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
							onClick={() => setIsMenuOpen(false)}
						>
							Process
						</a>
						<a
							href="/#testimonials"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
							onClick={() => setIsMenuOpen(false)}
						>
							Testimonials
						</a>
						<a
							href="/#faq"
							className="text-cream hover:text-rose transition-colors text-sm tracking-widest uppercase font-mono"
							onClick={() => setIsMenuOpen(false)}
						>
							FAQ
						</a>
						<Link href="/contact" onClick={() => setIsMenuOpen(false)}>
							<Button className="bg-rose text-charcoal hover:bg-burgundy hover:text-cream transition-all w-full rounded-full">
								Contact Us
							</Button>
						</Link>
					</nav>
				)}
			</div>
		</header>
	);
}
