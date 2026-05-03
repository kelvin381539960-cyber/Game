export interface ProgressState {
  completedStoryIds: string[]
  storyStars: Record<string, number>
  storyScores: Record<string, number>
  totalStars: number
  streakDays: number
  lastCompletedDate: string | null
  badges: string[]
}

export interface ResultState {
  storyId: string
  correctCount: number
  totalQuestions: number
  stars: number
  earnedBadges: string[]
}
