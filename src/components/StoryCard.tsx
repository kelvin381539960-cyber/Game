import type { Story } from '../types/story'
import Stars from './Stars'

interface StoryCardProps {
  story: Story
  stars: number
  completed: boolean
  onSelect: (storyId: string) => void
}

function StoryCard({ story, stars, completed, onSelect }: StoryCardProps) {
  return (
    <button className="story-card" onClick={() => onSelect(story.id)}>
      <span className="story-cover" aria-hidden="true">{story.coverEmoji}</span>
      <div className="story-card-body">
        <div className="story-card-title-row">
          <h3>{story.title}</h3>
          <span className="level-pill">{story.level}</span>
        </div>
        <p>{story.summary}</p>
        <div className="keyword-row">
          {story.keywords.map((keyword) => (
            <span key={keyword} className="keyword-pill">{keyword}</span>
          ))}
        </div>
        <div className="story-meta">
          <span>{story.theme}</span>
          <span>{story.estimatedMinutes} 分钟</span>
          <span>{completed ? '已完成' : '未完成'}</span>
        </div>
        {completed ? <Stars count={stars} /> : null}
      </div>
    </button>
  )
}

export default StoryCard
