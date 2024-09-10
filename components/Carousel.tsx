"use client"
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'
import { TrendingMovie, MovieDetails, MovieSearchResult, TVShow } from '@/lib/api'

interface CarouselProps {
  items: (TrendingMovie | MovieDetails | MovieSearchResult | TVShow)[];
}

export default function Carousel({ items }: CarouselProps) {
  const [startIndex, setStartIndex] = useState(0)

  const nextSlide = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const prevSlide = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  return (
    <div className="relative">
      <div className="flex overflow-hidden">
        {items.slice(startIndex, startIndex + 6).map((item) => (
          <div key={item.id} className="w-1/6 px-2">
            <MediaCard item={item} />
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}