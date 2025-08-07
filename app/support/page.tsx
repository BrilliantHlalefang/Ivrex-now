import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Phone, Mail, MessageSquare } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Call Center & Support</h1>

      <Tabs defaultValue="contact" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Fill out the form below and our support team will get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Please describe your issue in detail..." rows={5} />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit Request</Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="hover:bg-muted/50 transition-colors">
              <a href="tel:+26653031535" className="block h-full w-full">
                <CardContent className="pt-6 px-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Phone Support</h3>
                    <p className="text-muted-foreground">+266 5303 1535</p>
                    <p className="text-muted-foreground text-sm">Mon-Fri: 9AM-5PM EST</p>
                  </div>
                </CardContent>
              </a>
            </Card>

            <Card className="hover:bg-muted/50 transition-colors">
              <a href="mailto:mohaumosotho586@gmail.com" className="block h-full w-full">
                <CardContent className="pt-6 px-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Email Support</h3>
                    <p className="text-muted-foreground break-words">ivrexforexclassics@gmail.com</p>
                    <p className="text-muted-foreground text-sm">24/7 Response</p>
                  </div>
                </CardContent>
              </a>
            </Card>

            <Card className="hover:bg-muted/50 transition-colors">
              <a href="https://wa.me/26659457496" target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                <CardContent className="pt-6 px-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-primary/10 p-3 rounded-full mb-4">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
                    <p className="text-muted-foreground">+266 5945 7496</p>
                    <p className="text-muted-foreground text-sm">Available 24/7</p>
                  </div>
                </CardContent>
              </a>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions about our services.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How accurate are your trading signals?</AccordionTrigger>
                  <AccordionContent>
                    Our professional trading signals have demonstrated a historical accuracy rate of 75-85% depending on
                    market conditions. We continuously refine our strategies to improve performance and adapt to
                    changing market dynamics.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How does copy trading work?</AccordionTrigger>
                  <AccordionContent>
                    Copy trading allows you to automatically replicate the trades of experienced traders in your own
                    account. Once you select a trader to follow, our system will execute the same trades in your account
                    proportional to your investment size. You maintain full control and can stop copying at any time.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>What are pool accounts?</AccordionTrigger>
                  <AccordionContent>
                    Pool accounts combine funds from multiple investors into a single managed trading account. This
                    allows for greater market access and potentially higher returns through economies of scale. Each
                    investor owns a percentage of the pool proportional to their investment.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I become a Deriv payment agent?</AccordionTrigger>
                  <AccordionContent>
                    To become a Deriv payment agent, you need to apply through our platform. Requirements include
                    verification of identity, proof of financial stability, and compliance with local regulations. Our
                    team will guide you through the application process.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>What mentorship programs do you offer?</AccordionTrigger>
                  <AccordionContent>
                    We offer various mentorship programs ranging from beginner to advanced levels. Programs include
                    one-on-one coaching, group webinars, strategy development, and specialized courses on technical
                    analysis, risk management, and psychological aspects of trading.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>How secure is my data and investment?</AccordionTrigger>
                  <AccordionContent>
                    We implement bank-grade security measures including SSL encryption, two-factor authentication, and
                    regular security audits. Client funds are held in segregated accounts, and we maintain comprehensive
                    insurance coverage for additional protection.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept various payment methods including credit/debit cards, bank transfers, e-wallets (Skrill,
                    Neteller, PayPal), and cryptocurrencies (Bitcoin, Ethereum, USDT). Available methods may vary by
                    region.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8">
                  <AccordionTrigger>Can I try your services before subscribing?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer a 7-day free trial for our synthetic trading signals service. This allows you to
                    experience the quality and accuracy of our signals before committing to a subscription. Some
                    mentorship programs also offer introductory sessions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Support</CardTitle>
              <CardDescription>Connect with our support team on WhatsApp for immediate assistance.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Chat with us on WhatsApp</h3>
                <p className="text-muted-foreground mb-4">
                  Our agents are available 24/7 to help with any questions or issues.
                </p>
                <Button asChild>
                  <a href="https://wa.me/26659457496" target="_blank" rel="noopener noreferrer">
                    Open WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
