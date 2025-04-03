"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Menu, MessageSquare, Mic, PaperclipIcon, Send, ImageIcon, FileVideo, File, Home } from "lucide-react"
import ChatMessage from "./chat-message"

export default function ChatInterface({ toggleSidebar, isLoggedIn, openAuthModal }) {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! I'm mediBOT, your medical assistant. How can I help you today?", sender: "bot" },
  ])
  const [inputText, setInputText] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [inputMode, setInputMode] = useState("text")

  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputText.trim() && selectedFiles.length === 0) return

    // Create a new message
    const newMessage = {
      id: Date.now(),
      content: inputText,
      sender: "user",
      files: selectedFiles.length > 0 ? selectedFiles : undefined,
    }

    setMessages([...messages, newMessage])

    // Clear input and files
    setInputText("")
    setSelectedFiles([])

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        content:
          "I've received your message. Please note that I can provide general medical information, but I'm not a substitute for professional medical advice. How else can I assist you?",
        sender: "bot",
      }
      setMessages((prevMessages) => [...prevMessages, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)

    // Create preview URLs for the files
    const fileObjects = files.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }))

    setSelectedFiles([...selectedFiles, ...fileObjects])
  }

  const removeFile = (index) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)
  }

  const toggleRecording = () => {
    // In a real implementation, this would use the Web Audio API
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording logic would go here
      console.log("Recording started")
    } else {
      // Stop recording and process audio would go here
      console.log("Recording stopped")
    }
  }

  const goToHome = () => {
    navigate("/")
  }

  return (
    <div className="chat-interface">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="menu-button">
            <Menu className="icon" />
          </Button>
          <h1 className="app-title">
            medi<span className="text-sky-500 font-bold">BOT</span>
          </h1>
          <Button variant="ghost" size="icon" onClick={goToHome} className="home-button">
            <Home className="icon" />
          </Button>
        </div>

        <div className="header-right">
          {!isLoggedIn ? (
            <div className="auth-buttons">
              <Button variant="outline" onClick={() => openAuthModal("signin")}>
                Sign In
              </Button>
              <Button onClick={() => openAuthModal("signup")}>Sign Up</Button>
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
                    <File className="file-icon" />
                  </div>
                )}
                <button className="remove-file-button" onClick={() => removeFile(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <Tabs value={inputMode} onValueChange={setInputMode} className="input-tabs">
          <TabsList className="tabs-list">
            <TabsTrigger value="text" active={inputMode === "text"}>
              <MessageSquare className="icon" />
              Text
            </TabsTrigger>
            <TabsTrigger value="media" active={inputMode === "media"}>
              <PaperclipIcon className="icon" />
              Media
            </TabsTrigger>
            <TabsTrigger value="audio" active={inputMode === "audio"}>
              <Mic className="icon" />
              Audio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="tab-content">
            <div className="text-input-container">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your symptoms or ask a medical question..."
                className="message-textarea"
              />
              <Button onClick={handleSendMessage} size="icon" className="send-button">
                <Send className="icon" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="media" className="tab-content">
            <div className="media-input-container">
              <div className="media-buttons">
                <Button
                  variant="outline"
                  onClick={() => {
                    fileInputRef.current.accept = "image/*"
                    fileInputRef.current.click()
                  }}
                >
                  <ImageIcon className="icon" />
                  Image
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    fileInputRef.current.accept = "video/*"
                    fileInputRef.current.click()
                  }}
                >
                  <FileVideo className="icon" />
                  Video
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    fileInputRef.current.accept = "*"
                    fileInputRef.current.click()
                  }}
                >
                  <File className="icon" />
                  File
                </Button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
              <div className="caption-input-container">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Add a description of your medical concern..."
                  className="caption-input"
                />
                <Button onClick={handleSendMessage} size="icon" className="send-button">
                  <Send className="icon" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="tab-content">
            <div className="audio-input-container">
              <div className="record-button-container">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  className={`record-button ${isRecording ? "recording" : ""}`}
                  onClick={toggleRecording}
                >
                  <Mic className={`icon ${isRecording ? "pulse" : ""}`} />
                </Button>
              </div>
              <p className="record-status">{isRecording ? "Recording... Click to stop" : "Click to start recording"}</p>
              {isRecording && (
                <div className="recording-indicator">
                  <div className="recording-progress">
                    <div className="recording-progress-bar"></div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

