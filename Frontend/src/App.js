"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ChatInterface from "./components/chat-interface"
import Sidebar from "./components/sidebar"
import AuthModal from "./components/auth-modal"
import HomePage from "./components/home-page"
import MedicalAdvisor from "./components/medical-advisor"
import { ThemeProvider } from "./components/theme-provider"
import "./index.css"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState("signin") // 'signin' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const openAuthModal = (mode) => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleLogin = (userData) => {
    // In a real app, this would validate credentials with a backend
    setUser(userData)
    setIsLoggedIn(true)
    setIsAuthModalOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage openAuthModal={openAuthModal} />} />
          <Route
            path="/chat"
            element={
              <div className="flex h-full">
                <Sidebar
                  isOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  isLoggedIn={isLoggedIn}
                  user={user}
                  openAuthModal={openAuthModal}
                  handleLogout={handleLogout}
                />

                <main className="flex-1 flex flex-col">
                  <ChatInterface toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} openAuthModal={openAuthModal} />
                </main>
              </div>
            }
          />
          <Route
            path="/medical"
            element={
              <div className="flex h-full">
                <Sidebar
                  isOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  isLoggedIn={isLoggedIn}
                  user={user}
                  openAuthModal={openAuthModal}
                  handleLogout={handleLogout}
                />

                <main className="flex-1 flex flex-col">
                  <MedicalAdvisor />
                </main>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {isAuthModalOpen && (
          <AuthModal
            mode={authMode}
            onClose={() => setIsAuthModalOpen(false)}
            onLogin={handleLogin}
            onSwitchMode={(mode) => setAuthMode(mode)}
          />
        )}
      </Router>
    </ThemeProvider>
  )
}

export default App

