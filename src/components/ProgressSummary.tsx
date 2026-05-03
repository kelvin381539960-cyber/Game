import type { ProgressState } from '../types/progress'
import { stories } from '../data/stories'

interface ProgressSummaryProps {
  progress: ProgressState
}

function ProgressSummary({ progress }: ProgressSummaryProps) {
  return (
    <section className="summary-grid" aria-label="学习进度">
      <div className="summary-card">
        <strong>{progress.totalStars}</strong>
        <span>总星星</span>
      </div>
      <div className="summary-card">
        <strong>{progress.streakDays}</strong>
        <span>连续天数</span>
      </div>
      <div className="summary-card">
        <strong>{progress.completedStoryIds.length}/{stories.length}</strong>
        <span>完成故事</span>
      </div>
    </section>
  )
}

export default ProgressSummary
