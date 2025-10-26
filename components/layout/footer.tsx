import Link from "next/link";

/**
 * Site footer component
 * Magazine-style footer with brand info and links
 */
export function Footer() {
	return (
		<footer className="bg-charcoal py-16 px-6 border-t border-cream/10">
			<div className="max-w-7xl mx-auto">
				<div className="grid md:grid-cols-3 gap-12 mb-12">
					{/* Brand */}
					<div>
						<h3 className="text-2xl font-black text-cream mb-4">
							Cher Digital Analytics
						</h3>
						<p className="text-cream/60 text-sm leading-relaxed">
							Empowering local brands with simple dashboards and actionable
							insights.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-rose text-sm tracking-wider uppercase font-bold mb-4">
							Quick Links
						</h4>
						<ul className="space-y-3">
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
					<div>
						<h4 className="text-rose text-sm tracking-wider uppercase font-bold mb-4">
							Get In Touch
						</h4>
						<ul className="space-y-3">
							<li>
								<span className="text-cream/80 text-sm">(555) 123-4567</span>
							</li>
							<li>
								<span className="text-cream/80 text-sm">
									hello@cherdigital.com
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-cream/40 text-xs">
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
