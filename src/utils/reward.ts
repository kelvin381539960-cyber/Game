import type { ProgressState } from '../types/progress'
import { stories } from '../data/stories'

export function calculateStars(correctCount: number): number {
  if (correctCount >= 3) return 3
  if (correctCount === 2) return 2
  return 1
}

export function getBadgeLabel(badgeId: string): string {
  const labels: Record<string, string> = {
    'reading-sprout': '阅读小苗',
    'star-collector': '星星收集员',
    'streak-reader': '坚持小达人',
    'story-explorer': '故事探险家',
  }

  return labels[badgeId] ?? badgeId
}

export function calculateBadges(progress: ProgressState): string[] {
  const badges = new Set(progress.badges)

  if (progress.completedStoryIds.length >= 1) {
    badges.add('reading-sprout')
  }

  if (progress.totalStars >= 10) {
    badges.add('star-collector')
  }

  if (progress.streakDays >= 3) {
    badges.add('streak-reader')
  }

  if (progress.completedStoryIds.length >= stories.length) {
    badges.add('story-explorer')
  }

  return Array.from(badges)
}

export function getNewBadges(previousBadges: string[], nextBadges: string[]): string[] {
  return nextBadges.filter((badgeId) => !previousBadges.includes(badgeId))
}
