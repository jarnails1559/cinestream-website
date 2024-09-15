"use client"

import dynamic from 'next/dynamic'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Plus } from 'lucide-react'
import { fetchFromAPI } from '@/utils/api'
import useSWR from 'swr'
import Head from 'next/head'

const TrailerModal = dynamic(() => import('@/components/TrailerModal'), {
  loading: () => <p>Loading...</p>,
})

interface Video {
  key: string;
  name: string;
  type: string;
}

interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
}

const fetcher = (url: string) => fetchFromAPI('', JSON.parse(url))

export default function HomePage() {
  const [showTrailer, setShowTrailer] = useState(false)

  const { data: moviesData, error: moviesError } = useSWR(
    JSON.stringify({ requestID: 'trendingMovie', language: 'en-US', page: '1' }),
    fetcher
  )

  const { data: tvShowsData, error: tvShowsError } = useSWR(
    JSON.stringify({ requestID: 'trendingTvDay', language: 'en-US', page: '1' }),
    fetcher
  )

  const featuredMovie = moviesData?.results[0] as Movie | undefined
  const trendingMovies = (moviesData?.results.slice(0, 10) || []) as Movie[]
  const trendingTVShows = (tvShowsData?.results.slice(0, 10) || []) as TVShow[]

  const { data: trailerData } = useSWR(
    featuredMovie ? JSON.stringify({ id: featuredMovie.id.toString(), requestID: 'movieVideos', language: 'en-US' }) : null,
    fetcher
  )

  const trailer = trailerData?.results.find((video: Video) => video.type === 'Trailer')

  const isLoading = !moviesData || !tvShowsData
  const error = moviesError || tvShowsError

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#121212]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>
  }

  return (
    <>
      <Head>
        <title>RiveStream - Home</title>
        <meta name="description" content="Watch the latest movies and TV shows on RiveStream" />
      </Head>
      <div className="bg-[#121212] min-h-screen text-white">
        {/* Hero Section */}
        {featuredMovie && (
          <section className="relative h-[50vh] md:h-[70vh] lg:h-[80vh]">
            <Image
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title || featuredMovie.name || ''}
              layout="fill"
              objectFit="cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full md:w-2/3 lg:w-1/2 space-y-2 md:space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{featuredMovie.title || featuredMovie.name}</h1>
              <p className="text-sm md:text-base lg:text-lg line-clamp-2 md:line-clamp-3">{featuredMovie.overview}</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setShowTrailer(true)} 
                  className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold flex items-center justify-center hover:bg-yellow-300 transition-colors"
                >
                  <Play className="mr-2" size={20} />
                  Watch Trailer
                </button>
                <Link 
                  href={`/movie/${featuredMovie.id}`} 
                  className="bg-gray-800 px-4 py-2 rounded-full font-semibold flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Info className="mr-2" size={20} />
                  More Info
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Trailer Modal */}
        {showTrailer && trailer && (
          <TrailerModal trailerKey={trailer.key} onClose={() => setShowTrailer(false)} />
        )}

        {/* Trending Movies Section */}
        <section className="py-4 md:py-8 px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Trending Movies</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {trendingMovies.map((movie: Movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className="flex-shrink-0 w-32 sm:w-36 md:w-40 group">
                <div className="relative h-48 sm:h-54 md:h-60 rounded-lg overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || ''}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Plus className="text-white" size={40} />
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium truncate">{movie.title}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending TV Shows Section */}
        <section className="py-4 md:py-8 px-4 md:px-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Trending TV Shows</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {trendingTVShows.map((show: TVShow) => (
              <Link href={`/tv/${show.id}`} key={show.id} className="flex-shrink-0 w-32 sm:w-36 md:w-40 group">
                <div className="relative h-48 sm:h-54 md:h-60 rounded-lg overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name || ''}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Plus className="text-white" size={40} />
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium truncate">{show.name}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}