"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

export default function ToolNavigationGuide() {
  return (
    <div className="mt-8 text-center animate-fadeInUp">
      <div className="inline-block bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto">
        <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center">
          <Heart className="h-5 w-5 text-tadashi-blue mr-2" />
          Discover All Health Tools
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Tadashi AI offers 18+ specialized health tools. Visit the{" "}
          <Link href="/all-tools" className="text-tadashi-blue dark:text-tadashi-blue font-medium hover:underline">
            All Tools
          </Link>{" "}
          page to explore all features:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">💊 Reminders</span>
          <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">😴 Sleep Tracker</span>
          <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">🥗 Nutrition</span>
          <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">🏃 Fitness</span>
          <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">+14 more!</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-xs mt-3">
          Look for the <span className="font-bold">menu icon</span> in the top right corner to quickly access any tool
        </p>
      </div>
    </div>
  )
}