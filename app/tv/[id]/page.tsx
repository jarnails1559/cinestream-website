"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Calendar, Play, Plus, Check, Film, Tv, Users } from 'lucide-react'
import { getTVShowDetails, getSuggestedTVShows, TVShow, getImageUrl, addToWatchlist, removeFromWatchlist, isInWatchlist, addToRecentlyViewed } from '@/lib/api'

export default function TVShowDetailPage({ params }: { params: { id: string } }) {
  const [tvShow, setTVShow] = useState<TVShow | null>(null)
  const [suggestedShows, setSuggestedShows] = useState<TVShow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [inWatchlist, setInWatchlist] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        console.log(`Fetching details for TV show ID: ${params.id}`);
        const details = await getTVShowDetails(params.id)
        console.log("Fetched TV show details:", details);
        setTVShow(details)
        setInWatchlist(isInWatchlist(details.id))
        addToRecentlyViewed(details)

        const suggested = await getSuggestedTVShows(details)
        console.log("Fetched suggested TV shows:", suggested);
        setSuggestedShows(suggested)
      } catch (error) {
        console.error('Failed to fetch TV show data:', error)
        setError('Failed to load TV show data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleWatchlistToggle = () => {
    if (!tvShow) return;
    if (inWatchlist) {
      removeFromWatchlist(tvShow.id);
    } else {
      addToWatchlist(tvShow);
    }
    setInWatchlist(!inWatchlist);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-2xl text-red-500">
        {error}
      </div>
    )
  }

  if (!tvShow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-2xl text-white">
        TV show not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <img
          src={getImageUrl(tvShow.backdrop_path, 'original')}
          alt={tvShow.name}
          className="w-full h-[80vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto flex flex-col md:flex-row items-end">
            <img
              src={getImageUrl(tvShow.poster_path, 'w342')}
              alt={tvShow.name}
              className="w-64 rounded-lg shadow-2xl mb-6 md:mb-0 md:mr-8 border-4 border-white"
            />
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">{tvShow.name}</h1>
              <div className="flex flex-wrap items-center space-x-4 text-sm md:text-base mb-4">
                <span className="flex items-center bg-yellow-500 text-black px-2 py-1 rounded font-bold">
                  <Star className="w-4 h-4 mr-1" />
                  {tvShow.vote_average.toFixed(1)}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-5 h-5 mr-1" />
                  {new Date(tvShow.first_air_date).getFullYear()}
                </span>
                <span className="flex items-center">
                  <Film className="w-5 h-5 mr-1" />
                  {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-1" />
                  {tvShow.vote_count.toLocaleString()} votes
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {tvShow.genres && tvShow.genres.map((genre) => (
                  <span key={genre.id} className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {genre.name}
                  </span>
                ))}
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-3xl">{tvShow.overview}</p>
              <div className="flex space-x-4">
                <Link href={`/streaming/tv/${params.id}`} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-full inline-flex items-center justify-center transition-colors duration-300 shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Now
                </Link>
                <button 
                  onClick={handleWatchlistToggle}
                  className={`${inWatchlist ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'} text-white font-bold py-3 px-8 rounded-full inline-flex items-center justify-center transition-colors duration-300 shadow-lg`}
                >
                  {inWatchlist ? <Check className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                  {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {tvShow.created_by && tvShow.created_by.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Created By</h3>
            <div className="flex flex-wrap gap-8">
              {tvShow.created_by.map((creator) => (
                <div key={creator.id} className="flex flex-col items-center group">
                  {creator.profile_path ? (
                    <img
                      src={getImageUrl(creator.profile_path, 'w185')}
                      alt={creator.name}
                      className="w-24 h-24 rounded-full mb-2 object-cover border-2 border-primary group-hover:border-white transition-colors duration-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-2 border-2 border-primary group-hover:border-white transition-colors duration-300">
                      <span className="text-3xl">{creator.name[0]}</span>
                    </div>
                  )}
                  <span className="text-center font-semibold group-hover:text-primary transition-colors duration-300">{creator.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-400">Status</h4>
                <p>{tvShow.status}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-400">Type</h4>
                <p>{tvShow.type || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-400">Original Language</h4>
                <p>{tvShow.original_language}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-400">Popularity</h4>
                <p>{tvShow.popularity.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Numbers</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-400">Seasons</h4>
                <p>{tvShow.number_of_seasons}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-400">Episodes</h4>
                <p>{tvShow.number_of_episodes}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-400">First Air Date</h4>
                <p>{new Date(tvShow.first_air_date).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-400">Last Air Date</h4>
                <p>{tvShow.last_air_date ? new Date(tvShow.last_air_date).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {tvShow.networks && tvShow.networks.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Networks</h3>
            <div className="flex flex-wrap gap-6">
              {tvShow.networks.map((network) => (
                <div key={network.id} className="bg-gray-800 rounded-lg p-4 flex items-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {network.logo_path ? (
                    <img
                      src={getImageUrl(network.logo_path, 'w92')}
                      alt={network.name}
                      className="h-8 mr-3"
                    />
                  ) : (
                    <Tv className="w-8 h-8 mr-3 text-primary" />
                  )}
                  <span className="text-lg font-semibold">{network.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tvShow.seasons && tvShow.seasons.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Seasons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {tvShow.seasons.map((season) => (
                <div key={season.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <img
                    src={getImageUrl(season.poster_path, 'w342')}
                    alt={season.name}
                    className="w-full h-auto"
                  />
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 text-primary">{season.name}</h4>
                    <p className="text-sm text-gray-400">{season.episode_count} episodes</p>
                    <p className="text-sm text-gray-400">
                      {season.air_date ? new Date(season.air_date).getFullYear() : 'TBA'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggested TV Shows Section */}
      {suggestedShows.length > 0 && (
        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 border-b border-gray-700 pb-2">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {suggestedShows.map((show) => (
                <Link key={show.id} href={`/tv/${show.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={getImageUrl(show.poster_path)}
                      alt={show.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="font-bold text-lg">{show.name}</h3>
                      <p className="text-sm flex items-center mt-2">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {show.vote_average.toFixed(1)}
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