"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatBot from "@/components/chat-bot"
import { cn } from "@/lib/utils"

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Chat button */}
      <Button
        className={cn(
          "fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-40 flex items-center justify-center",
          isOpen ? "bg-gray-600 dark:bg-gray-700" : "bg-baymax-darkBlue dark:bg-baymax-blue",
        )}
        onClick={toggleChat}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-gray-800 rounded-3xl shadow-xl z-40 transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="bg-baymax-blue dark:bg-baymax-darkBlue rounded-t-3xl p-4">
            <h3 className="text-white font-semibold text-lg">Baymax Assistant</h3>
          </div>
          <div className="flex-grow overflow-hidden">
            <ChatBot inPopup={true} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatButton
