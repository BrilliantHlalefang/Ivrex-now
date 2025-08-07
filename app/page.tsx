import Hero from "@/components/hero"
import ProblemsAndSolutions from "@/components/problems-and-solutions"
import ToolsSection from "@/components/tools-section"
import MarketNews from "@/components/market-news"
import CallToAction from "@/components/call-to-action"
import FAQSection from "@/components/faq-section"
import MiniMarketWatch from "@/components/mini-market-watch"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />
      <ProblemsAndSolutions />
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="space-y-8">
            <MiniMarketWatch />
          </div>
        </div>
      </div>
      <ToolsSection />
      <MarketNews />
      <FAQSection />
      <CallToAction />
    </div>
  )
}
