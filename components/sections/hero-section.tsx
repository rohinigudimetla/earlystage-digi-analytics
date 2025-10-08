import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Hero section component for landing page
 * Features main value proposition and CTA
 */
export function HeroSection() {
	return (
		<section className="relative w-full py-20 overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Text Content */}
					<div className="space-y-6">
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
							Discover What Drives Your Business.
						</h1>
						<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
							Get honest insights, easy reports and support you can trust.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<Link href="/contact">
								<Button
									size="lg"
									className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
								>
									Get Started Today
								</Button>
							</Link>
							<Link href="/#what-we-do">
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto bg-transparent"
								>
									Learn More
								</Button>
							</Link>
						</div>
					</div>

					{/* Visual Element */}
					<div className="relative">
						<div className="max-w-md mx-auto aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 flex items-center justify-center">
							<img
								src="/hero-analytics-art.jpg"
								alt="Simple flat illustration representing data insights with yellow and coral red colors"
								className="w-full h-full object-contain rounded-lg"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
