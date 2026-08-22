export interface LivePatchEntry {
  id: string
  ticketId?: string
  targetType: 'course_curriculum' | 'practice_problem' | 'test_suite' | 'general'
  targetTitle: string
  patchDetails: string
  author: 'Admin' | 'AI Assistant'
  createdAt: string
  isLive: boolean
}

const STORAGE_KEY = 'codetutor_live_patches'

const SEED_PATCHES: LivePatchEntry[] = [
  {
    id: 'patch-101',
    ticketId: 'iss-101',
    targetType: 'practice_problem',
    targetTitle: 'Palindrome Checker (Practice #rec-1)',
    patchDetails: 'Clarified in problem description that all whitespace and casing must be stripped before recursive testing.',
    author: 'AI Assistant',
    createdAt: '2026-02-21T18:45:00Z',
    isLive: true,
  },
  {
    id: 'patch-102',
    ticketId: 'iss-102',
    targetType: 'course_curriculum',
    targetTitle: 'Python Foundations - Memory Model (Lesson 1)',
    patchDetails: 'Added pre-video reading notes emphasizing pass-by-object-reference semantics on stack frames.',
    author: 'Admin',
    createdAt: '2026-02-21T17:30:00Z',
    isLive: true,
  },
  {
    id: 'patch-103',
    ticketId: 'iss-103',
    targetType: 'test_suite',
    targetTitle: 'EventEmitter Stream Teardown Hook',
    patchDetails: 'Patched stream listener unbind on modal unmount to avoid memory leak warnings during offline testing.',
    author: 'AI Assistant',
    createdAt: '2026-02-21T16:15:00Z',
    isLive: true,
  },
]

export class PatchLogService {
  getAllPatches(): LivePatchEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) return JSON.parse(data)
    } catch {
      // Fallback
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PATCHES))
    return SEED_PATCHES
  }

  createPatch(patch: Omit<LivePatchEntry, 'id' | 'createdAt' | 'isLive'>): LivePatchEntry {
    const list = this.getAllPatches()
    const newEntry: LivePatchEntry = {
      ...patch,
      id: `patch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isLive: true,
    }
    list.unshift(newEntry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return newEntry
  }

  deletePatch(id: string): void {
    const list = this.getAllPatches().filter((p) => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }
}

export const patchLogService = new PatchLogService()
