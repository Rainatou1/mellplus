// hooks/useIdleTimer.js
import { useEffect, useRef, useCallback } from 'react'

const useIdleTimer = (onIdle, timeout = 15 * 60 * 1000) => {
  const timeoutRef = useRef(null)
  const isIdleRef = useRef(false)

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    isIdleRef.current = false

    timeoutRef.current = setTimeout(() => {
      if (!isIdleRef.current) {
        isIdleRef.current = true
        onIdle()
      }
    }, timeout)
  }, [onIdle, timeout])

  const handleActivity = useCallback(() => {
    if (!isIdleRef.current) {
      resetTimer()
    }
  }, [resetTimer])

  useEffect(() => {
    // Events qui indiquent une activité de l'utilisateur
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown'
    ]

    // Démarrer le timer
    resetTimer()

    // Ajouter les event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [handleActivity, resetTimer])

  // Fonction pour redémarrer manuellement le timer
  const restart = useCallback(() => {
    isIdleRef.current = false
    resetTimer()
  }, [resetTimer])

  return { restart }
}

export default useIdleTimer