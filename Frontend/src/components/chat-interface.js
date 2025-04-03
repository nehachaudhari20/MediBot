"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Menu, Send, PaperclipIcon, Home } from "lucide-react"
import ChatMessage from "./chat-message"

export default function ChatInterface({ toggleSidebar, isLoggedIn }) {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! I'm mediBOT, your medical assistant. How can I help you today?", sender: "bot" },
  ])
  const [inputText, setInputText] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])

  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mock responses based on keywords
  {/*const getMockResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase()

    if (lowerCaseMessage.includes("headache") || lowerCaseMessage.includes("head pain")) {
      return "Headaches can have many causes including stress, dehydration, lack of sleep, or underlying medical conditions. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If you're experiencing severe or persistent headaches, please consult a healthcare professional."
    } else if (
      lowerCaseMessage.includes("cold") ||
      lowerCaseMessage.includes("flu") ||
      lowerCaseMessage.includes("fever")
    ) {
      return "Common cold and flu symptoms include fever, cough, sore throat, body aches, and fatigue. Rest, hydration, and over-the-counter medications can help manage symptoms. If symptoms are severe or persist for more than a week, consider consulting a healthcare provider."
    } else if (
      lowerCaseMessage.includes("diet") ||
      lowerCaseMessage.includes("nutrition") ||
      lowerCaseMessage.includes("food")
    ) {
      return "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's recommended to limit processed foods, added sugars, and excessive salt. Remember that individual nutritional needs can vary based on age, activity level, and health conditions."
    } else if (lowerCaseMessage.includes("exercise") || lowerCaseMessage.includes("workout")) {
      return "Regular physical activity is important for overall health. Adults should aim for at least 150 minutes of moderate-intensity exercise per week, along with muscle-strengthening activities twice a week. Always start gradually and consult with a healthcare provider before beginning a new exercise program, especially if you have existing health conditions."
    } else if (lowerCaseMessage.includes("sleep") || lowerCaseMessage.includes("insomnia")) {
      return "Good sleep hygiene includes maintaining a regular sleep schedule, creating a restful environment, limiting screen time before bed, and avoiding caffeine and large meals close to bedtime. Adults typically need 7-9 hours of sleep per night. Persistent sleep problems should be discussed with a healthcare provider."
    } else {
      return "I understand you're asking about a health topic. While I can provide general information, I'm not a substitute for professional medical advice. For personalized guidance, please consult with a qualified healthcare provider. Is there something specific about this topic you'd like to know?"
    }
  }*/}

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

    // Generate mock response after a short delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        content: getMockResponse(newMessage.content),
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
              <Button variant="outline" onClick={() => navigate("/signin")} className="signin-button">
                Sign In
              </Button>
              <Button onClick={() => navigate("/signup")} className="signup-button">
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
                <button className="remove-file-button" onClick={() => removeFile(index)}>
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
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current.click()} className="file-button">
              <PaperclipIcon className="icon" />
            </Button>
            <Button onClick={handleSendMessage} size="icon" className="send-button">
              <Send className="icon" />
            </Button>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
        </div>
      </div>
    </div>
  )
}

