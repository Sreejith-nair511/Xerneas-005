import ChatBot from "@/components/chat-bot"
import ParticleBackground from "@/components/particle-background"

export const metadata = {
  title: "Chatbot | Tadashi AI - Open Beta",
  description: "Chat with Tadashi AI, your personal healthcare companion. Now in Open Beta for India!",
}

export default function ChatbotPage() {
  return (
    <div className="pt-24 pb-12 min-h-screen bg-tadashi-lightBlue dark:bg-gray-800 theme-aware relative overflow-hidden">
      <ParticleBackground />
      <div className="tadashi-container relative z-10">
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="tadashi-hero">
            Chat with Tadashi AI - Open Beta
          </h1>
          <p className="tadashi-tagline">
            I am Tadashi AI, your personal healthcare companion. How can I assist you today?
          </p>
          <div className="mt-4 p-3 bg-tadashi-blue/10 dark:bg-tadashi-darkBlue/20 rounded-lg inline-block">
            <p className="text-tadashi-darkBlue dark:text-tadashi-blue font-medium">
              🎉 All premium features unlocked during Open Beta - Enjoy premium healthcare assistance for free!
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto animate-fadeInUp">
          <div className="tadashi-chat-container">
            <div className="tadashi-chat-messages">
              <ChatBot />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center animate-fadeInUp">
          <div className="inline-block bg-gradient-to-r from-tadashi-blue to-tadashi-darkBlue text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="font-medium">Want even more advanced healthcare features?</p>
            <p className="font-bold">All features unlocked during Open Beta - Free access!</p>
          </div>
        </div>
        
        <div className="mt-6 text-center animate-fadeInUp">
          <div className="inline-block bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-800 max-w-2xl mx-auto">
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Discover All Health Tools</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              Tadashi AI offers 18+ specialized health tools beyond chat. Visit the 
              <a href="/all-tools" className="text-tadashi-blue dark:text-tadashi-blue font-medium hover:underline">All Tools</a> page to explore:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">💊 Reminders</span>
              <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">😴 Sleep Tracker</span>
              <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">🥗 Nutrition</span>
              <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">🏃 Fitness</span>
              <span className="bg-white dark:bg-gray-700 px-2 py-1 rounded-lg text-xs">+14 more!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}