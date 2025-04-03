"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Menu, Send, PaperclipIcon, Home } from "lucide-react";
import ChatMessage from "./chat-message";

export default function ChatInterface({ toggleSidebar, isLoggedIn }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content:
        "Hello! I'm mediBOT, your medical assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ...existing code...
  const handleSendMessage = async () => {
    if (!inputText.trim() && selectedFiles.length === 0) return;

    const newMessage = {
      id: Date.now(),
      content: inputText,
      sender: "user",
      files: selectedFiles.length > 0 ? selectedFiles : undefined,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      const response = await fetch("http://localhost:8000/rag/query_rag/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText, // Send actual input text instead of "hello"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botResponse = {
        id: Date.now() + 1,
        content: data.response,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 1,
          content: "Error: Unable to fetch response. Please try again.",
          sender: "bot",
        },
      ]);
    }

    // Clear input and files
    setInputText("");
    setSelectedFiles([]);
  };
  // ...existing code...

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs for the files
    const fileObjects = files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    setSelectedFiles([...selectedFiles, ...fileObjects]);
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <div className="chat-interface">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="menu-button"
          >
            <Menu className="icon" />
          </Button>
          <h1 className="app-title">
            medi<span className="text-sky-500 font-bold">BOT</span>
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToHome}
            className="home-button"
          >
            <Home className="icon" />
          </Button>
        </div>

        <div className="header-right">
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <Button
                variant="outline"
                onClick={() => navigate("/signin")}
                className="signin-button"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                className="signup-button"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="user-welcome">
              <span>Welcome back!</span>
            </div>
          )}
        </div>
      </header>

      {/* Chat Messages */}
      <div className="messages-container">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="file-previews">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-preview">
                {file.type.startsWith("image/") ? (
                  <div className="image-preview">
                    <img src={file.url || "/placeholder.svg"} alt={file.name} />
                  </div>
                ) : (
                  <div className="generic-preview">
                    <div className="file-icon"></div>
                  </div>
                )}
                <button
                  className="remove-file-button"
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-input-container">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Describe your symptoms or ask a medical question..."
            className="message-textarea"
          />
          <div className="input-actions">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current.click()}
              className="file-button"
            >
              <PaperclipIcon className="icon" />
            </Button>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="send-button"
            >
              <Send className="icon" />
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            multiple
          />
        </div>
      </div>
    </div>
  );
}
