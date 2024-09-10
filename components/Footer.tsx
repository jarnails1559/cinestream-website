import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CineStream</h3>
            <p className="mb-4">Experience the future of movie streaming.</p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><Facebook /></a>
              <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><Twitter /></a>
              <a href="#" aria-label="Instagram" className="hover:text-primary transition-colors"><Instagram /></a>
              <a href="#" aria-label="Youtube" className="hover:text-primary transition-colors"><Youtube /></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
              <li><Link href="/tv-shows" className="hover:text-primary transition-colors">TV Shows</Link></li>
              <li><Link href="/new-releases" className="hover:text-primary transition-colors">New Releases</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/help-center" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} CineStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}