"use client"

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { fetchFromAPI } from '@/utils/api'
import Artplayer from 'artplayer'
import Hls from 'hls.js'
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface StreamSource {
  quality: string;
  url: string;
  source: string;
  format: string;
}

interface MovieDetails {
  title: string;
  release_date: string;
  overview: string;
}

function playM3u8(video: HTMLVideoElement, url: string, art: Artplayer) {
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

export default function MovieStreamPage() {
  const params = useParams()
  const id = params?.id as string
  const [sources, setSources] = useState<StreamSource[]>([])
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<Artplayer | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [streamData, movieData] = await Promise.all([
          fetchFromAPI('', {
            requestID: 'movieVideoProvider',
            id,
            service: 'asiacloud'
          }),
          fetchFromAPI('', {
            requestID: 'movieData',
            id,
            language: 'en-US'
          })
        ])
        setSources(streamData.data.sources)
        setMovieDetails(movieData)
      } catch (err) {
        setError('Failed to load movie data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  useEffect(() => {
    if (playerRef.current && sources.length > 0) {
      const art = new Artplayer({
        container: playerRef.current,
        url: sources[0].url,
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
            auto: 'Auto',
          }),
        ],
        settings: [
          {
            html: 'Language',
            selector: sources.map((source) => ({
              html: source.quality,
              value: source.url,
            })),
            onSelect: function (item: { html: string; value: string }) {
              if (art && typeof item.value === 'string') {
                art.switchUrl(item.value);
              }
              return item.html;
            },
          },
        ],
      });

      artRef.current = art;

      const resizePlayer = () => {
        if (art && typeof art.resize === 'function') {
          art.resize();
        }
      };

      window.addEventListener('resize', resizePlayer);
      resizePlayer();

      return () => {
        window.removeEventListener('resize', resizePlayer);
        if (art && typeof art.destroy === 'function') {
          art.destroy(false);
        }
      }
    }
  }, [sources, movieDetails])

  if (loading) return <Layout><div className="flex justify-center items-center h-screen">Loading...</div></Layout>
  if (error) return <Layout><div className="flex justify-center items-center h-screen text-red-500">{error}</div></Layout>

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:ml-16">
        <Link href={`/movie/${id}`} className="inline-flex items-center text-white mb-4 hover:text-yellow-400">
          <ArrowLeft className="mr-2" size={20} />
          Back to movie details
        </Link>
        <div className="relative w-full max-w-4xl mx-auto" style={{ paddingTop: '56.25%' }}>
          <div ref={playerRef} className="absolute top-0 left-0 w-full h-full"></div>
        </div>
        {movieDetails && (
          <div className="mt-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">{movieDetails.title}</h1>
            <p className="text-gray-400 mb-4">{new Date(movieDetails.release_date).getFullYear()}</p>
            <p>{movieDetails.overview}</p>
          </div>
        )}
      </div>
    </Layout>
  )
}