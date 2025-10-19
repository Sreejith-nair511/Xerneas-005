import Link from "next/link"
import { Heart } from "lucide-react"

const Footer = () => {
  return (
    <footer className="tadashi-footer">
      <div className="tadashi-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-tadashi-darkBlue dark:text-tadashi-blue">Tadashi AI</span>
            </Link>
            <p className="mt-4 tadashi-footer-text max-w-md">
              Your personal healthcare companion, inspired by Disney's lovable robot. We're here to help you stay
              healthy and happy.
            </p>
          </div>

          <div>
            <h3 className="tadashi-footer-heading">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="tadashi-footer-link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/chatbot"
                  className="tadashi-footer-link"
                >
                  Chatbot
                </Link>
              </li>
              <li>
                <Link
                  href="/health-check"
                  className="tadashi-footer-link"
                >
                  Health Check
                </Link>
              </li>
              <li>
                <Link
                  href="/tts-stt"
                  className="tadashi-footer-link"
                >
                  TTS/STT
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className="tadashi-footer-link"
                >
                  Premium
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="tadashi-footer-link"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="tadashi-footer-link"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="tadashi-footer-heading">Contact</h3>
            <ul className="space-y-2">
              <li className="tadashi-footer-text">San Fransokyo Institute of Technology</li>
              <li className="tadashi-footer-text">contact@tadashi-ai.com</li>
              <li className="tadashi-footer-text">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center tadashi-footer-text flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500 inline" /> by Tadashi AI Team
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer