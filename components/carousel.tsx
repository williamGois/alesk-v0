"use client"

import * as React from "react"
import Image from "next/image"

interface CarouselProps {
  images: string[]
  autoRotate?: boolean
  interval?: number
}

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export function Carousel({ images, autoRotate = true, interval = 5000 }: CarouselProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  useInterval(() => {
    setActiveIndex(prevIndex => (prevIndex + 1) % images.length)
  }, autoRotate ? interval : null)

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image src={image} alt={`Slide ${index + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full transition-colors duration-300 ${
              index === activeIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

