"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import FadeIn from '@/components/FadeIn'
import { fetchFromAPI } from '@/utils/api'
import MovieSkeleton from '@/components/MovieSkeleton'

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  overview: string;
}

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<TVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTVShows() {
      try {
        const data = await fetchFromAPI('', { 
          requestID: 'trendingTvDay', 
          language: 'en-US', 
          page: '1' 
        })
        setTVShows(data.results)
      } catch (err) {
        setError('Failed to load TV shows')
      } finally {
        setLoading(false)
      }
    }

    loadTVShows()
  }, [])

  return (
    <Layout>
      <FadeIn>
        <main className="flex-1 bg-[#121212] text-white p-8">
          <h1 className="text-3xl font-bold mb-6">Trending TV Shows</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? Array(10).fill(0).map((_, index) => (
                  <MovieSkeleton key={index} />
                ))
              : tvShows.map((show) => (
                  <Link href={`/tv/${show.id}`} key={show.id} className="flex flex-col items-center">
                    <div className="relative w-40 h-60">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                        alt={show.name}
                        fill
                        sizes="160px"
                        quality={75}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-center mt-2">{show.name}</h3>
                    <p className="text-xs text-gray-400">{new Date(show.first_air_date).getFullYear()}</p>
                  </Link>
                ))
            }
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </main>
      </FadeIn>
    </Layout>
  )
}