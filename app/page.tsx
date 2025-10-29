'use client'

import { useState } from 'react'
import { Play, Pause, RotateCcw, Settings, BarChart3, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PomodoroTimer } from '@/components/HighPrecisionTimer'
import { StatsPanel } from '@/components/StatsPanel'
import { SettingsModal } from '@/components/SettingsModal'
import { Header } from '@/components/Header'
import { NotificationSound } from '@/components/NotificationSound'
import { TaskHistoryTable } from '@/components/TaskHistoryTable'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { ResponsiveWrapper } from '@/components/ResponsiveWrapper'

export default function Home() {
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const { settings } = usePomodoroStore()

  return (
    <ResponsiveWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header 
        onSettingsClick={() => setShowSettings(true)}
        onStatsClick={() => setShowStats(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Focus Better, Achieve More
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Boost your productivity with the Pomodoro Technique. Work in focused 25-minute sessions 
              with strategic breaks to maintain peak performance.
            </p>
          </motion.div>

          {/* Main Timer Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <PomodoroTimer />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            <div className="glass-effect rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Focus Sessions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Work in 25-minute focused sessions with automatic break reminders
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your productivity patterns and optimize your work schedule
              </p>
            </div>

            <div className="glass-effect rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customizable</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Adjust timer durations, sounds, and notifications to fit your workflow
              </p>
            </div>
          </motion.div>
        </div>

        {/* Task History Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <TaskHistoryTable />
        </motion.div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
        {showStats && (
          <StatsPanel onClose={() => setShowStats(false)} />
        )}
      </AnimatePresence>

      {/* Notification Sound */}
      <NotificationSound enabled={settings.soundEnabled} />
      </div>
    </ResponsiveWrapper>
  )
}
