import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import ImageSlider from "@/components/image-slider"

export default function Hero() {
  const sliderImages = [
    "/slider/1.jpg",
    "/slider/2.jpg",
    "/slider/3.jpg",
    "/slider/4.jpg",
    "/slider/5.jpg",
    "/slider/6.jpg",
    "/slider/7.jpg",
    "/slider/8.jpg",
    "/slider/9.jpg",
    "/slider/10.jpg",
  ]

  return (
    <div
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/pic.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-0" />

      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Professional Trading <span className="text-primary">Solutions</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
              Professional trading signals, expert mentorship, and secure investment opportunities for traders of all
              levels.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth?tab=signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Join Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/support">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-30"></div>
            <div className="relative h-full bg-card rounded-lg overflow-hidden shadow-xl">
              <ImageSlider images={sliderImages} autoPlayInterval={5000} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
