"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Clock, Calendar, Play, Plus, Check } from 'lucide-react'
import { getMovieDetails, getSuggestedMovies, MovieDetails, TrendingMovie, getImageUrl, addToWatchlist, removeFromWatchlist, isInWatchlist, addToRecentlyViewed } from '@/lib/api'

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [suggestedMovies, setSuggestedMovies] = useState<TrendingMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        const details = await getMovieDetails(params.id)
        setMovie(details)
        setInWatchlist(isInWatchlist(details.id))
        addToRecentlyViewed(details)

        const suggested = await getSuggestedMovies(details)
        setSuggestedMovies(suggested)
      } catch (error) {
        console.error('Failed to fetch movie data:', error)
        setError('Failed to load movie data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleWatchlistToggle = () => {
    if (!movie) return;
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
    setInWatchlist(!inWatchlist);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">{error}</div>
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-2xl">Movie not found</div>
  }

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <Image
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            <div className="flex flex-wrap items-center space-x-4 text-sm md:text-base mb-4">
              <span className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="flex items-center">
                <Clock className="w-5 h-5 mr-1" />
                {movie.runtime} min
              </span>
              <span className="flex items-center">
                <Calendar className="w-5 h-5 mr-1" />
                {new Date(movie.release_date).getFullYear()}
              </span>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/4">
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              width={300}
              height={450}
              layout="responsive"
              className="rounded-lg shadow-lg"
            />
            <div className="mt-6 flex flex-col space-y-4">
              <Link href={`/streaming/movie/${params.id}`} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full inline-flex items-center justify-center transition-colors duration-300">
                <Play className="w-5 h-5 mr-2" />
                Watch Now
              </Link>
              <button 
                onClick={handleWatchlistToggle}
                className={`${inWatchlist ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'} text-white font-bold py-3 px-6 rounded-full inline-flex items-center justify-center transition-colors duration-300`}
              >
                {inWatchlist ? <Check className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
          <div className="md:w-3/4">
            <h2 className="text-3xl font-bold mb-4">Synopsis</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">{movie.overview}</p>
            
            <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-400">Original Title</h3>
                <p>{movie.original_title}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">Original Language</h3>
                <p>{movie.original_language}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">Release Date</h3>
                <p>{new Date(movie.release_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">Popularity</h3>
                <p>{movie.popularity.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Movies Section */}
      {suggestedMovies.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {suggestedMovies.map((movie) => (
                <Link key={movie.id} href={`/movie/${movie.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-bold">{movie.title}</h3>
                      <p className="text-sm flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}