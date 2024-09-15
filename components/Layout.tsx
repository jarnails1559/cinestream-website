import Navbar from './Navbar'
import FadeIn from './FadeIn'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row bg-[#121212] text-white min-h-screen">
      <Navbar />
      <FadeIn>
        <div className="flex-1 md:ml-16 pb-16 md:pb-0 w-full">
          {children}
        </div>
      </FadeIn>
    </div>
  )
}