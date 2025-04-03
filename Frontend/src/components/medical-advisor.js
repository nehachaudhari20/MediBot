"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send, Stethoscope, Loader2 } from "lucide-react"

export default function MedicalAdvisor() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your medical advisor. I can provide general medical information and guidance. What health concerns would you like to discuss today?",
    },
  ])
  const messagesEndRef = useRef(null)

  // Scroll to bottom when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!query.trim()) return

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: query }])

    // Clear input
    setQuery("")

    // Set loading state
    setIsLoading(true)

    try {
      // Call the API
      const response = await fetch("/api/medical-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to get medical advice")
      }

      const data = await response.json()

      // Add assistant response to conversation
      setConversation((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error getting medical advice:", error)
      // Add error message to conversation
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="medical-advisor">
      <div className="medical-advisor-header">
        <Stethoscope className="icon" />
        <h2>Medical Advisor</h2>
      </div>

      <div className="medical-advisor-messages">
        {conversation.map((message, index) => (
          <div key={index} className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-content loading">
              <Loader2 className="animate-spin" />
              <span>Analyzing your medical query...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="medical-advisor-input">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your symptoms or ask a medical question..."
          className="medical-input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          disabled={isLoading}
        />
        <Button type="submit" className="send-button" disabled={isLoading || !query.trim()}>
          <Send className="icon" />
        </Button>
      </form>

      <div className="medical-disclaimer">
        <p>
          <strong>Disclaimer:</strong> This medical advisor provides general information only and is not a substitute
          for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider
          for medical concerns.
        </p>
      </div>
    </div>
  )
}

