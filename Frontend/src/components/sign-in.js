"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ArrowLeft } from "lucide-react"

export default function SignIn({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: "User",
        email: formData.email,
      })
      setIsLoading(false)
      navigate("/chat")
    }, 1000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="back-button">
            <ArrowLeft className="icon" />
          </Button>
          <h1 className="auth-title">
            Sign in to medi<span className="text-sky-500 font-bold">BOT</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="auth-input"
            />
          </div>

          <div className="forgot-password">
            <a href="#" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="auth-submit-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="auth-divider">
          <span className="divider-text">OR</span>
        </div>


        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Button variant="link" onClick={() => navigate("/signup")} className="auth-link">
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}

