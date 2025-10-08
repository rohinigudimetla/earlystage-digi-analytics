import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Service package type definition
 */
interface ServicePackage {
  icon: string
  name: string
  description: string
  price: string
  setupFee: string
  features: string[]
}

/**
 * What We Offer section component
 * Displays three service packages with transparent pricing
 */
const packages: ServicePackage[] = [
  {
    icon: "🌿",
    name: "Starter Insights Package",
    description: "Perfect for local businesses just getting started with analytics",
    price: "$299/month",
    setupFee: "$150 one-time setup fee",
    features: [
      "Google Analytics 4 setup and connection to your website",
      "Google Business Profile tracking (views, clicks, reviews, calls)",
      "Monthly email report (traffic, engagement, conversions)",
      "30-min monthly review call (plain-English results)",
      "Email summary with 3 key recommendations",
    ],
  },
  {
    icon: "☕",
    name: "Growth Insights Package",
    description: "For businesses ready to optimize their marketing spend",
    price: "$499/month",
    setupFee: "$200 one-time setup fee",
    features: [
      "Everything in Starter, plus:",
      "Facebook + Instagram ad performance tracking",
      "ROI analysis: cost per click, booking, or footfall",
      "Local keyword & competitor visibility report",
      "Actionable insights (what's working, what isn't)",
      "Monthly executive summary (PDF)",
    ],
  },
  {
    icon: "✨",
    name: "Premium Insights Partner Package",
    description: "Complete analytics partnership for growing businesses",
    price: "$799/month",
    setupFee: "$300 one-time setup fee",
    features: [
      "Everything in Growth, plus:",
      "Booking/POS data integration (Fresha, Square, Clover, etc.)",
      "Customer retention & loyalty tracking (new vs. repeat clients)",
      "Campaign scheduling insights (top days/hours)",
      "Quarterly strategy deep-dive presentation",
      "Priority support (48-hour turnaround)",
    ],
  },
]

/**
 * Process steps for working with Cher Digital
 */
const processSteps = [
  {
    number: "01",
    title: "Discovery Call",
    description: "15 minutes to find out your goals and current tools",
  },
  {
    number: "02",
    title: "Setup & Integration",
    description: "1 week for GA4, Google Business, Meta Ads setup",
  },
  {
    number: "03",
    title: "Monthly Reporting",
    description: "Ongoing automated tracking and monthly insights via email",
  },
  {
    number: "04",
    title: "Review & Recommend",
    description: "Monthly calls to discuss what's working and what to do next",
  },
]

export function WhatWeDoSection() {
  return (
    <section id="what-we-do" className="w-full py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Service Packages */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">What We Offer</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Three transparent packages designed for local businesses at every stage of growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {packages.map((pkg, index) => (
            <Card
              key={index}
              className={`border-border hover:shadow-xl transition-all ${
                index === 1 ? "md:scale-105 border-primary/50" : ""
              }`}
            >
              <CardHeader>
                <div className="text-4xl mb-4">{pkg.icon}</div>
                <CardTitle className="text-2xl font-serif mb-2">{pkg.name}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                  {pkg.description}
                </CardDescription>
                <div className="pt-4 border-t border-border">
                  <div className="text-3xl font-bold text-primary mb-1">{pkg.price}</div>
                  <div className="text-sm text-muted-foreground">{pkg.setupFee}</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mb-20">
          <Link href="/contact">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Process Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">Your Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              What to expect when you work with Cher Digital Analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
