"use client"
import Link from 'next/link'
import { Search, Bell, User, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NotificationsBar from './NotificationsBar'
import { getTrendingMovies, TrendingMovie } from '@/lib/api'

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
  timestamp: Date;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([])
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)

    // Fetch trending movies and generate notifications
    const fetchTrendingMovies = async () => {
      try {
        const data = await getTrendingMovies()
        setTrendingMovies(data.results)
        generateRandomNotifications(data.results)
      } catch (error) {
        console.error('Failed to fetch trending movies:', error)
      }
    }

    fetchTrendingMovies()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const generateRandomNotifications = (movies: TrendingMovie[]) => {
    const notificationTypes = [
      (movie: TrendingMovie) => ({ message: `New movie "${movie.title}" is now available!`, type: 'info' as const }),
      (movie: TrendingMovie) => ({ message: `"${movie.title}" is trending now!`, type: 'info' as const }),
    ]

    const randomNotifications = movies
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((movie, index) => {
        const { message, type } = notificationTypes[index % notificationTypes.length](movie)
        return {
          id: Date.now().toString() + index,
          message,
          type,
          timestamp: new Date(Date.now() - Math.random() * 86400000) // Random time within last 24 hours
        }
      })

    setNotifications(randomNotifications)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // New function to add a watchlist notification
  const addWatchlistNotification = (movieTitle: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message: `Added "${movieTitle}" to watchlist successfully`,
      type: 'success',
      timestamp: new Date()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // New function to show "Coming Soon" message for User Profile
  const handleUserProfileClick = () => {
    alert("User Profile feature is coming soon!")
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-gradient-to-b from-black to-transparent'}`}>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
          CineStream
        </Link>
        <ul className="hidden md:flex space-x-6">
          <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
          <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
          <li><Link href="/tv-shows" className="hover:text-primary transition-colors">TV Shows</Link></li>
          <li><Link href="/watchlist" className="hover:text-primary transition-colors">Watchlist</Link></li>
        </ul>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 text-white rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-400 hover:text-primary transition-colors" />
            </button>
          </form>
          <button 
            aria-label="Notifications" 
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors relative"
            onClick={toggleNotifications}
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <button 
            aria-label="User Profile" 
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            onClick={handleUserProfileClick}
          >
            <User className="w-5 h-5" />
          </button>
          <button 
            aria-label="Mobile Menu" 
            className="md:hidden p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md">
          <ul className="py-4 px-4 space-y-4">
            <li><Link href="/" className="block hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/movies" className="block hover:text-primary transition-colors">Movies</Link></li>
            <li><Link href="/tv-shows" className="block hover:text-primary transition-colors">TV Shows</Link></li>
            <li><Link href="/watchlist" className="block hover:text-primary transition-colors">Watchlist</Link></li>
            <li>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 text-white rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400 hover:text-primary transition-colors" />
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
      {isNotificationsOpen && (
        <NotificationsBar
          notifications={notifications}
          onClose={toggleNotifications}
          onClearAll={clearAllNotifications}
        />
      )}
    </header>
  )
}