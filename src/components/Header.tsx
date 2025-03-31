"use client"

import React from "react"
import { Button } from "../components/ui/button"
import { Menu } from "lucide-react"
import { Link } from "react-router-dom"

interface HeaderProps {
  toggleSidebar: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <div className="flex justify-between items-center w-full  p-6  items-center border-b " style={{flexDirection:"row-reverse"}}>
        <div className="flex gap-2 ">

        <div className="bg-blue-200  text-black border rounded-xl md:p-2  hidden md:block"><Link to="/speech">Voice Assistant</Link></div>
        <div className="bg-blue-200  text-black border rounded-xl md:p-2 hidden md:block"><Link to="/">Chat Assistant</Link></div>
        </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="md:hidden text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 rounded-full h-8 w-8"
        >
          <Menu size={16} />
        </Button>
        <div className="flex justify-center items-center gap-2 " >

        <div className="text-xl font-bold text-blue-500 dark:text-blue-400">EmoticAi</div>
        </div>
      </div>
    </div>
  )
}

export default Header

