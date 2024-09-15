"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type SettingsContextType = {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  subtitles: boolean
  setSubtitles: (value: boolean) => void
  autoplay: boolean
  setAutoplay: (value: boolean) => void
  videoQuality: 'auto' | '480p' | '720p' | '1080p'
  setVideoQuality: (value: 'auto' | '480p' | '720p' | '1080p') => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true)
  const [subtitles, setSubtitles] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [videoQuality, setVideoQuality] = useState<'auto' | '480p' | '720p' | '1080p'>('auto')

  useEffect(() => {
    // Apply dark mode
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <SettingsContext.Provider value={{
      darkMode, setDarkMode,
      subtitles, setSubtitles,
      autoplay, setAutoplay,
      videoQuality, setVideoQuality
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}