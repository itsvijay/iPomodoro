import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PomodoroPhase = 'focus' | 'shortBreak' | 'longBreak'

export interface PomodoroSettings {
  focusTime: number // in seconds
  shortBreakTime: number // in seconds
  longBreakTime: number // in seconds
  sessionsUntilLongBreak: number
  soundEnabled: boolean
  notificationsEnabled: boolean
  autoStartBreaks: boolean
  autoStartSessions: boolean
}

export interface Task {
  id: string
  description: string
  tags: string[]
  startTime?: Date
  endTime?: Date
  duration?: number
  status: 'pending' | 'active' | 'completed' | 'cancelled'
}

export interface Session {
  id: string
  task: Task
  phase: PomodoroPhase
  startTime: Date
  endTime?: Date
  duration: number
  status: 'active' | 'completed' | 'cancelled'
}

interface PomodoroState {
  // Timer state
  timeLeft: number
  isRunning: boolean
  currentPhase: PomodoroPhase
  sessionsCompleted: number
  totalFocusTime: number
  
  // Task and session management
  currentTask: Task | null
  currentSession: Session | null
  availableTags: string[]
  tasks: Task[]
  sessions: Session[]
  
  // Settings
  settings: PomodoroSettings
  
  // Actions
  startTimer: (task: Task) => void
  pauseTimer: () => void
  cancelTimer: () => void
  resetTimer: () => void
  nextPhase: () => void
  updateSettings: (settings: Partial<PomodoroSettings>) => void
  
  // Task management
  createTask: (description: string, tags: string[]) => Task
  updateTask: (taskId: string, updates: Partial<Task>) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  
  // Statistics
  addSession: () => void
  addFocusTime: (seconds: number) => void
}

const defaultSettings: PomodoroSettings = {
  focusTime: 25 * 60, // 25 minutes
  shortBreakTime: 5 * 60, // 5 minutes
  longBreakTime: 15 * 60, // 15 minutes
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  notificationsEnabled: true,
  autoStartBreaks: false,
  autoStartSessions: false,
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeLeft: defaultSettings.focusTime,
      isRunning: false,
      currentPhase: 'focus',
      sessionsCompleted: 0,
      totalFocusTime: 0,
      currentTask: null,
      currentSession: null,
      availableTags: ['Work', 'Study', 'Exercise', 'Reading', 'Coding', 'Writing', 'Planning', 'Learning'],
      tasks: [],
      sessions: [],
      settings: defaultSettings,

      // Timer actions
      startTimer: (task: Task) => {
        // Clear any existing interval first
        if ((window as any).pomodoroInterval) {
          clearInterval((window as any).pomodoroInterval)
        }

        const startTime = new Date()
        const session: Session = {
          id: `session-${Date.now()}`,
          task,
          phase: get().currentPhase,
          startTime,
          duration: 0,
          status: 'active'
        }
        
        set({ 
          isRunning: true,
          currentTask: task,
          currentSession: session,
          tasks: [...get().tasks, task]
        })
        
        // Start the timer interval
        const interval = setInterval(() => {
          const state = get()
          if (state.isRunning && state.timeLeft > 0) {
            const newTimeLeft = state.timeLeft - 1
            
            // Update session duration
            let updatedSession = state.currentSession
            if (state.currentSession) {
              const duration = Math.floor((new Date().getTime() - state.currentSession.startTime.getTime()) / 1000)
              updatedSession = { ...state.currentSession, duration }
            }
            
            // Single state update with all changes
            set({ 
              timeLeft: newTimeLeft,
              currentSession: updatedSession,
              sessions: updatedSession ? state.sessions.map(s => 
                s.id === updatedSession.id ? updatedSession : s
              ) : state.sessions,
              totalFocusTime: state.currentPhase === 'focus' ? state.totalFocusTime + 1 : state.totalFocusTime
            })
          }
        }, 1000)

        // Store interval ID for cleanup
        ;(window as any).pomodoroInterval = interval
      },

      pauseTimer: () => {
        if ((window as any).pomodoroInterval) {
          clearInterval((window as any).pomodoroInterval)
          ;(window as any).pomodoroInterval = null
        }
        set({ isRunning: false })
      },

      cancelTimer: () => {
        if ((window as any).pomodoroInterval) {
          clearInterval((window as any).pomodoroInterval)
          ;(window as any).pomodoroInterval = null
        }
        
        const { currentSession } = get()
        if (currentSession) {
          const cancelledSession = {
            ...currentSession,
            endTime: new Date(),
            status: 'cancelled' as const
          }
          
          set({
            isRunning: false,
            currentTask: null,
            currentSession: null,
            sessions: [...get().sessions.map(s => 
              s.id === currentSession.id ? cancelledSession : s
            )]
          })
        }
      },

      resetTimer: () => {
        if ((window as any).pomodoroInterval) {
          clearInterval((window as any).pomodoroInterval)
          ;(window as any).pomodoroInterval = null
        }
        
        const { currentPhase, settings } = get()
        const resetTime = currentPhase === 'focus' 
          ? settings.focusTime 
          : currentPhase === 'shortBreak' 
            ? settings.shortBreakTime 
            : settings.longBreakTime
        
        set({ 
          timeLeft: resetTime, 
          isRunning: false 
        })
      },

      nextPhase: () => {
        const { currentPhase, sessionsCompleted, settings, currentSession } = get()
        
        // Mark current session as completed
        if (currentSession) {
          const completedSession = {
            ...currentSession,
            endTime: new Date(),
            status: 'completed' as const
          }
          
          set({
            sessions: [...get().sessions.map(s => 
              s.id === currentSession.id ? completedSession : s
            )]
          })
        }
        
        let nextPhase: PomodoroPhase
        let nextTime: number
        
        if (currentPhase === 'focus') {
          // After focus, decide between short and long break
          const shouldTakeLongBreak = sessionsCompleted > 0 && 
            sessionsCompleted % settings.sessionsUntilLongBreak === 0
          
          nextPhase = shouldTakeLongBreak ? 'longBreak' : 'shortBreak'
          nextTime = shouldTakeLongBreak ? settings.longBreakTime : settings.shortBreakTime
        } else {
          // After break, go back to focus
          nextPhase = 'focus'
          nextTime = settings.focusTime
        }
        
        if ((window as any).pomodoroInterval) {
          clearInterval((window as any).pomodoroInterval)
          ;(window as any).pomodoroInterval = null
        }
        
        set({ 
          currentPhase: nextPhase, 
          timeLeft: nextTime,
          isRunning: false,
          currentSession: null,
          currentTask: null
        })
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }))
        
        // Reset timer with new settings if needed
        const { currentPhase } = get()
        const { settings } = get()
        const resetTime = currentPhase === 'focus' 
          ? settings.focusTime 
          : currentPhase === 'shortBreak' 
            ? settings.shortBreakTime 
            : settings.longBreakTime
        
        set({ timeLeft: resetTime })
      },

      addSession: () => {
        set((state) => ({
          sessionsCompleted: state.sessionsCompleted + 1
        }))
      },

      addFocusTime: (seconds) => {
        set((state) => ({
          totalFocusTime: state.totalFocusTime + seconds
        }))
      },

      // Task management
      createTask: (description: string, tags: string[]) => {
        const task: Task = {
          id: `task-${Date.now()}`,
          description,
          tags,
          status: 'pending'
        }
        return task
      },

      updateTask: (taskId: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          ),
          currentTask: state.currentTask?.id === taskId 
            ? { ...state.currentTask, ...updates }
            : state.currentTask
        }))
      },

      addTag: (tag: string) => {
        set((state) => ({
          availableTags: [...state.availableTags, tag]
        }))
      },

      removeTag: (tag: string) => {
        set((state) => ({
          availableTags: state.availableTags.filter(t => t !== tag)
        }))
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        sessionsCompleted: state.sessionsCompleted,
        totalFocusTime: state.totalFocusTime,
        settings: state.settings,
        availableTags: state.availableTags,
        tasks: state.tasks,
        sessions: state.sessions,
      }),
    }
  )
)
