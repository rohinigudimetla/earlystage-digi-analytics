import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Privacy policy page
 * Placeholder for privacy information
 */
export default function PrivacyPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 py-20">
				<div className="container mx-auto px-6">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
							Privacy Policy
						</h1>

						<Card className="border-border">
							<CardContent className="pt-6 prose prose-slate max-w-none">
								<p className="text-muted-foreground leading-relaxed mb-6">
									Last updated: {new Date().toLocaleDateString()}
								</p>

								<h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">
									Our Commitment to Privacy
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-6">
									At Cher Digital Analytics, we take your privacy seriously.
									This privacy policy outlines how we collect, use, and protect
									your information when you use our services.
								</p>

								<h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">
									Information We Collect
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-6">
									We collect information necessary to provide our analytics
									services, including business contact information, website
									analytics data, and communication records. All data is handled
									with strict confidentiality.
								</p>

								<h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">
									How We Use Your Information
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-6">
									Your information is used solely to deliver our analytics
									services, provide monthly reports, and communicate with you
									about your account. We never sell or share your data with
									third parties for marketing purposes.
								</p>

								<h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">
									Data Security
								</h2>
								<p className="text-muted-foreground leading-relaxed mb-6">
									We implement industry-standard security measures to protect
									your data. All client information is stored securely and
									accessed only by authorized team members.
								</p>

								<h2 className="text-2xl font-serif font-bold text-foreground mt-8 mb-4">
									Contact Us
								</h2>
								<p className="text-muted-foreground leading-relaxed">
									If you have questions about this privacy policy, please
									contact us at{" "}
									<a
										href="mailto:hello@cherdigital.com"
										className="text-primary hover:underline"
									>
										hello@cherdigital.com
									</a>{" "}
									or call{" "}
									<a
										href="tel:+15551234567"
										className="text-primary hover:underline"
									>
										(555) 123-4567
									</a>
									.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
