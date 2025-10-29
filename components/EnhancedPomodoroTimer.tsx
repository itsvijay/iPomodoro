'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, X, Plus, Tag, Clock } from 'lucide-react'
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
    cancelTimer,
    resetTimer,
    nextPhase,
    settings,
    currentTask,
    currentSession,
    availableTags,
    createTask,
    addTag
  } = usePomodoroStore()

  const { isMobile } = useResponsive()
  const [showNotification, setShowNotification] = useState(false)
  const [taskDescription, setTaskDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)

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

  const handleStartTimer = () => {
    if (!taskDescription.trim()) {
      alert('Please enter a task description')
      return
    }

    const task = createTask(taskDescription, selectedTags)
    startTimer(task)
  }

  const handlePauseTimer = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      // Resume timer
      const task = createTask(taskDescription, selectedTags)
      startTimer(task)
    }
  }

  const handleCancelTimer = () => {
    cancelTimer()
    setTaskDescription('')
    setSelectedTags([])
  }

  const handleResetTimer = () => {
    resetTimer()
    setTaskDescription('')
    setSelectedTags([])
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const addNewTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      addTag(newTag.trim())
      setSelectedTags(prev => [...prev, newTag.trim()])
      setNewTag('')
      setShowTagInput(false)
    }
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

      {/* Main Timer Section */}
      <div className="glass-effect rounded-2xl p-6 mb-8">
        {/* Timer Display */}
        <div className="text-center mb-6">
          <motion.div
            key={currentPhase}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
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

        {/* Single Row Input Section */}
        <div className="space-y-4">
          {/* Task Description Input */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="What are you working on?"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={isRunning}
              />
            </div>
          </div>

          {/* Tags Selection */}
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
            
            {/* Available Tags */}
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                disabled={isRunning}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
            
            {/* Add New Tag Button */}
            {!showTagInput ? (
              <button
                onClick={() => setShowTagInput(true)}
                disabled={isRunning}
                className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tag</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag"
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onKeyPress={(e) => e.key === 'Enter' && addNewTag()}
                />
                <button
                  onClick={addNewTag}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowTagInput(false)
                    setNewTag('')
                  }}
                  className="px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartTimer}
                className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Start Timer</span>
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePauseTimer}
                  className="flex items-center space-x-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelTimer}
                  className="flex items-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </motion.button>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResetTimer}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </motion.button>
          </div>

          {/* Current Task Display */}
          {currentTask && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Current Task
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 mb-2">{currentTask.description}</p>
              <div className="flex flex-wrap gap-1">
                {currentTask.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

