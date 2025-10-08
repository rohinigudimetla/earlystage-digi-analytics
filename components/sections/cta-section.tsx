import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

/**
 * Call-to-action section component
 * Encourages visitors to contact the business (button links to contact page only)
 */
export function CTASection() {
  return (
    <section className="w-full py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-foreground mb-4">Contact Us</h2>
          <p className="text-lg text-secondary-foreground/80 mb-2 leading-relaxed">
            All reports and communications are handled directly by email, so it's always personal.
          </p>
          <p className="text-base text-secondary-foreground/70 mb-8 leading-relaxed">
            Ready to get started? Reach out today.
          </p>

          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get In Touch
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
