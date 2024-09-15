"use client"

import Layout from '@/components/Layout'
import FadeIn from '@/components/FadeIn'
import { useSettings } from '../contexts/SettingsContext'

export default function SettingsPage() {
  const { darkMode, setDarkMode, subtitles, setSubtitles, autoplay, setAutoplay, videoQuality, setVideoQuality } = useSettings()

  return (
    <Layout>
      <FadeIn>
        <main className="flex-1 bg-[#121212] text-white p-8">
          <h1 className="text-3xl font-bold mb-6">Settings</h1>
          
          <div className="space-y-6">
            <SettingToggle
              label="Dark Mode"
              checked={darkMode}
              onChange={setDarkMode}
            />
            
            <SettingToggle
              label="Subtitles"
              checked={subtitles}
              onChange={setSubtitles}
            />
            
            <SettingToggle
              label="Autoplay"
              checked={autoplay}
              onChange={setAutoplay}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-lg">Video Quality</span>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value as 'auto' | '480p' | '720p' | '1080p')}
                className="bg-[#232323] text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="auto">Auto</option>
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </div>
          </div>
        </main>
      </FadeIn>
    </Layout>
  )
}

function SettingToggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-lg">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>
      </label>
    </div>
  )
}