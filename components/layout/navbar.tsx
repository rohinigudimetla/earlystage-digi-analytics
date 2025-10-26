import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="absolute top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
			<Link
				href="/"
				className="text-2xl md:text-3xl font-black tracking-tighter text-cream font-sans"
			>
				CHER DIGITAL
			</Link>
			<div className="hidden md:flex items-center gap-8 font-sans">
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
					className="bg-rose text-charcoal px-6 py-2 rounded-full font-bold hover:bg-burgundy hover:text-cream transition-all"
				>
					Contact
				</a>
			</div>
		</nav>
	);
}
