import React, { createContext, useContext, useState, useEffect } from 'react'

export interface UserProfile {
  fullName: string
  username: string
  email: string
  location: string
  bio: string
  avatarUrl: string | null
  dailyTargetMins: number
}

const STORAGE_KEY = 'codetutor_user_profile_v1'

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Kofi Mensah',
  username: 'kofimensah',
  email: 'kofi.mensah@techhub-accra.org',
  location: 'Tech Hub Accra, Ghana',
  bio: 'Independent Learner & Aspiring Systems Software Engineer',
  avatarUrl: null,
  dailyTargetMins: 45,
}

interface UserProfileContextType {
  profile: UserProfile
  updateProfile: (data: Partial<UserProfile>) => void
  uploadAvatar: (file: File) => Promise<string>
  removeAvatar: () => void
  resetProfile: () => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } catch (e) {
      console.warn('Failed to save profile to localStorage:', e)
    }
  }, [profile])

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }

  const uploadAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        if (result) {
          updateProfile({ avatarUrl: result })
          resolve(result)
        } else {
          reject(new Error('Failed to read image'))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
  }

  const removeAvatar = () => {
    updateProfile({ avatarUrl: null })
  }

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateProfile,
        uploadAvatar,
        removeAvatar,
        resetProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext)
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
