import { Card, CardContent } from "@/components/ui/card"
import { Phone, UserCheck, Mail, MessageCircle } from "lucide-react"

/**
 * Process section component
 * Explains the 4-step process for working with Cher Digital
 */
const processSteps = [
  {
    icon: Phone,
    title: "Reach Out",
    description: "Contact us to start—just email or call. No forms, no hassle.",
  },
  {
    icon: UserCheck,
    title: "Personal Onboarding",
    description: "We'll connect with you to understand your goals and help set up tracking for tools you already use.",
  },
  {
    icon: Mail,
    title: "Monthly Reports Made Easy",
    description:
      "You'll receive clear email reports every month, with a quick review explaining what's working and what can improve.",
  },
  {
    icon: MessageCircle,
    title: "Ongoing Support",
    description: "Whenever you have a question, simply email—real answers, no robots.",
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="w-full py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">What to Expect</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Simple, personal, and straightforward—here's how we work together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={index} className="border-border bg-background hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
