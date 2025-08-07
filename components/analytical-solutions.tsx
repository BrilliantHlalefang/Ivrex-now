"use client"

import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronsUpDown, LineChart } from "lucide-react"
import EnhancedMarketWatch from "@/components/enhanced-market-watch"

export default function AnalyticalSolutions() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-md">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Analytical Solutions</CardTitle>
                <CardDescription>Live Market Data with Deriv API Integration</CardDescription>
              </div>
            </div>
            <CollapsibleTrigger asChild>
              <button className="p-1 rounded-md hover:bg-muted">
                <ChevronsUpDown className="h-5 w-5" />
                <span className="sr-only">Toggle</span>
              </button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent className="flex-1">
          <div className="h-full px-6 pb-6">
            <EnhancedMarketWatch />
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}