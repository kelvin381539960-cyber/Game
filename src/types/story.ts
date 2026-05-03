export type StoryLevel = 'L1' | 'L2' | 'L3'

export type QuestionType = 'word' | 'comprehension' | 'judge'

export interface StoryPage {
  id: string
  text: string
  keywords: string[]
}

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  options: string[]
  answer: string
  explanation: string
}

export interface Story {
  id: string
  title: string
  level: StoryLevel
  ageRange: string
  theme: string
  summary: string
  coverEmoji: string
  estimatedMinutes: number
  keywords: string[]
  pages: StoryPage[]
  questions: Question[]
}
