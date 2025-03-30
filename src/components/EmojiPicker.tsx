"use client"

import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.tsx"
import { Smile } from "lucide-react"

const EMOJI_CATEGORIES = {
  "Smileys & People": [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
  ],
  "Animals & Nature": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
  "Food & Drink": ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥"],
  Activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍"],
  "Travel & Places": ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲"],
  Objects: ["⌚", "📱", "💻", "⌨️", "🖥", "🖨", "🖱", "🖲", "🕹", "🗜", "💽", "💾", "💿", "📀", "📼"],
  Symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘"],
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = React.useState<string>(Object.keys(EMOJI_CATEGORIES)[0])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors">
          <Smile size={20} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-gray-900 border border-gray-800 shadow-xl" sideOffset={5}>
        <div className="flex flex-col max-h-60">
          <div className="flex overflow-x-auto py-2 px-1 gap-1 border-b border-gray-800 scrollbar-none">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-2 py-1 text-xs whitespace-nowrap rounded-md ${
                  activeCategory === category
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto p-2 grid grid-cols-7 gap-1 max-h-48 scrollbar-none">
            {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
              <button
                key={emoji}
                onClick={() => onEmojiSelect(emoji)}
                className="flex items-center justify-center p-1 text-lg hover:bg-gray-800 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker

