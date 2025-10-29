'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { useResponsive } from './ResponsiveWrapper'

export function PomodoroTimer() {
  const {
    timeLeft,
    isRunning,
    currentPhase,
    sessionsCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    nextPhase,
    settings
  } = usePomodoroStore()

  const { isMobile } = useResponsive()
  const [showNotification, setShowNotification] = useState(false)

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle timer completion
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      pauseTimer()
      
      // Play notification sound
      if (settings.soundEnabled && (window as any).playNotificationSound) {
        (window as any).playNotificationSound()
      }

      // Show notification
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)

      // Auto-advance to next phase after a delay
      setTimeout(() => {
        nextPhase()
      }, 2000)
    }
  }, [timeLeft, isRunning, pauseTimer, nextPhase, settings.soundEnabled])

  const handlePlayPause = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  const handleReset = () => {
    resetTimer()
  }

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'focus':
        return 'from-red-500 to-pink-500'
      case 'shortBreak':
        return 'from-green-500 to-emerald-500'
      case 'longBreak':
        return 'from-blue-500 to-cyan-500'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'focus':
        return 'Focus Time'
      case 'shortBreak':
        return 'Short Break'
      case 'longBreak':
        return 'Long Break'
      default:
        return 'Ready'
    }
  }

  return (
    <div className="relative">
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {currentPhase === 'focus' ? 'Break Time!' : 'Back to Work!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Timer Circle */}
      <div className={`relative mx-auto mb-8 ${isMobile ? 'w-64 h-64' : 'w-80 h-80'}`}>
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor()} opacity-20`}
          animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 2, repeat: isRunning ? Infinity : 0 }}
        />
        
        <div className="absolute inset-4 glass-effect rounded-full flex flex-col items-center justify-center">
          <motion.div
            key={currentPhase}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {getPhaseText()}
            </h2>
            <div className={`font-mono font-bold text-gray-900 dark:text-gray-100 mb-4 ${isMobile ? 'text-4xl' : 'text-6xl'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Sessions completed: {sessionsCompleted}
            </div>
          </motion.div>
        </div>

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className={`text-gradient-to-r ${getPhaseColor()}`}
            style={{
              strokeDasharray: 283,
              strokeDashoffset: 283 - (283 * (timeLeft / (currentPhase === 'focus' ? settings.focusTime : currentPhase === 'shortBreak' ? settings.shortBreakTime : settings.longBreakTime)))
            }}
            initial={{ strokeDashoffset: 283 }}
            animate={{ 
              strokeDashoffset: 283 - (283 * (timeLeft / (currentPhase === 'focus' ? settings.focusTime : currentPhase === 'shortBreak' ? settings.shortBreakTime : settings.longBreakTime)))
            }}
            transition={{ duration: 1 }}
          />
        </svg>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePlayPause}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors ${
            isRunning 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="w-16 h-16 rounded-full bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center shadow-lg transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>
      </div>

    </div>
  )
}
