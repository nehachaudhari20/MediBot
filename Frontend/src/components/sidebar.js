"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Search,
  Plus,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  Trash2,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  toggleSidebar,
  isLoggedIn,
  user,
  handleLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: "HISTORY 1",
      date: "2 hours ago",
      preview: "ABC",
    },
    {
      id: 2,
      title: "HISTORY 2",
      date: "Yesterday",
      preview: "XYZ",
    }
  ]);

  const navigate = useNavigate();

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteConversation = (id, e) => {
    e.stopPropagation();
    setConversations(conversations.filter((conv) => conv.id !== id));
  };

  const startNewChat = () => {
    navigate("/chat");
  };

  if (!isOpen) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="mediBOT Logo" className="logo-image" />
          <h2 className="sidebar-title">
            Dr.<span className="text-sky-500 font-bold"> MAMA</span>
          </h2>
        </div>
        <div className="sidebar-actions">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="close-sidebar-button"
          >
            <ChevronLeft className="icon" />
          </Button>
        </div>
      </div>

      <div className="sidebar-buttons">
        <Button className="new-chat-button" onClick={startNewChat}>
          <Plus className="icon" />
          New Chat
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
              <div className="user-info">
                <p className="user-name">{user?.name || "User"}</p>
                <p className="user-email">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <div className="user-actions">
              <Button variant="ghost" size="icon" className="settings-button">
                <Settings className="icon" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="logout-button"
              >
                <LogOut className="icon" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="sidebar-info">
            <p>Dr MAMA - Your medical assistant</p>
          </div>
        )}
      </div>
    </div>
  );
}