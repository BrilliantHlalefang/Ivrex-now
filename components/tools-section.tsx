import EconomicCalendar from "./economic-calendar"
import WeeklySchedule from "./weekly-schedule"

export default function ToolsSection() {
  return (
    <section id="tools" className="container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Trading Tools</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of tools to help you with your trading analysis.
        </p>
      </div>
      <EconomicCalendar />
      <WeeklySchedule />
    </section>
  )
} 