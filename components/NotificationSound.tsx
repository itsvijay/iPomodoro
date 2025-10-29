'use client'

import { useEffect, useRef } from 'react'

interface NotificationSoundProps {
  enabled: boolean
}

export function NotificationSound({ enabled }: NotificationSoundProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (enabled && audioRef.current) {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      const playNotification = () => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      }

      // Store the play function globally for use by other components
      ;(window as any).playNotificationSound = playNotification
    }
  }, [enabled])

  return (
    <audio
      ref={audioRef}
      preload="auto"
      style={{ display: 'none' }}
    />
  )
}

