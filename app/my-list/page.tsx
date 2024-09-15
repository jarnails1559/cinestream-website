"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import FadeIn from '@/components/FadeIn'

interface ListItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
}

export default function MyListPage() {
  const [myList, setMyList] = useState<ListItem[]>([])

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('myList') || '[]')
    setMyList(storedList)
  }, [])

  const handleRemoveFromList = (id: number, type: 'movie' | 'tv') => {
    const newList = myList.filter(item => !(item.id === id && item.type === type))
    setMyList(newList)
    localStorage.setItem('myList', JSON.stringify(newList))
  }

  return (
    <Layout>
      <FadeIn>
        <main className="flex-1 bg-[#121212] text-white p-8">
          <h1 className="text-3xl font-bold mb-6">My List</h1>
          
          {myList.length === 0 ? (
            <p>Your list is empty. Add some movies or TV shows!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {myList.map((item) => (
                <div key={`${item.type}-${item.id}`} className="flex flex-col items-center">
                  <Link href={`/${item.type}/${item.id}`}>
                    <div className="relative w-40 h-60">
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title}
                        fill
                        sizes="160px"
                        quality={75}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </Link>
                  <h3 className="text-sm font-semibold text-center mt-2">{item.title}</h3>
                  <p className="text-xs text-gray-400">
                    {new Date(item.release_date || item.first_air_date || '').getFullYear()}
                    {' • '}
                    {item.type === 'movie' ? 'Movie' : 'TV Show'}
                  </p>
                  <button
                    onClick={() => handleRemoveFromList(item.id, item.type)}
                    className="mt-2 text-xs text-red-500 hover:text-red-400"
                  >
                    Remove from list
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </FadeIn>
    </Layout>
  )
}