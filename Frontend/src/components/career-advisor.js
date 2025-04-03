"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Send, Briefcase, Loader2 } from "lucide-react"

export default function CareerAdvisor() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversation, setConversation] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your career advisor. Ask me about any career path you're interested in, and I'll provide guidance on how to get started and progress in that field.",
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
      const response = await fetch("/api/career-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to get career advice")
      }

      const data = await response.json()

      // Add assistant response to conversation
      setConversation((prev) => [...prev, { role: "assistant", content: data.response }])
    } catch (error) {
      console.error("Error getting career advice:", error)
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
    <div className="career-advisor">
      <div className="career-advisor-header">
        <Briefcase className="icon" />
        <h2>Career Advisor</h2>
      </div>

      <div className="career-advisor-messages">
        {conversation.map((message, index) => (
          <div key={index} className={`message ${message.role === "user" ? "user-message" : "assistant-message"}`}>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-content loading">
              <Loader2 className="animate-spin" />
              <span>Generating career advice...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="career-advisor-input">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about a career path (e.g., 'How to become a data scientist?')"
          className="career-input"
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
    </div>
  )
}

