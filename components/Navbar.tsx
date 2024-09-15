"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Play, Tv, BookOpen, Settings } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:left-0 md:right-auto md:h-full bg-black z-50">
      <div className="flex md:flex-col items-center justify-around md:justify-start md:h-full py-2 md:py-8 md:px-4">
        <NavItem href="/" icon={<Home />} label="Home" isActive={pathname === '/'} />
        <NavItem href="/search" icon={<Search />} label="Search" isActive={pathname === '/search'} />
        <NavItem href="/movies" icon={<Play />} label="Movies" isActive={pathname === '/movies'} />
        <NavItem href="/tv-shows" icon={<Tv />} label="TV Shows" isActive={pathname === '/tv-shows'} />
        <NavItem href="/my-list" icon={<BookOpen />} label="My List" isActive={pathname === '/my-list'} />
        <NavItem href="/settings" icon={<Settings />} label="Settings" isActive={pathname === '/settings'} />
      </div>
    </nav>
  )
}

function NavItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex flex-col items-center justify-center w-16 h-16 md:w-full md:h-16 md:mb-4 transition-colors ${
        isActive ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
      }`}
    >
      {icon}
      <span className="text-xs mt-1 hidden md:block">{label}</span>
    </Link>
  )
}