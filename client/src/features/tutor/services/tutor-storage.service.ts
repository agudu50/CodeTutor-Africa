import { TutorSession } from '@/types'
import { MOCK_TUTOR_SESSIONS } from '../data/mockTutorData'

const TUTOR_SESSIONS_STORAGE_KEY = 'codetutor_tutor_sessions_v1'

export interface TutorSessionPreview {
  id: string
  title: string
  language: string
  lastUpdated: string
  messageCount: number
}

function formatRelativeTime(isoString?: string, fallback = 'Recently'): string {
  if (!isoString) return fallback
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffSec < 60) return 'Just now'
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`
    if (diffSec < 172800) return 'Yesterday'
    return `${Math.floor(diffSec / 86400)} days ago`
  } catch {
    return fallback
  }
}

export function getStoredTutorSessions(): TutorSessionPreview[] {
  try {
    const raw = localStorage.getItem(TUTOR_SESSIONS_STORAGE_KEY)
    let sessions: TutorSession[] = []
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        sessions = parsed
      }
    }
    if (sessions.length === 0) {
      sessions = MOCK_TUTOR_SESSIONS
    }

    return sessions.map((s, idx) => {
      const fallback = idx === 0 ? '2 hours ago' : idx === 1 ? 'Yesterday' : '3 days ago'
      return {
        id: s.id,
        title: s.title || 'AI Tutoring Dialogue',
        language: s.language || 'python',
        lastUpdated: s.createdAt ? formatRelativeTime(s.createdAt, fallback) : fallback,
        messageCount: s.messageCount ?? 0,
      }
    })
  } catch {
    return MOCK_TUTOR_SESSIONS.map((s, idx) => ({
      id: s.id,
      title: s.title,
      language: s.language,
      lastUpdated: idx === 0 ? '2 hours ago' : idx === 1 ? 'Yesterday' : '3 days ago',
      messageCount: s.messageCount ?? 0,
    }))
  }
}
