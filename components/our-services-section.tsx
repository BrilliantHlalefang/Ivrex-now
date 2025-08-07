"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ServiceCard from "@/components/service-card"

export default function OurServices() {
    const [selectedService, setSelectedService] = useState(0)

  const services = [
      {
        title: "Synthetic Trading Signals",
        description: "Professional trading signals with up to 85% accuracy for synthetic indices markets.",
        details: [
          "Index Name – e.g., VIX75, Boom 1000",
          "Trade Direction – Buy (long) or Sell (short)",
          "Entry Price",
          "Stop Loss (SL) – to limit potential losses",
          "Take Profit (TP) – target profit level",
          "Time Frame – e.g., M15 (15-minute chart), H1, etc.",
        ],
        pricing: "M300 Weekly / M1000 Monthly",
      },
      {
        title: "Mentorship Programs",
        description: "Structured guidance designed to help you improve your trading skills with experienced traders.",
        details: [
          "Group Mentorship (10 individuals) - M1000",
          "Online Mentorship (via Zoom/Google Meet) - M2000",
          "Physical Classes (at our offices) - M3000",
          "One-on-One Coaching (Private) - M5000",
        ],
        pricing: "From M1000",
      },
      {
        title: "Forex Signals",
        description: "Trade recommendations for buying or selling currency pairs in the foreign exchange market.",
        details: [
          "Real-time signals",
          "Trade management updates",
          "Daily recap",
          "SL & TP and entry prices",
          "Clearly defined risk-reward ratios",
        ],
        pricing: "M250 Weekly",
      },
      {
        title: "Copy Trading",
        description: "Automatically replicate trades from our experienced traders with proven track records.",
        details: [
          "Fully managed trading master account",
          "Performance reports",
          "Risk-controlled strategies",
          "Withdraw once in 30 days",
        ],
        pricing: "M1000 Monthly",
      },
      {
        title: "Pool Accounts",
        description: "A secure collective trading account that generates returns from large-scale IVREX operations.",
        details: ["Trade Transparency", "Institutional-grade strategies", "Real-time reporting", "Sustainable ROI"],
        pricing: "Contact for pricing",
      },
      {
        title: "Deriv Payment Agent",
        description: "Fast and secure deposit and withdrawal services for Deriv platform users.",
        details: [
          "Instant deposits & withdrawals",
          "Low processing fees",
          "Support included",
          "Licensed and approved Deriv agent",
        ],
        pricing: "Competitive fees",
      },
  ]

  return (
      <section id="our-services" className="container py-12">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive trading solutions designed to help you succeed in today&apos;s complex financial markets.
              </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
                {services.map((service, index) => (
                    <Button
                        key={index}
                        variant={selectedService === index ? "default" : "outline"}
                        onClick={() => setSelectedService(index)}
                        className="w-full justify-start text-left"
                    >
                        {service.title}
                    </Button>
                ))}
            </div>
            <div className="md:col-span-2">
                {selectedService !== null && (
                    <ServiceCard
                        {...services[selectedService]}
                    />
                )}
            </div>
        </div>
      </section>
  )
}