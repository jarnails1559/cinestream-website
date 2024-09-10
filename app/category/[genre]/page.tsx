"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MediaCard from '@/components/MediaCard'
import { getMoviesByGenre, TrendingMovie, genreMap } from '@/lib/api'

export default function CategoryPage() {
  const params = useParams()
  const encodedGenre = params.genre
  const genre = decodeURIComponent(encodedGenre as string).toLowerCase().replace(/-/g, ' ')
  const [movies, setMovies] = useState<TrendingMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMoviesByGenre() {
      setIsLoading(true)
      setError(null)
      try {
        console.log("Fetching movies for genre:", genre);
        const genreEntry = Object.entries(genreMap).find(([id, name]) => name.toLowerCase() === genre)
        if (!genreEntry) {
          throw new Error(`Invalid genre: ${genre}`)
        }
        const genreId = Number(genreEntry[0])
        console.log("Mapped genre ID:", genreId);
        
        const data = await getMoviesByGenre(genreId)
        console.log("API response:", data);
        
        if (!data.results || data.results.length === 0) {
          setError('No movies found for this genre.')
        } else {
          setMovies(data.results)
        }
      } catch (error) {
        console.error('Failed to fetch movies by genre:', error)
        setError(`Failed to load movies: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMoviesByGenre()
  }, [genre])

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
        <h1 className="text-3xl font-bold mb-8 capitalize">{genre} Movies</h1>
        {movies.length === 0 ? (
          <p>No movies found for this genre.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <MediaCard key={movie.id} item={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}