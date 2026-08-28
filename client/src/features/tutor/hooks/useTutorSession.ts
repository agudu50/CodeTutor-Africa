import { useState, useCallback, useEffect } from 'react'
import { ChatMessage, ProgrammingLanguage, TutorMode, TutorSession } from '@/types'
import { aiService } from '@/services/ai/ai.service'
import { MOCK_TUTOR_SESSIONS, MOCK_INITIAL_MESSAGES } from '../data/mockTutorData'

const TUTOR_SESSIONS_STORAGE_KEY = 'codetutor_tutor_sessions_v1'
const TUTOR_MESSAGES_STORAGE_KEY = 'codetutor_tutor_messages_v1'
const TUTOR_ACTIVE_SESSION_KEY = 'codetutor_tutor_active_session_v1'

function loadStoredSessions(): TutorSession[] {
  try {
    const raw = localStorage.getItem(TUTOR_SESSIONS_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Failed to parse tutor sessions from localStorage', e)
  }
  return MOCK_TUTOR_SESSIONS
}

function loadStoredMessages(): Record<string, ChatMessage[]> {
  try {
    const raw = localStorage.getItem(TUTOR_MESSAGES_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        return parsed
      }
    }
  } catch (e) {
    console.warn('Failed to parse tutor messages from localStorage', e)
  }
  return { ...MOCK_INITIAL_MESSAGES }
}

function saveStoredSessions(sessions: TutorSession[]) {
  try {
    localStorage.setItem(TUTOR_SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  } catch (e) {
    console.warn('Failed to save tutor sessions to localStorage', e)
  }
}

function saveStoredMessages(messagesMap: Record<string, ChatMessage[]>) {
  try {
    localStorage.setItem(TUTOR_MESSAGES_STORAGE_KEY, JSON.stringify(messagesMap))
  } catch (e) {
    console.warn('Failed to save tutor messages to localStorage', e)
  }
}

function generateSmartTitle(prompt: string): string {
  const cleaned = prompt.trim().replace(/^(\?|\!|\.|\-|\#)+/, '').trim()
  if (!cleaned) return 'New Discussion'
  const firstSentence = cleaned.split(/[\n.?!]/)[0].trim()
  if (firstSentence.length <= 40) {
    return firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1)
  }
  return firstSentence.slice(0, 37).trim() + '...'
}

export function useTutorSession(initialSessionId?: string) {
  // Initialize sessions from localStorage or mock
  const [sessions, setSessions] = useState<TutorSession[]>(() => loadStoredSessions())

  // Initialize messages map from localStorage or mock
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(() => loadStoredMessages())

  // Determine active session ID
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (initialSessionId) return initialSessionId
    try {
      const savedActive = localStorage.getItem(TUTOR_ACTIVE_SESSION_KEY)
      if (savedActive) return savedActive
    } catch {
      // ignore
    }
    const initialSessions = loadStoredSessions()
    return initialSessions[0]?.id || 'session-1'
  })

  // Messages for currently active session
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const msgsMap = loadStoredMessages()
    const currentId = initialSessionId || loadStoredSessions()[0]?.id || 'session-1'
    return msgsMap[currentId] || []
  })

  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>(() => {
    const initialSessions = loadStoredSessions()
    const active = initialSessions.find((s) => s.id === (initialSessionId || initialSessions[0]?.id))
    return active?.language || 'python'
  })

  const [tutorMode, setTutorMode] = useState<TutorMode>(() => {
    const initialSessions = loadStoredSessions()
    const active = initialSessions.find((s) => s.id === (initialSessionId || initialSessions[0]?.id))
    return active?.mode || 'socratic'
  })

  const [isLoading, setIsLoading] = useState(false)

  const activeSession = sessions.find((s: TutorSession) => s.id === activeSessionId) || sessions[0]

  // Synchronize active session messages whenever activeSessionId changes
  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId)
    try {
      localStorage.setItem(TUTOR_ACTIVE_SESSION_KEY, sessionId)
    } catch {
      // ignore
    }

    setAllMessages((prevAll) => {
      const sessionMsgs = prevAll[sessionId] || []
      setMessages(sessionMsgs)
      return prevAll
    })

    setSessions((prevSessions) => {
      const sess = prevSessions.find((s: TutorSession) => s.id === sessionId)
      if (sess) {
        setSelectedLanguage(sess.language)
        setTutorMode(sess.mode)
      }
      return prevSessions
    })
  }, [])

  // Create a brand new chat session and persist it immediately
  const createNewSession = useCallback(() => {
    const newId = `session-${Date.now()}`
    const newSession: TutorSession = {
      id: newId,
      title: 'New Discussion',
      language: selectedLanguage,
      mode: tutorMode,
      messageCount: 0,
      lastMessagePreview: 'Ask a question to start learning...',
      createdAt: new Date().toISOString(),
    }

    setSessions((prev) => {
      const updated = [newSession, ...prev]
      saveStoredSessions(updated)
      return updated
    })

    setAllMessages((prev) => {
      const updated = { ...prev, [newId]: [] }
      saveStoredMessages(updated)
      return updated
    })

    setActiveSessionId(newId)
    setMessages([])

    try {
      localStorage.setItem(TUTOR_ACTIVE_SESSION_KEY, newId)
    } catch {
      // ignore
    }
  }, [selectedLanguage, tutorMode])

  // Send a message within the current session and persist conversation
  const sendMessage = useCallback(
    async (prompt: string) => {
      if (!prompt.trim() || isLoading) return

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sessionId: activeSessionId,
        role: 'user',
        content: prompt,
        createdAt: new Date().toISOString(),
      }

      // Optimistically update active messages
      const updatedWithUser = [...messages, userMsg]
      setMessages(updatedWithUser)

      // Update allMessages map
      setAllMessages((prev) => {
        const updated = { ...prev, [activeSessionId]: updatedWithUser }
        saveStoredMessages(updated)
        return updated
      })

      // Check if this is the first message to give session a smart title
      const isFirstMessage = messages.length === 0
      const smartTitle = isFirstMessage ? generateSmartTitle(prompt) : undefined

      // Update session preview & metadata
      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title: isFirstMessage && (s.title === 'New Discussion' || !s.title) ? smartTitle! : s.title,
              messageCount: s.messageCount + 1,
              lastMessagePreview: prompt.slice(0, 80),
              language: selectedLanguage,
              mode: tutorMode,
            }
          }
          return s
        })
        saveStoredSessions(updated)
        return updated
      })

      setIsLoading(true)

      try {
        const response = await aiService.generateTutorResponse({
          sessionId: activeSessionId,
          prompt,
          conversationHistory: updatedWithUser,
          mode: tutorMode,
          language: selectedLanguage,
        })

        const assistantMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          sessionId: activeSessionId,
          role: 'assistant',
          content: response.reply,
          codeBlocks: response.codeSnippets,
          suggestedFollowups: response.suggestedFollowups,
          inferenceTimeMs: response.inferenceTimeMs,
          tokensCount: response.tokensUsed,
          createdAt: new Date().toISOString(),
        }

        const updatedWithAssistant = [...updatedWithUser, assistantMsg]
        setMessages(updatedWithAssistant)

        setAllMessages((prev) => {
          const updated = { ...prev, [activeSessionId]: updatedWithAssistant }
          saveStoredMessages(updated)
          return updated
        })

        // Update session count
        setSessions((prev) => {
          const updated = prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messageCount: updatedWithAssistant.length,
                lastMessagePreview: response.reply.slice(0, 80),
              }
            }
            return s
          })
          saveStoredSessions(updated)
          return updated
        })
      } catch (err) {
        console.error('Error generating AI tutor response:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [activeSessionId, isLoading, messages, selectedLanguage, tutorMode]
  )

  // Delete a session and remove all its messages from localStorage
  const deleteSession = useCallback(
    (sessionIdToDelete: string) => {
      setAllMessages((prev) => {
        const next = { ...prev }
        delete next[sessionIdToDelete]
        saveStoredMessages(next)
        return next
      })

      setSessions((prev) => {
        const remaining = prev.filter((s) => s.id !== sessionIdToDelete)
        saveStoredSessions(remaining)

        if (remaining.length === 0) {
          const freshId = `session-${Date.now()}`
          const freshSession: TutorSession = {
            id: freshId,
            title: 'New Discussion',
            language: selectedLanguage,
            mode: tutorMode,
            messageCount: 0,
            lastMessagePreview: 'Ask a question to start learning...',
            createdAt: new Date().toISOString(),
          }
          saveStoredSessions([freshSession])
          setActiveSessionId(freshId)
          setMessages([])
          try {
            localStorage.setItem(TUTOR_ACTIVE_SESSION_KEY, freshId)
          } catch {
            // ignore
          }
          return [freshSession]
        }

        // If deleting active session, switch to the first remaining
        if (sessionIdToDelete === activeSessionId) {
          const nextSess = remaining[0]
          setActiveSessionId(nextSess.id)
          try {
            localStorage.setItem(TUTOR_ACTIVE_SESSION_KEY, nextSess.id)
          } catch {
            // ignore
          }
          const msgsMap = loadStoredMessages()
          setMessages(msgsMap[nextSess.id] || [])
          setSelectedLanguage(nextSess.language)
          setTutorMode(nextSess.mode)
        }
        return remaining
      })
    },
    [activeSessionId, selectedLanguage, tutorMode]
  )

  // Rename a session title
  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return
    setSessions((prev) => {
      const updated = prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle.trim() } : s))
      saveStoredSessions(updated)
      return updated
    })
  }, [])

  return {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    selectedLanguage,
    setSelectedLanguage,
    tutorMode,
    setTutorMode,
    isLoading,
    sendMessage,
    switchSession,
    createNewSession,
    deleteSession,
    renameSession,
  }
}

