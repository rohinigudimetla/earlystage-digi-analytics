import Link from "next/link";

/**
 * Mobile-first footer that preserves desktop layout via responsive modifiers.
 */
export function Footer() {
	return (
		<footer className="bg-charcoal py-12 md:py-16 px-4 sm:px-6 border-t border-cream/10">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
					{/* Brand */}
					<div className="text-center sm:text-left">
						<h3 className="text-xl md:text-2xl font-black text-cream mb-3 md:mb-4">
							Cher Digital Analytics
						</h3>
						<p className="text-cream/60 text-sm leading-relaxed">
							Empowering local brands with simple dashboards and actionable
							insights.
						</p>
					</div>

					{/* Quick Links */}
					<div className="text-center sm:text-left">
						<h4 className="text-rose text-sm tracking-wider uppercase font-bold mb-3 md:mb-4">
							Quick Links
						</h4>
						<ul className="space-y-2 md:space-y-3">
							<li>
								<a
									href="/#what-we-do"
									className="text-cream/80 hover:text-rose transition-colors text-sm"
								>
									What We Do
								</a>
							</li>
							<li>
								<a
									href="/#testimonials"
									className="text-cream/80 hover:text-rose transition-colors text-sm"
								>
									Testimonials
								</a>
							</li>
							<li>
								<a
									href="/#faq"
									className="text-cream/80 hover:text-rose transition-colors text-sm"
								>
									FAQ
								</a>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-cream/80 hover:text-rose transition-colors text-sm"
								>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div className="text-center sm:text-left sm:col-span-2 md:col-span-1">
						<h4 className="text-rose text-sm tracking-wider uppercase font-bold mb-3 md:mb-4">
							Get In Touch
						</h4>
						<ul className="space-y-2 md:space-y-3">
							<li>
								<span className="text-cream/80 text-sm">(413) 377-8945</span>
							</li>
							<li>
								<span className="text-cream/80 text-sm">
									hello@cherdigitalanalytics.com
								</span>
							</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-cream/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
					<p className="text-cream/40 text-xs text-center md:text-left">
						© {new Date().getFullYear()} Cher Digital Analytics. All rights
						reserved.
					</p>
					<Link
						href="/privacy"
						className="text-cream/40 hover:text-rose transition-colors text-xs"
					>
						Privacy Policy
					</Link>
				</div>
			</div>
		</footer>
	);
}
