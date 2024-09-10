"use client"
import { useState, useEffect } from 'react'
import { Plus, Check } from 'lucide-react'

interface AddToWatchlistProps {
  movieId: string
}

export default function AddToWatchlist({ movieId }: AddToWatchlistProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    setIsInWatchlist(watchlist.includes(movieId))
  }, [movieId])

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]')
    if (isInWatchlist) {
      const newWatchlist = watchlist.filter((id: string) => id !== movieId)
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
    } else {
      watchlist.push(movieId)
      localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }
    setIsInWatchlist(!isInWatchlist)
  }

  return (
    <button
      onClick={toggleWatchlist}
      className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition-colors duration-300"
    >
      {isInWatchlist ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          In Watchlist
        </>
      ) : (
        <>
          <Plus className="w-5 h-5 mr-2" />
          Add to Watchlist
        </>
      )}
    </button>
  )
}