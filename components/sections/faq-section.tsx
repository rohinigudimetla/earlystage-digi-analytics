import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/**
 * FAQ section component
 * Answers common questions about services and pricing
 */
const faqs = [
  {
    question: "How do I get started?",
    answer:
      "Simply reach out via email or phone. We'll have a quick conversation to understand your goals and current setup. No forms to fill out—just a friendly chat to see how we can help.",
  },
  {
    question: "How will I receive my reports?",
    answer:
      "You'll receive clear, easy-to-read email reports every month. Each report includes a summary of what's working, what needs attention, and actionable recommendations. We'll also schedule a brief call to walk through the highlights if you'd like.",
  },
  {
    question: "Do I need technical knowledge?",
    answer:
      "Not at all! We handle all the technical setup and present insights in plain English. If you ever have questions, just email us—we're here to help you understand your data, not confuse you with jargon.",
  },
  {
    question: "How do you communicate with clients?",
    answer:
      "Everything is personal and direct. We communicate via email and phone calls—no automated systems or chatbots. When you reach out, you'll get real answers from real people who know your business.",
  },
  {
    question: "What if I'm already using Google Analytics?",
    answer:
      "Perfect! We'll review your current setup, fix any tracking issues, and enhance it with additional insights. You'll get clearer, more actionable reports that help you make better business decisions.",
  },
  {
    question: "Can I upgrade or downgrade my package?",
    answer:
      "Absolutely. As your business grows or your needs change, you can switch packages anytime. Just let us know, and we'll adjust your service accordingly—no hassle, no long-term contracts.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="w-full py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about working with Cher Digital Analytics.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
