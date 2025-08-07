import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FAQSection() {
  return (
    <section className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our services and how we can help you succeed in trading.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Common Questions</CardTitle>
          <CardDescription>Everything you need to know about our trading services</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What are the different mentorship options available?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  We offer four different mentorship options to suit your learning style and budget:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Group Mentorship (M1000):</strong> Join a group of 10 individuals and learn together.
                  </li>
                  <li>
                    <strong>Online Mentorship (M2000):</strong> Learn strictly online through platforms like Zoom and
                    Google Meet.
                  </li>
                  <li>
                    <strong>Physical Classes (M3000):</strong> Come to our offices and learn from our expert coaches in
                    person.
                  </li>
                  <li>
                    <strong>One-on-One Coaching (M5000):</strong> Get dedicated time and personalized instruction from
                    beginner to advanced level.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What's included in your Forex Signals service?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">Our Forex Signals service (M250 weekly) includes:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Real-time signals</li>
                  <li>Trade management updates</li>
                  <li>Daily recap</li>
                  <li>Stop Loss & Take Profit levels</li>
                  <li>Entry prices</li>
                  <li>Clearly defined risk-reward ratios</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>What are Synthetic Indices and how do your signals work?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Synthetic indices are computer-generated markets that simulate real-world volatility but operate 24/7
                  and aren't affected by real-world events. They're based on cryptographically secure random number
                  generators.
                </p>
                <p className="mb-2">Our Synthetic Indices Signals (M300 weekly/M1000 monthly) include:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Index Name (e.g., VIX75, Boom 1000)</li>
                  <li>Trade Direction (Buy/Sell)</li>
                  <li>Entry Price</li>
                  <li>Stop Loss levels</li>
                  <li>Take Profit targets</li>
                  <li>Time Frame information</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How does Copy Trading work with Ivrex?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Our Copy Trading service (M1000 monthly) allows you to automatically replicate trades from our
                  experienced traders. It includes:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>A fully managed trading master account where your account is linked</li>
                  <li>Regular performance reports</li>
                  <li>Risk-controlled strategies</li>
                  <li>Option to withdraw once every 30 days</li>
                </ul>
                <p className="mt-2 italic">
                  "Why fund your own incompetence, when you can leverage someone's experience?"
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>What is a Pool Account and who is it for?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  A Pool Account is a secure collective trading account that generates returns from large-scale Ivrex
                  operations. It features:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Trade Transparency</li>
                  <li>Institutional-grade strategies</li>
                  <li>Real-time reporting</li>
                  <li>Sustainable ROI</li>
                </ul>
                <p className="mt-2">
                  Pool Accounts are ideal for passive income seekers, busy professionals, and small capital investors
                  who want their "money to join the fight – and return with more."
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>What Deriv Payment Agent services do you offer?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  As a licensed and approved Deriv agent, we help local traders deposit and withdraw funds using local
                  payment methods like EcoCash and Mpesa. Our services include:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Instant deposits & withdrawals</li>
                  <li>Low processing fees</li>
                  <li>Dedicated support</li>
                  <li>Secure transactions</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
