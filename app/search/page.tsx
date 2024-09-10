"use client"
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchMovies, MovieSearchResult, getImageUrl } from '@/lib/api'
import Image from 'next/image'

function SearchResults({ query }: { query: string }) {
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSearchResults() {
      setIsLoading(true)
      setError(null)
      try {
        const results = await searchMovies(query)
        setSearchResults(results)
      } catch (error) {
        console.error('Failed to fetch search results:', error)
        setError('Failed to fetch search results. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (query) {
      fetchSearchResults()
    } else {
      setSearchResults([])
      setIsLoading(false)
    }
  }, [query])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (searchResults.length === 0) return <p>No results found for &quot;{query}&quot;</p>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {searchResults.map((item) => (
        <Link 
          key={item.id} 
          href={item.type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
          className="group"
        >
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(item.image)}
              alt={item.title}
              layout="fill"
              objectFit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm">{item.year}</p>
              <p className="text-sm">{item.type === 'movie' ? 'Movie' : 'TV Series'}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  return (
    <div className="min-h-screen pt-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Search Results for &quot;{query}&quot;</h1>
        <SearchResults query={query} />
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchPageContent />
    </Suspense>
  )
}