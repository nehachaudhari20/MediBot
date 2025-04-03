"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Search, Plus, History, Settings, LogOut, ChevronLeft, Trash2, Home, Stethoscope } from "lucide-react"

export default function Sidebar({ isOpen, toggleSidebar, isLoggedIn, user, openAuthModal, handleLogout }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: "Getting started with mediBOT",
      date: "2 hours ago",
      preview: "Hello! I'm mediBOT, your medical assistant...",
    },
    {
      id: 2,
      title: "Headache symptoms",
      date: "Yesterday",
      preview: "I've been experiencing headaches for the past few days...",
    },
    {
      id: 3,
      title: "Nutrition advice",
      date: "2 days ago",
      preview: "Can you recommend a balanced diet for someone with diabetes?",
    },
  ])

  const navigate = useNavigate()

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const deleteConversation = (id, e) => {
    e.stopPropagation()
    setConversations(conversations.filter((conv) => conv.id !== id))
  }

  const startNewChat = () => {
    // In a real app, this would create a new conversation
    console.log("Starting new chat")
  }

  const goToHome = () => {
    navigate("/")
  }

  const goToMedicalAdvisor = () => {
    navigate("/medical")
  }

  if (!isOpen) return null

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          medi<span className="text-sky-500 font-bold">BOT</span>
        </h2>
        <div className="sidebar-actions">
          <Button variant="ghost" size="icon" onClick={goToHome} className="home-button">
            <Home className="icon" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="close-sidebar-button">
            <ChevronLeft className="icon" />
          </Button>
        </div>
      </div>

      <div className="sidebar-buttons">
        <Button className="new-chat-button" onClick={startNewChat}>
          <Plus className="icon" />
          New Chat
        </Button>

        <Button variant="outline" className="medical-advisor-button" onClick={goToMedicalAdvisor}>
          <Stethoscope className="icon" />
          Medical Advisor
        </Button>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <Input
            placeholder="Search conversations..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="history-header">
        <History className="history-icon" />
        <h3 className="history-title">Chat History</h3>
      </div>

      <ScrollArea className="conversations-container">
        <div className="conversations-list">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div key={conv.id} className="conversation-item">
                <div className="conversation-header">
                  <h4 className="conversation-title">{conv.title}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="delete-conversation-button"
                    onClick={(e) => deleteConversation(conv.id, e)}
                  >
                    <Trash2 className="icon" />
                  </Button>
                </div>
                <p className="conversation-preview">{conv.preview}</p>
                <p className="conversation-date">{conv.date}</p>
              </div>
            ))
          ) : (
            <div className="no-conversations">No conversations found</div>
          )}
        </div>
      </ScrollArea>

      <div className="sidebar-footer">
        {isLoggedIn ? (
          <div className="user-profile">
            <div className="user-avatar">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="user-info">
                <p className="user-name">{user?.name || "User"}</p>
                <p className="user-email">{user?.email || "user@example.com"}</p>
              </div>
            </div>
            <div className="user-actions">
              <Button variant="ghost" size="icon" className="settings-button">
                <Settings className="icon" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="logout-button">
                <LogOut className="icon" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Button variant="outline" onClick={() => openAuthModal("signin")} className="signin-button">
              Sign In
            </Button>
            <Button onClick={() => openAuthModal("signup")} className="signup-button">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

