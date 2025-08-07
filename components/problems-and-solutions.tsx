"use client"

import { useEffect, useRef, useState } from "react"

export default function ProblemsAndSolutions() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const problemsAndSolutions = [
    {
      problem: {
        icon: "📢",
        title: "Market Noise and Overload",
        description: "Too much information, yet too little structure. Traders are overwhelmed by unfiltered signals, indicators, and social media hype."
      },
      solution: {
        icon: "👨‍🏫",
        title: "IVREX Mentorship Infrastructure",
        description: "A clear path from beginner to structural trader. Daily, weekly, and monthly rhythms for structured learning and alignment."
      }
    },
    {
      problem: {
        icon: "🧠",
        title: "Lack of Mentorship & Psychological Guidance",
        description: "Most traders start alone. They mimic, gamble, or follow \"quick money\" channels. Emotional instability and impatience lead to account destruction."
      },
      solution: {
        icon: "📈",
        title: "Signals & Copy Trading Services",
        description: "For those still learning, IVREX provides trusted, structured access to profitable strategies. You earn while you learn—without jumping in blind."
      }
    },
    {
      problem: {
        icon: "💰",
        title: "Disconnected from the Real Economy",
        description: "Many traders don't understand what they're trading. Trading becomes speculation, not structural participation in the economy."
      },
      solution: {
        icon: "🔧",
        title: "Economic Participation Training",
        description: "Our traders understand how money moves through countries, industries, and banks. We teach them to become economic thinkers—not gamblers."
      }
    },
    {
      problem: {
        icon: "👥",
        title: "Lack of Access and Tools for Beginners",
        description: "Beginners can't afford to lose money while learning. Many don't know where to start."
      },
      solution: {
        icon: "👫",
        title: "A Community with a Shared Language",
        description: "Traders grow through mentorship circles, accountability partners, and aligned groups. We all speak the same language."
      }
    }
  ]

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          if (entry.isIntersecting) {
            setVisibleItems(prev => [...prev, index])
          } else {
            setVisibleItems(prev => prev.filter(item => item !== index))
          }
        })
      },
      { threshold: 0.1 }
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observerRef.current?.observe(ref)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el
  }

  return (
    <section className="container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-foreground">IVREX: Problems & Solutions</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Understanding the challenges traders face and how IVREX provides structured solutions
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold text-lg rounded-lg">
              PROBLEMS
            </div>
          </div>
          <div className="text-center">
            <div className="inline-block px-6 py-3 bg-secondary text-secondary-foreground font-bold text-lg rounded-lg">
              SOLUTIONS
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {problemsAndSolutions.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Problem */}
              <div
                ref={setItemRef(index * 2)}
                data-index={index * 2}
                className={`bg-card border border-border rounded-lg p-6 transition-all duration-800 ${
                  visibleItems.includes(index * 2)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-12'
                } border-l-4 border-l-primary`}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3 text-primary">{item.problem.icon}</span>
                  <h3 className="font-semibold text-lg text-foreground">{item.problem.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.problem.description}</p>
              </div>

              {/* Solution */}
              <div
                ref={setItemRef(index * 2 + 1)}
                data-index={index * 2 + 1}
                className={`bg-card border border-border rounded-lg p-6 transition-all duration-800 ${
                  visibleItems.includes(index * 2 + 1)
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-12'
                } border-r-4 border-r-secondary`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3 text-secondary">{item.solution.icon}</span>
                  <h3 className="font-semibold text-lg text-foreground">{item.solution.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{item.solution.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}