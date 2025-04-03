"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ChatInterface from "./components/chat-interface"
import Sidebar from "./components/sidebar"
import HomePage from "./components/home-page"
import SignIn from "./components/sign-in"
import SignUp from "./components/sign-up"
import { ThemeProvider } from "./components/theme-provider"
import "./index.css"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogin = (userData) => {
    // In a real app, this would validate credentials with a backend
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
          <Route
            path="/chat"
            element={
              <div className="flex h-full">
                <Sidebar
                  isOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                  isLoggedIn={isLoggedIn}
                  user={user}
                  handleLogout={handleLogout}
                />

                <main className="flex-1 flex flex-col">
                  <ChatInterface toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} />
                </main>
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App

