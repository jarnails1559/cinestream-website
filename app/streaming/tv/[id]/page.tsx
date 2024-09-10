"use client"
import { useState, useEffect } from 'react'
import { getTVShowDetails, getTVStreamingLinks, TVShow, TVStreamingLink } from '@/lib/api'
import VideoPlayer from '@/components/VideoPlayer'

export default function TVShowStreamingPage({ params }: { params: { id: string } }) {
  const [tvShow, setTVShow] = useState<TVShow | null>(null)
  const [streamingLinks, setStreamingLinks] = useState<TVStreamingLink[]>([])
  const [selectedLink, setSelectedLink] = useState<string | null>(null)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [selectedEpisode, setSelectedEpisode] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        const showDetails = await getTVShowDetails(params.id)
        setTVShow(showDetails)
        await fetchStreamingLinks(1, 1)
      } catch (error) {
        console.error('Failed to fetch TV show data:', error)
        setError('Failed to load TV show data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const fetchStreamingLinks = async (season: number, episode: number) => {
    try {
      const links = await getTVStreamingLinks(params.id, season, episode)
      setStreamingLinks(links)
      if (links.length > 0) {
        setSelectedLink(links[0].url)
      }
    } catch (error) {
      console.error('Failed to fetch streaming links:', error)
      setError('Failed to load streaming links. Please try again later.')
    }
  }

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season)
    setSelectedEpisode(1)
    fetchStreamingLinks(season, 1)
  }

  const handleEpisodeChange = (episode: number) => {
    setSelectedEpisode(episode)
    fetchStreamingLinks(selectedSeason, episode)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-2xl text-red-500">{error}</div>
  }

  if (!tvShow) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-2xl text-white">TV show not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">{tvShow.name}</h1>
      <div className="flex gap-4 mb-6">
        <select
          value={selectedSeason}
          onChange={(e) => handleSeasonChange(Number(e.target.value))}
          className="bg-gray-800 text-white rounded-md px-3 py-2"
        >
          {tvShow.seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>
        <select
          value={selectedEpisode}
          onChange={(e) => handleEpisodeChange(Number(e.target.value))}
          className="bg-gray-800 text-white rounded-md px-3 py-2"
        >
          {[...Array(tvShow.seasons[selectedSeason - 1]?.episode_count || 0)].map((_, index) => (
            <option key={index} value={index + 1}>
              Episode {index + 1}
            </option>
          ))}
        </select>
      </div>
      {selectedLink && (
        <div className="mb-8">
          <VideoPlayer src={selectedLink} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streamingLinks.map((link, index) => (
          <button
            key={index}
            onClick={() => setSelectedLink(link.url)}
            className={`p-4 rounded-lg ${selectedLink === link.url ? 'bg-primary text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
          >
            {link.quality} - {link.source}
          </button>
        ))}
      </div>
    </div>
  )
}