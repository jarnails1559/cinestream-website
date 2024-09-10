"use client"
import { useState, useEffect } from 'react'
import MediaCard from '@/components/MediaCard'
import { getWatchlist, TrendingMovie, MovieDetails, TVShow } from '@/lib/api'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<(TrendingMovie | MovieDetails | TVShow)[]>([])

  useEffect(() => {
    const fetchWatchlist = async () => {
      const list = await getWatchlist()
      setWatchlist(list)
    }
    fetchWatchlist()
  }, [])

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
        {watchlist.length === 0 ? (
          <p>Your watchlist is empty. Add some movies or TV shows to watch later!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {watchlist.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}