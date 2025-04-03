"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import * as THREE from "three"
import HALO from "vanta/dist/vanta.halo.min"
import { Heart, Stethoscope, MessageSquare } from "lucide-react"

export default function HomePage() {
  const [vantaEffect, setVantaEffect] = useState(null)
  const vantaRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          baseColor: 0x0,
          backgroundColor: 0x1a203d,
          amplitudeFactor: 2.0,
          size: 1.5,
        }),
      )
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  const handleStartChat = () => {
    navigate("/chat")
  }

  const handleSignIn = () => {
    navigate("/signin")
  }

  const handleSignUp = () => {
    navigate("/signup")
  }

  return (
    <div ref={vantaRef} className="home-page">
      <div className="home-content">
        <div className="logo-container">
          <h1 className="home-logo">
            medi<span className="text-sky-500 font-bold">BOT</span>
          </h1>
        </div>

        <div className="home-description">
          <p>Your intelligent medical assistant for health guidance and information.</p>
          <p>Get reliable medical advice and support anytime, anywhere.</p>
        </div>

        <div className="home-features">
          <div className="feature">
            <div className="feature-icon">
              <Stethoscope className="icon" />
            </div>
            <h3>Medical Guidance</h3>
            <p>Get reliable information about symptoms, conditions, and treatments.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <Heart className="icon" />
            </div>
            <h3>Health Support</h3>
            <p>Receive personalized health recommendations and wellness tips.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <MessageSquare className="icon" />
            </div>
            <h3>24/7 Assistance</h3>
            <p>Access medical information whenever you need it, day or night.</p>
          </div>
        </div>

        <div className="home-cta">
          <Button onClick={handleStartChat} className="start-chat-button">
            Start Chatting
          </Button>
        </div>

        <div className="home-disclaimer">
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong> mediBOT provides general information and is not a substitute for professional
            medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical
            concerns.
          </p>
        </div>

        <div className="home-auth">
          <p>Already have an account?</p>
          <div className="auth-buttons">
            <Button variant="outline" onClick={handleSignIn} className="signin-button">
              Sign In
            </Button>
            <Button onClick={handleSignUp} className="signup-button">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
