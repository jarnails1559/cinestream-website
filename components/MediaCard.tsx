"use client"
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingMovie, MovieDetails, MovieSearchResult, TVShow, getImageUrl } from '@/lib/api'
import { Star } from 'lucide-react'

interface MediaCardProps {
  item: TrendingMovie | MovieDetails | MovieSearchResult | TVShow;
}

export default function MediaCard({ item }: MediaCardProps) {
  const [imageError, setImageError] = useState(false)

  const isTVShow = 'name' in item;
  const isMovieSearchResult = 'type' in item;
  
  const title = isTVShow ? item.name : item.title;
  const year = isMovieSearchResult 
    ? (item as MovieSearchResult).year 
    : new Date(isTVShow ? item.first_air_date : (item as TrendingMovie | MovieDetails).release_date).getFullYear();
  
  const posterPath = isMovieSearchResult 
    ? (item as MovieSearchResult).image 
    : item.poster_path;
  const imageUrl = getImageUrl(posterPath);

  const rating = isMovieSearchResult 
    ? 'N/A' 
    : (item.vote_average?.toFixed(1) || 'N/A');

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Link href={`/${isTVShow ? 'tv' : 'movie'}/${item.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-center px-2">{title}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white font-bold">{title}</h3>
          <p className="text-white text-sm">{year}</p>
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-white text-sm">{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}