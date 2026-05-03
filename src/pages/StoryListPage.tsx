import Header from '../components/Header'
import StoryCard from '../components/StoryCard'
import type { ProgressState } from '../types/progress'
import type { Story } from '../types/story'

interface StoryListPageProps {
  stories: Story[]
  progress: ProgressState
  onSelectStory: (storyId: string) => void
  onBack: () => void
}

function StoryListPage({ stories, progress, onSelectStory, onBack }: StoryListPageProps) {
  return (
    <div className="page-stack">
      <Header title="故事书架" subtitle="选择一个故事开始阅读吧。" onBack={onBack} />
      <section className="story-grid">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            completed={progress.completedStoryIds.includes(story.id)}
            stars={progress.storyStars[story.id] ?? 0}
            onSelect={onSelectStory}
          />
        ))}
      </section>
    </div>
  )
}

export default StoryListPage
