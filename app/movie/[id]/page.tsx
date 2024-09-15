"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { fetchFromAPI } from '@/utils/api'
import { Play, Star, Calendar, Clock, User, ChevronDown, ChevronUp, Plus, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genres: { name: string }[];
  vote_average: number;
  runtime: number;
  production_companies: { name: string; logo_path: string }[];
  credits?: {
    cast: { name: string; character: string; profile_path: string }[];
    crew: { name: string; job: string }[];
  };
}

interface Video {
  key: string;
  name: string;
  type: string;
}

interface Image {
  file_path: string;
}

interface MyListItem {
  id: number;
  type: string;
  title: string;
  poster_path: string;
  release_date: string;
}

function MovieDetailsSkeleton() {
  return (
    <div className="animate-pulse bg-[#121212] text-white">
      <div className="bg-gray-700 h-[60vh] w-full"></div>
      <div className="p-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gray-700 w-[300px] h-[450px] rounded-lg"></div>
          <div className="md:ml-8 mt-4 md:mt-0 space-y-4 flex-1">
            <div className="bg-gray-700 h-8 w-3/4 rounded"></div>
            <div className="bg-gray-700 h-4 w-1/2 rounded"></div>
            <div className="bg-gray-700 h-4 w-1/3 rounded"></div>
            <div className="bg-gray-700 h-32 w-full rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MovieDetailsPage() {
  const params = useParams()
  const id = params?.id as string
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullOverview, setShowFullOverview] = useState(false)
  const [isInList, setIsInList] = useState(false)

  useEffect(() => {
    async function loadMovieDetails() {
      if (!id) return
      try {
        const [movieData, videosData, imagesData] = await Promise.all([
          fetchFromAPI('', { id, requestID: 'movieData', language: 'en-US' }),
          fetchFromAPI('', { id, requestID: 'movieVideos', language: 'en-US' }),
          fetchFromAPI('', { id, requestID: 'movieImages' })
        ])
        setMovie(movieData)
        setVideos(videosData.results)
        setImages(imagesData.backdrops)
      } catch (err) {
        setError('Failed to load movie details')
      } finally {
        setLoading(false)
      }
    }

    loadMovieDetails()
  }, [id])

  useEffect(() => {
    if (movie) {
      const myList = JSON.parse(localStorage.getItem('myList') || '[]') as MyListItem[]
      setIsInList(myList.some((item) => item.id === movie.id && item.type === 'movie'))
    }
  }, [movie])

  const handleAddToList = () => {
    if (movie) {
      const myList = JSON.parse(localStorage.getItem('myList') || '[]') as MyListItem[]
      if (isInList) {
        const newList = myList.filter((item) => !(item.id === movie.id && item.type === 'movie'))
        localStorage.setItem('myList', JSON.stringify(newList))
        setIsInList(false)
      } else {
        myList.push({
          id: movie.id,
          type: 'movie',
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date
        })
        localStorage.setItem('myList', JSON.stringify(myList))
        setIsInList(true)
      }
    }
  }

  if (loading) return <Layout><MovieDetailsSkeleton /></Layout>
  if (error) return <Layout><div className="text-red-500 p-8">{error}</div></Layout>
  if (!movie) return <Layout><div className="text-white p-8">Movie not found</div></Layout>

  const trailer = videos.find(video => video.type === 'Trailer')
  const director = movie.credits?.crew?.find(person => person.job === 'Director')

  return (
    <Layout>
      <main className="bg-[#121212] text-white min-h-screen">
        <div className="relative h-[60vh]">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            priority
            quality={75}
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[rgba(18,18,18,0.7)] to-transparent" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-[300px] h-[450px] rounded-lg overflow-hidden shadow-lg mx-auto md:mx-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                sizes="300px"
                quality={75}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="md:ml-8 mt-4 md:mt-0 flex-1">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <div className="flex items-center mt-2 text-yellow-400">
                <Star className="mr-1" size={20} />
                <span className="text-2xl font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2" size={20} />
                  <span>{movie.runtime} min</span>
                </div>
                {director && (
                  <div className="flex items-center">
                    <User className="mr-2" size={20} />
                    <span>{director.name}</span>
                  </div>
                )}
              </div>
              <p className="mt-4 text-gray-300">{movie.genres.map(g => g.name).join(', ')}</p>
              <div className="mt-4">
                <p className={`${showFullOverview ? '' : 'line-clamp-3'}`}>{movie.overview}</p>
                {movie.overview.length > 200 && (
                  <button 
                    onClick={() => setShowFullOverview(!showFullOverview)}
                    className="text-yellow-400 mt-2 flex items-center"
                  >
                    {showFullOverview ? 'Show Less' : 'Show More'}
                    {showFullOverview ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                  </button>
                )}
              </div>
              <div className="flex space-x-4 mt-6">
                <Link
                  href={`/movie/${id}/watch`}
                  className="inline-flex items-center bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <Play className="mr-2" size={20} />
                  Watch Now
                </Link>
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gray-600 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Play className="mr-2" size={20} />
                    Watch Trailer
                  </a>
                )}
                <button
                  onClick={handleAddToList}
                  className={`inline-flex items-center ${isInList ? 'bg-green-600' : 'bg-blue-600'} text-white px-6 py-2 rounded-full hover:bg-opacity-80 transition-colors`}
                >
                  {isInList ? <Check className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />}
                  {isInList ? 'In My List' : 'Add to My List'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Cast Section */}
          {movie.credits?.cast && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Cast</h2>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {movie.credits.cast.slice(0, 10).map((actor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-32"
                  >
                    <div className="w-32 h-48 relative rounded-lg overflow-hidden">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        sizes="128px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium">{actor.name}</p>
                    <p className="text-xs text-gray-400">{actor.character}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Production Companies Section */}
          {movie.production_companies.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Production Companies</h2>
              <div className="flex flex-wrap gap-4">
                {movie.production_companies.map((company, index) => (
                  company.logo_path && (
                    <div key={index} className="bg-white rounded-lg p-2 h-16 w-32 flex items-center justify-center">
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        width={100}
                        height={50}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  )
                ))}
              </div>
            </section>
          )}

          {/* Images Section */}
          {images.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.slice(0, 8).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                      alt={`${movie.title} image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </Layout>
  )
}