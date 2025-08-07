import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MessageSquare, LifeBuoy } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function CustomerSupport({ showCardWrapper = true }: { showCardWrapper?: boolean }) {
  const content = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button variant="outline" asChild>
          <a href="mailto:mohaumosotho586@gmail.com">
            <Mail className="mr-2 h-4 w-4" />
            Email Support
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="tel:+1234567890">
            <Phone className="mr-2 h-4 w-4" />
            Phone Support
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium mb-2">Quick Answers</h4>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I deposit funds?</AccordionTrigger>
            <AccordionContent>
              You can deposit funds through various methods including credit card, bank transfer, and cryptocurrency.
              Navigate to the "Deriv Payments" tab for more details.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is there a mobile app?</AccordionTrigger>
            <AccordionContent>
              Yes, our mobile app is available for both iOS and Android. You can download it from the App Store or
              Google Play.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How can I change my password?</AccordionTrigger>
            <AccordionContent>
              You can change your password from the "Settings" page, which is accessible from the sidebar menu.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )

  if (showCardWrapper) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-md">
              <LifeBuoy className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <CardTitle>Customer Support</CardTitle>
              <CardDescription>Get help with any questions or issues.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    )
  }

  return content
} 