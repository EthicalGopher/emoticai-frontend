import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/contexts/ChatContext'
import { Button } from './ui/button'
import { 
  MessageSquare, 
  PlusCircle, 
  LogOut, 
  Trash2, 
  Menu,
  X 
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

const Sidebar = () => {
  const { logout, user } = useAuth()
  const { chats, activeChat, setActiveChat, createChat, deleteChat } = useChat()
  const [isOpen, setIsOpen] = useState(false)

  const handleNewChat = () => {
    createChat()
    setIsOpen(false)
  }

  const handleChatSelect = (chat) => {
    setActiveChat(chat)
    setIsOpen(false)
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent 
              chats={chats}
              activeChat={activeChat}
              onNewChat={handleNewChat}
              onChatSelect={handleChatSelect}
              onDeleteChat={handleDeleteChat}
              onLogout={logout}
              username={user?.name}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-10 md:w-[280px] md:border-r md:bg-background">
        <SidebarContent 
          chats={chats}
          activeChat={activeChat}
          onNewChat={handleNewChat}
          onChatSelect={handleChatSelect}
          onDeleteChat={handleDeleteChat}
          onLogout={logout}
          username={user?.name}
        />
      </div>
    </>
  )
}

const SidebarContent = ({ 
  chats, 
  activeChat, 
  onNewChat, 
  onChatSelect, 
  onDeleteChat, 
  onLogout, 
  username 
}) => {
  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-4 mb-4">
        <Button 
          onClick={onNewChat} 
          variant="outline" 
          className="w-full justify-start gap-2"
        >
          <PlusCircle size={16} />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div 
              key={chat.id}
              className={`flex items-center justify-between group rounded-lg p-2 cursor-pointer hover:bg-accent ${activeChat?.id === chat.id ? 'bg-accent' : ''}`}
              onClick={() => onChatSelect(chat)}
            >
              <div className="flex items-center gap-2 text-sm truncate flex-1">
                <MessageSquare size={16} />
                <span className="truncate">{chat.title}</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => onDeleteChat(e, chat.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete chat</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
          {chats.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-4">
              No chats yet
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto border-t pt-4 px-4">
        <div className="flex items-center mb-2">
          <span className="text-sm font-medium flex-1 truncate">
            {username || 'User'}
          </span>
        </div>
        <Button 
          onClick={onLogout} 
          variant="ghost" 
          className="w-full justify-start gap-2"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Sidebar