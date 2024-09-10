"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import VideoPlayer from '@/components/VideoPlayer'
import { getHindiStreamingLinks, StreamingLink } from '@/lib/api'

export default function StreamingPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const [streamingLinks, setStreamingLinks] = useState<StreamingLink[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStreamingLinks() {
      setIsLoading(true)
      try {
        const links = await getHindiStreamingLinks(id || '')
        setStreamingLinks(links)
      } catch (error) {
        console.error('Failed to fetch streaming links:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchStreamingLinks()
    }
  }, [id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (streamingLinks.length === 0) {
    return <div>No streaming links available</div>
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Now Streaming</h1>
        <VideoPlayer src={streamingLinks[0].url} />
      </div>
    </div>
  )
}
