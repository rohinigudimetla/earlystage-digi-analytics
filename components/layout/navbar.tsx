import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
	return (
		<nav className="sticky top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex items-center justify-between">
			<Link href="/" className="relative">
				<Image
					src="/cher (1)-cropped.svg"
					alt="Cher Digital Analytics"
					width={180}
					height={60}
					className="h-14 w-auto"
					priority
				/>
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
