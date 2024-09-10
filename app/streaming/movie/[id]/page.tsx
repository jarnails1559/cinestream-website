"use client"
import { useState, useEffect } from 'react'
import { getMovieDetails, getHindiStreamingLinks, MovieDetails, StreamingLink } from '@/lib/api'
import VideoPlayer from '@/components/VideoPlayer'

export default function MovieStreamingPage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [streamingLinks, setStreamingLinks] = useState<StreamingLink[]>([])
  const [selectedLink, setSelectedLink] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        const movieDetails = await getMovieDetails(params.id)
        setMovie(movieDetails)
        const links = await getHindiStreamingLinks(params.id)
        setStreamingLinks(links)
        if (links.length > 0) {
          setSelectedLink(links[0].url)
        }
      } catch (error) {
        console.error('Failed to fetch movie data:', error)
        setError('Failed to load movie data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-2xl text-red-500">{error}</div>
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-2xl text-white">Movie not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">{movie.title}</h1>
      {selectedLink && (
        <div className="mb-8">
          <VideoPlayer src={selectedLink} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streamingLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => setSelectedLink(link.url)}
            className={`p-4 rounded-lg ${selectedLink === link.url ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            {link.quality} - {link.source}
          </button>
        ))}
      </div>
    </div>
  )
}