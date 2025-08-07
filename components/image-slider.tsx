"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageSliderProps {
  images: string[]
  autoPlayInterval?: number
}

export default function ImageSlider({ images, autoPlayInterval = 5000 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  useEffect(() => {
    const slideInterval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(slideInterval)
  }, [currentIndex])

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full bg-center bg-cover duration-500 rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      >
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Left Arrow */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2">
        <Button
          onClick={goToPrevious}
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Right Arrow */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2">
        <Button
          onClick={goToNext}
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentIndex === slideIndex ? "bg-primary" : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}
