import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Michael T.",
      role: "Retail Trader",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "The synthetic trading signals have completely transformed my trading. I've seen a 32% increase in my portfolio since joining Ivrex three months ago.",
      rating: 5,
    },
    {
      name: "Sarah K.",
      role: "Professional Investor",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "The mentorship program provided invaluable insights that I couldn't find elsewhere. My mentor helped me develop a strategy that works for my risk tolerance and goals.",
      rating: 5,
    },
    {
      name: "Robert J.",
      role: "Business Client",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "Managing our pool account through Ivrex has been seamless. The transparency and detailed reporting give us complete confidence in our investment.",
      rating: 4,
    },
    {
      name: "Emily L.",
      role: "Copy Trader",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "As someone with limited time to analyze markets, the copy trading feature has been a game-changer. I can now participate in markets while focusing on my career.",
      rating: 5,
    },
  ]

  return (
    <section className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. Here's what traders and investors have to say about Ivrex.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="bg-primary/10 p-6 md:w-1/3 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex mt-2">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    {Array(5 - testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-muted-foreground" />
                      ))}
                  </div>
                </div>
                <div className="p-6 md:w-2/3 flex items-center">
                  <blockquote className="italic text-muted-foreground">"{testimonial.content}"</blockquote>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8">
          {[
            "/placeholder.svg?height=50&width=120",
            "/placeholder.svg?height=50&width=120",
            "/placeholder.svg?height=50&width=120",
            "/placeholder.svg?height=50&width=120",
            "/placeholder.svg?height=50&width=120",
          ].map((logo, index) => (
            <img
              key={index}
              src={logo || "/placeholder.svg"}
              alt={`Partner ${index + 1}`}
              className="h-12 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
