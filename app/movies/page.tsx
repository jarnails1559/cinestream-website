"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import FadeIn from '@/components/FadeIn'
import { fetchFromAPI } from '@/utils/api'
import MovieSkeleton from '@/components/MovieSkeleton'

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  overview: string;
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await fetchFromAPI('', { 
          requestID: 'trendingMovie', 
          language: 'en-US', 
          page: '1' 
        })
        setMovies(data.results)
      } catch (err) {
        setError('Failed to load movies')
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  return (
    <Layout>
      <FadeIn>
        <main className="flex-1 bg-[#121212] text-white p-8">
          <h1 className="text-3xl font-bold mb-6">Trending Movies</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? Array(10).fill(0).map((_, index) => (
                  <MovieSkeleton key={index} />
                ))
              : movies.map((movie) => (
                  <Link href={`/movie/${movie.id}`} key={movie.id} className="flex flex-col items-center">
                    <div className="relative w-40 h-60">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        sizes="160px"
                        quality={75}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-center mt-2">{movie.title}</h3>
                    <p className="text-xs text-gray-400">{new Date(movie.release_date).getFullYear()}</p>
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