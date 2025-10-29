'use client'

import { useState } from 'react'
import { X, Clock, Volume2, VolumeX, Bell, BellOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePomodoroStore } from '@/store/pomodoroStore'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings } = usePomodoroStore()
  const [localSettings, setLocalSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(localSettings)
    onClose()
  }

  const handleCancel = () => {
    setLocalSettings(settings)
    onClose()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  const updateSetting = (key: keyof typeof localSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Timer Durations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Timer Durations
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Focus Time
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={localSettings.focusTime / 60}
                      onChange={(e) => updateSetting('focusTime', parseInt(e.target.value) * 60)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                      {formatTime(localSettings.focusTime)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Short Break
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={localSettings.shortBreakTime / 60}
                      onChange={(e) => updateSetting('shortBreakTime', parseInt(e.target.value) * 60)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                      {formatTime(localSettings.shortBreakTime)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Long Break
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={localSettings.longBreakTime / 60}
                      onChange={(e) => updateSetting('longBreakTime', parseInt(e.target.value) * 60)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                      {formatTime(localSettings.longBreakTime)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sessions Until Long Break
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="2"
                      max="8"
                      value={localSettings.sessionsUntilLongBreak}
                      onChange={(e) => updateSetting('sessionsUntilLongBreak', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                      {localSettings.sessionsUntilLongBreak}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sound Notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Play sound when timer completes
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('soundEnabled', !localSettings.soundEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Browser Notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Show browser notifications
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('notificationsEnabled', !localSettings.notificationsEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto-start Breaks
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatically start break timers
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('autoStartBreaks', !localSettings.autoStartBreaks)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.autoStartBreaks ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Auto-start Sessions
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatically start focus sessions
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('autoStartSessions', !localSettings.autoStartSessions)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.autoStartSessions ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.autoStartSessions ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

