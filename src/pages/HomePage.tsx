import ProgressSummary from '../components/ProgressSummary'
import PrimaryButton from '../components/PrimaryButton'
import StoryCard from '../components/StoryCard'
import type { ProgressState } from '../types/progress'
import type { Story } from '../types/story'

interface HomePageProps {
  progress: ProgressState
  recommendedStory: Story
  onStart: (storyId: string) => void
  onShowStories: () => void
}

function HomePage({ progress, recommendedStory, onStart, onShowStories }: HomePageProps) {
  const completed = progress.completedStoryIds.includes(recommendedStory.id)
  const stars = progress.storyStars[recommendedStory.id] ?? 0

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <span className="hero-badge">今日阅读任务</span>
        <h1>今天也来读一个小故事吧！</h1>
        <p>每天 5–10 分钟，读故事、认字、做小题，收集星星。</p>
        <div className="button-row">
          <PrimaryButton onClick={() => onStart(recommendedStory.id)}>开始今日阅读</PrimaryButton>
          <PrimaryButton variant="secondary" onClick={onShowStories}>查看全部故事</PrimaryButton>
        </div>
      </section>

      <ProgressSummary progress={progress} />

      <section className="section-card">
        <div className="section-title-row">
          <div>
            <h2>今日推荐</h2>
            <p>先完成这一篇，再继续挑战其他故事。</p>
          </div>
        </div>
        <StoryCard story={recommendedStory} completed={completed} stars={stars} onSelect={onStart} />
      </section>
    </div>
  )
}

export default HomePage
