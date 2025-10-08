import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Site header component with navigation
 * Displays logo and navigation links with responsive design
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-secondary">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-serif font-bold text-secondary-foreground">Cher Digital Analytics</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#what-we-do"
            className="text-sm font-medium text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
          >
            What We Do
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium text-secondary-foreground/80 hover:text-secondary-foreground transition-colors"
          >
            FAQ
          </Link>
          <Link href="/contact">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Contact Us
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <Link href="/contact" className="md:hidden">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Contact
          </Button>
        </Link>
      </div>
    </header>
  )
}
