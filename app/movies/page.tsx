"use client"
import { useState, useEffect } from 'react'
import MediaCard from '@/components/MediaCard'
import { getMovies, TrendingMovie } from '@/lib/api'

export default function MoviesPage() {
  const [movies, setMovies] = useState<TrendingMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMovies()
        setMovies(data.results)
      } catch (error) {
        console.error('Failed to fetch movies:', error)
        setError('Failed to load movies. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
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
        <h1 className="text-3xl font-bold mb-8">Movies</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MediaCard key={movie.id} item={movie} />
          ))}
        </div>
      </div>
    </div>
  )
}