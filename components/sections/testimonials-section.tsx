import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

/**
 * Testimonials section component
 * Displays client success stories and feedback
 */
const testimonials = [
  {
    quote:
      "The monthly email reports are so easy to understand—no confusing jargon. I finally know what's working and what's not. I feel supported, not overwhelmed with data.",
    author: "Maria Santos",
    business: "Bloom Flower Shop",
    location: "Seattle, WA",
  },
  {
    quote:
      "Cher Digital's reports helped us see which Facebook ads actually brought people through our door. We cut our ad spend by 40% and got better results. The personal touch makes all the difference.",
    author: "James Park",
    business: "Park's BBQ",
    location: "Austin, TX",
  },
  {
    quote:
      "As a small salon owner, I don't have time for complicated analytics. The email reports give me exactly what I need to know in plain English, and I can always reach out with questions. Worth every penny.",
    author: "Tanya Williams",
    business: "Radiance Hair Studio",
    location: "Portland, OR",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real results from real local businesses we've helped grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
