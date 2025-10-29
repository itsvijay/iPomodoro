'use client'

import { useState } from 'react'
import { Settings, BarChart3, User, LogIn, LogOut, Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { AuthModal } from './AuthModal'

interface HeaderProps {
  onSettingsClick: () => void
  onStatsClick: () => void
}

export function Header({ onSettingsClick, onStatsClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, signOut } = useAuth()

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const handleAuth = () => {
    if (user) {
      signOut()
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">iP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              iPomodoro
            </span>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStatsClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="View Statistics"
            >
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettingsClick}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>

            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAuth}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                user
                  ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {user ? (
                <>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                  <LogOut className="w-4 h-4" />
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </>
              )}
            </motion.button>
          </nav>
        </div>
      </div>
      
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </header>
  )
}
