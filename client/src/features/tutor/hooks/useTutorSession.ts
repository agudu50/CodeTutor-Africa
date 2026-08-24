import { useState, useCallback } from 'react'
import { ChatMessage, ProgrammingLanguage, TutorMode, TutorSession } from '@/types'
import { aiService } from '@/services/ai/ai.service'
import { MOCK_TUTOR_SESSIONS, MOCK_INITIAL_MESSAGES } from '../data/mockTutorData'

export function useTutorSession(initialSessionId: string = 'session-1') {
  const [sessions, setSessions] = useState<TutorSession[]>(MOCK_TUTOR_SESSIONS)
  const [activeSessionId, setActiveSessionId] = useState<string>(initialSessionId)
  const [messages, setMessages] = useState<ChatMessage[]>(
    MOCK_INITIAL_MESSAGES[initialSessionId] || []
  )
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('python')
  const [tutorMode, setTutorMode] = useState<TutorMode>('socratic')
  const [isLoading, setIsLoading] = useState(false)

  const activeSession = sessions.find((s: TutorSession) => s.id === activeSessionId)

  const switchSession = useCallback((sessionId: string) => {
    setActiveSessionId(sessionId)
    setMessages(MOCK_INITIAL_MESSAGES[sessionId] || [])
    const sess = sessions.find((s: TutorSession) => s.id === sessionId)
    if (sess) {
      setSelectedLanguage(sess.language)
      setTutorMode(sess.mode)
    }
  }, [sessions])

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
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newId)
    setMessages([])
  }, [selectedLanguage, tutorMode])

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

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      try {
        const response = await aiService.generateTutorResponse({
          sessionId: activeSessionId,
          prompt,
          conversationHistory: [...messages, userMsg],
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

        setMessages((prev) => [...prev, assistantMsg])

        // Update session preview
        setSessions((prev) =>
          prev.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  messageCount: s.messageCount + 2,
                  lastMessagePreview: prompt.slice(0, 60),
                }
              : s
          )
        )
      } catch (err) {
        console.error('Error generating AI tutor response:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [activeSessionId, isLoading, messages, selectedLanguage, tutorMode]
  )

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
  }
}
