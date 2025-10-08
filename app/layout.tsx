import type React from "react"
import type { Metadata } from "next"
import { Open_Sans, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Cher Digital Analytics | Simple Dashboards for Local Businesses",
  description:
    "We help local businesses discover what drives real foot traffic and sales using simple dashboards, transparent pricing, and AI-powered insights.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${montserrat.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
