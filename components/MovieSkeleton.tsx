import { useEffect, useState } from 'react'

export default function MovieSkeleton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="bg-gray-700 rounded-lg w-40 h-60 mb-2"></div>
      <div className="bg-gray-700 h-4 w-32 rounded mb-1"></div>
      <div className="bg-gray-700 h-3 w-24 rounded"></div>
    </div>
  )
}