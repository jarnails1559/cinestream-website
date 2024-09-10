"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Info, Star } from 'lucide-react'
import { getTrendingMovies, getMovieDetails, getTopRatedMovies, TrendingMovie, MovieDetails, getImageUrl } from '@/lib/api'
import Carousel from '@/components/Carousel'

export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<MovieDetails | null>(null)
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<TrendingMovie[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendingData, topRatedData] = await Promise.all([
          getTrendingMovies(),
          getTopRatedMovies()
        ])
        setTrendingMovies(trendingData.results)
        setTopRatedMovies(topRatedData.results)

        const randomMovie = trendingData.results[Math.floor(Math.random() * trendingData.results.length)]
        const movieDetails = await getMovieDetails(randomMovie.id.toString())
        setFeaturedMovie(movieDetails)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [])

  if (!featuredMovie) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-screen">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(featuredMovie.backdrop_path, 'original')}
            alt={featuredMovie.title}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end pb-10 sm:pb-16 md:pb-20 lg:pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 animate-fade-in-up">
                {featuredMovie.title}
              </h1>
              <div className="flex flex-wrap items-center space-x-4 mb-3 sm:mb-4 md:mb-6 animate-fade-in-up animation-delay-200">
                <span className="flex items-center bg-primary text-white px-2 py-1 rounded text-xs sm:text-sm">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {featuredMovie.vote_average.toFixed(1)}
                </span>
                <span className="text-xs sm:text-sm">{new Date(featuredMovie.release_date).getFullYear()}</span>
                <span className="text-xs sm:text-sm">{featuredMovie.runtime} min</span>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 animate-fade-in-up animation-delay-400">
                <Link href={`/streaming/movie/${featuredMovie.id}`} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full inline-flex items-center justify-center transition-colors duration-300">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Watch Now
                </Link>
                <Link href={`/movie/${featuredMovie.id}`} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full inline-flex items-center justify-center transition-colors duration-300">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Movies Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Trending Now</h2>
          <Carousel items={trendingMovies} />
        </div>
      </section>

      {/* Top Rated Movies Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Top Rated Movies</h2>
          <Carousel items={topRatedMovies} />
        </div>
      </section>
    </div>
  )
}