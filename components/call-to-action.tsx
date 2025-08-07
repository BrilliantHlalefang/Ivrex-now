import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
  return (
    <section className="container py-16">
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black z-0" />

        <div className="relative z-10 px-6 py-12 md:p-16 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Trading Experience?</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who have already discovered the Ivrex advantage. Start with a free trial of our
              synthetic trading signals today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth?tab=signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/support">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm opacity-80">
              No credit card required. 7-day free trial with full access to trading signals.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
