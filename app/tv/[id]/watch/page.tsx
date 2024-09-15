"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { fetchFromAPI } from '@/utils/api'
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Update these type definitions
type ArtPlayerInstance = import('artplayer').default;
type HlsQualityPlugin = ReturnType<typeof artplayerPluginHlsQuality>;

interface StreamSource {
  quality: string;
  url: string;
  source: string;
  format: string;
}

interface TVShowDetails {
  name: string;
  first_air_date: string;
  overview: string;
  seasons: { season_number: number; episode_count: number }[];
}

function playM3u8(video: HTMLVideoElement, url: string, art: ArtPlayerInstance) {
  if (Hls.isSupported()) {
    if (art.hls) art.hls.destroy();
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    art.hls = hls;
    art.on('destroy', () => hls.destroy());
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
  } else {
    art.notice.show = 'Unsupported playback format: m3u8';
  }
}

export default function TVShowStreamPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params?.id as string
  const season = searchParams?.get('season') || '1'
  const episode = searchParams?.get('episode') || '1'
  const [sources, setSources] = useState<StreamSource[]>([])
  const [tvShowDetails, setTVShowDetails] = useState<TVShowDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<ArtPlayerInstance | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [streamData, tvShowData] = await Promise.all([
          fetchFromAPI('', {
            requestID: 'tvVideoProvider',
            id,
            season,
            episode,
            service: 'asiacloud'
          }),
          fetchFromAPI('', {
            requestID: 'tvData',
            id,
            language: 'en-US'
          })
        ])
        setSources(streamData.data.sources)
        setTVShowDetails(tvShowData)
      } catch (err) {
        setError('Failed to load TV show data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, season, episode])

  useEffect(() => {
    if (playerRef.current && sources.length > 0) {
      const art = new Artplayer({
        container: playerRef.current,
        url: sources[0].url,
        title: `${tvShowDetails?.name} - S${season}E${episode}`,
        isLive: false,
        muted: false,
        autoplay: false,
        pip: true,
        autoSize: false,
        autoMini: false,
        screenshot: true,
        setting: true,
        loop: false,
        flip: true,
        playbackRate: true,
        aspectRatio: true,
        fullscreen: true,
        fullscreenWeb: false,
        subtitleOffset: true,
        miniProgressBar: true,
        mutex: true,
        backdrop: true,
        playsInline: true,
        autoPlayback: true,
        airplay: true,
        theme: '#23ade5',
        lang: navigator.language.toLowerCase(),
        whitelist: ['*'],
        moreVideoAttr: {
          crossOrigin: 'anonymous',
        },
        customType: {
          m3u8: playM3u8,
        },
        plugins: [
          artplayerPluginHlsQuality({
            control: true,
            setting: true,
            getResolution: (level: { height: number }) => level.height + 'P',
            title: 'Quality',
            auto: 'Auto',
          }) as HlsQualityPlugin,
        ],
        settings: [
          {
            html: 'Language',
            selector: sources.map((source) => ({
              html: source.quality,
              value: source.url,
            })),
            onSelect: function (item: { html: string; value: string }) {
              art.switchUrl(item.value);
              return item.html;
            },
          },
        ],
      });

      artRef.current = art;

      const resizePlayer = () => {
        if (art.resize) {
          art.resize();
        }
      };

      window.addEventListener('resize', resizePlayer);
      resizePlayer();

      return () => {
        window.removeEventListener('resize', resizePlayer);
        if (art && art.destroy) {
          art.destroy(false)
        }
      }
    }
  }, [sources, tvShowDetails, season, episode])

  if (loading) return <Layout><div className="flex justify-center items-center h-screen">Loading...</div></Layout>
  if (error) return <Layout><div className="flex justify-center items-center h-screen text-red-500">{error}</div></Layout>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:ml-16">
        <Link href={`/tv/${id}`} className="inline-flex items-center text-white mb-4 hover:text-yellow-400">
          <ArrowLeft className="mr-2" size={20} />
          Back to TV show details
        </Link>
        <div className="relative w-full max-w-4xl mx-auto" style={{ paddingTop: '56.25%' }}>
          <div ref={playerRef} className="absolute top-0 left-0 w-full h-full"></div>
        </div>
        {tvShowDetails && (
          <div className="mt-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{tvShowDetails.name}</h1>
            <p className="text-gray-400 mb-4">Season {season} Episode {episode}</p>
            <div className="mb-4">
              <label htmlFor="episode-select" className="block text-sm font-medium text-gray-400 mb-2">Select Episode:</label>
              <select
                id="episode-select"
                className="bg-gray-700 text-white rounded px-3 py-2"
                value={`${season}-${episode}`}
                onChange={(e) => {
                  const [newSeason, newEpisode] = e.target.value.split('-')
                  window.location.href = `/tv/${id}/watch?season=${newSeason}&episode=${newEpisode}`
                }}
              >
                {tvShowDetails.seasons.map((s) => (
                  [...Array(s.episode_count)].map((_, i) => (
                    <option key={`${s.season_number}-${i + 1}`} value={`${s.season_number}-${i + 1}`}>
                      Season {s.season_number} Episode {i + 1}
                    </option>
                  ))
                ))}
              </select>
            </div>
            <p>{tvShowDetails.overview}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}