'use client'

import { useState } from 'react'
import { Calendar, Clock, Tag, CheckCircle, XCircle, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePomodoroStore } from '@/store/pomodoroStore'
import { format } from 'date-fns'

export function TaskHistoryTable() {
  const { sessions, tasks } = usePomodoroStore()
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'cancelled'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'duration'>('date')

  // Get completed sessions with their tasks
  const completedSessions = sessions.filter(session => 
    session.status === 'completed' || session.status === 'cancelled'
  )

  // Filter by status
  const filteredSessions = completedSessions.filter(session => {
    if (filterStatus === 'all') return true
    return session.status === filterStatus
  })

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    } else {
      return b.duration - a.duration
    }
  })

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  if (completedSessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-8 text-center"
      >
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <Calendar className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">No Task History Yet</h3>
          <p className="text-sm">Complete or cancel some Pomodoro sessions to see your task history here.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Task History
          </h2>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm font-medium">
            {completedSessions.length}
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Date & Time
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Task Description
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Tags
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Duration
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSessions.map((session, index) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Date & Time */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(session.startTime), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(session.startTime), 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Task Description */}
                <td className="py-4 px-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {session.task.description}
                    </p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {session.phase === 'focus' ? 'Focus Session' : 
                         session.phase === 'shortBreak' ? 'Short Break' : 'Long Break'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Tags */}
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {session.task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Duration */}
                <td className="py-4 px-4">
                  <div className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {formatDuration(session.duration)}
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(session.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {completedSessions.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {completedSessions.filter(s => s.status === 'cancelled').length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Cancelled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatDuration(completedSessions.reduce((total, session) => total + session.duration, 0))}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Time</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

