"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search as SearchIcon, X } from 'lucide-react'
import Layout from '@/components/Layout'
import { searchMedia } from '@/utils/api'
import MovieSkeleton from '@/components/MovieSkeleton'

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await searchMedia(searchTerm)
      setSearchResults(data.results.filter((result: SearchResult) => 
        result.media_type === 'movie' || result.media_type === 'tv'
      ))
    } catch (err) {
      setError('Failed to search movies and TV shows')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <main className="flex-1 bg-[#121212] text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Search Movies and TV Shows</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies and TV shows..."
              className="w-full bg-[#232323] text-white px-4 py-2 pl-10 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading
            ? Array(10).fill(0).map((_, index) => (
                <MovieSkeleton key={index} />
              ))
            : searchResults.map((item) => (
                <Link href={`/${item.media_type}/${item.id}`} key={item.id} className="flex flex-col items-center">
                  <div className="relative w-40 h-60">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name || ''}
                      fill
                      sizes="160px"
                      quality={75}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-center mt-2">{item.title || item.name}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(item.release_date || item.first_air_date || '').getFullYear() || 'N/A'}
                    {' • '}
                    {item.media_type === 'movie' ? 'Movie' : 'TV Show'}
                  </p>
                </Link>
              ))
          }
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </Layout>
  )
}