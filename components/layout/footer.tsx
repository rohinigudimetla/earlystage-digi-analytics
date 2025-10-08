import Link from "next/link"

/**
 * Site footer component
 * Contains copyright, links, and contact information (plain text, no clickable contact links)
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-serif font-bold text-foreground mb-3">Cher Digital Analytics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering local brands with simple dashboards and actionable insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#what-we-do"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  What We Do
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Get In Touch</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">(555) 123-4567</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">hello@cherdigital.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cher Digital Analytics. All rights reserved.
            </p>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
