"use client"
import { useState, useEffect } from 'react'
import MediaCard from '@/components/MediaCard'
import { getTVShows, TVShow } from '@/lib/api'

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTVShows() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getTVShows()
        setTVShows(data.results)
      } catch (error) {
        console.error('Failed to fetch TV shows:', error)
        setError('Failed to load TV shows. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTVShows()
  }, [])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">TV Shows</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {tvShows.map((show) => (
            <MediaCard key={show.id} item={show} />
          ))}
        </div>
      </div>
    </div>
  )
}