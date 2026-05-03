import type { ProgressState, ResultState } from '../types/progress'
import { calculateBadges, getNewBadges } from './reward'

const STORAGE_KEY = 'child-reading-progress-v1'

export function getDefaultProgress(): ProgressState {
  return {
    completedStoryIds: [],
    storyStars: {},
    storyScores: {},
    totalStars: 0,
    streakDays: 0,
    lastCompletedDate: null,
    badges: [],
  }
}

function normalizeProgress(value: Partial<ProgressState>): ProgressState {
  return {
    completedStoryIds: Array.isArray(value.completedStoryIds) ? value.completedStoryIds : [],
    storyStars: value.storyStars && typeof value.storyStars === 'object' ? value.storyStars : {},
    storyScores: value.storyScores && typeof value.storyScores === 'object' ? value.storyScores : {},
    totalStars: typeof value.totalStars === 'number' ? value.totalStars : 0,
    streakDays: typeof value.streakDays === 'number' ? value.streakDays : 0,
    lastCompletedDate: typeof value.lastCompletedDate === 'string' ? value.lastCompletedDate : null,
    badges: Array.isArray(value.badges) ? value.badges : [],
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultProgress()

    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return normalizeProgress(parsed)
  } catch {
    return getDefaultProgress()
  }
}

export function saveProgress(progress: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage 不可用时忽略，保证页面仍可使用。
  }
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function getYesterdayString(): string {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date.toISOString().slice(0, 10)
}

function updateStreak(progress: ProgressState): number {
  const today = getTodayString()
  const yesterday = getYesterdayString()

  if (progress.lastCompletedDate === today) return progress.streakDays || 1
  if (progress.lastCompletedDate === yesterday) return (progress.streakDays || 0) + 1
  return 1
}

export function completeStory(progress: ProgressState, result: ResultState): { progress: ProgressState; earnedBadges: string[] } {
  const completedStoryIds = progress.completedStoryIds.includes(result.storyId)
    ? progress.completedStoryIds
    : [...progress.completedStoryIds, result.storyId]

  const previousStars = progress.storyStars[result.storyId] ?? 0
  const bestStars = Math.max(previousStars, result.stars)

  const storyStars = {
    ...progress.storyStars,
    [result.storyId]: bestStars,
  }

  const storyScores = {
    ...progress.storyScores,
    [result.storyId]: result.correctCount,
  }

  const totalStars = Object.values(storyStars).reduce((sum, stars) => sum + stars, 0)

  const nextProgressWithoutBadges: ProgressState = {
    completedStoryIds,
    storyStars,
    storyScores,
    totalStars,
    streakDays: updateStreak(progress),
    lastCompletedDate: getTodayString(),
    badges: progress.badges,
  }

  const badges = calculateBadges(nextProgressWithoutBadges)
  const earnedBadges = getNewBadges(progress.badges, badges)
  const nextProgress = { ...nextProgressWithoutBadges, badges }

  saveProgress(nextProgress)

  return { progress: nextProgress, earnedBadges }
}

export function resetProgress(): ProgressState {
  const progress = getDefaultProgress()
  saveProgress(progress)
  return progress
}
