export type LeaderboardTimeframe = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type LeaderboardMetric = 'points' | 'streak' | 'problems'

export type LeagueTier = 'Grandmaster' | 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze'

export interface LeaderboardUser {
  id: string
  rank: number
  previousRank: number
  name: string
  username: string
  avatarUrl?: string
  countryCode: string
  countryName: string
  tier: LeagueTier
  dailyPoints: number
  weeklyPoints: number
  monthlyPoints: number
  yearlyPoints: number
  streakDays: number
  problemsSolved: number
  quizzesCompleted: number
  favoriteLanguage: 'python' | 'javascript' | 'java' | 'typescript'
  isCurrentUser?: boolean
}

export interface LeaderboardFilterState {
  timeframe: LeaderboardTimeframe
  metric: LeaderboardMetric
  searchQuery: string
  countryFilter: string
}
