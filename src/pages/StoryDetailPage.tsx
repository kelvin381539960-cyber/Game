import Header from '../components/Header'
import PrimaryButton from '../components/PrimaryButton'
import Stars from '../components/Stars'
import type { Story } from '../types/story'

interface StoryDetailPageProps {
  story: Story
  completed: boolean
  stars: number
  onStartReading: () => void
  onBack: () => void
}

function StoryDetailPage({ story, completed, stars, onStartReading, onBack }: StoryDetailPageProps) {
  return (
    <div className="page-stack">
      <Header title={story.title} subtitle={`${story.theme} · ${story.level} · ${story.estimatedMinutes} 分钟`} onBack={onBack} />
      <section className="detail-card">
        <div className="detail-cover" aria-hidden="true">{story.coverEmoji}</div>
        <div className="detail-content">
          <p className="detail-summary">{story.summary}</p>
          <div className="info-grid">
            <div><strong>推荐年龄</strong><span>{story.ageRange}</span></div>
            <div><strong>题目数量</strong><span>{story.questions.length} 道</span></div>
            <div><strong>完成状态</strong><span>{completed ? '已完成' : '未完成'}</span></div>
          </div>
          <div>
            <h3>重点字词</h3>
            <div className="keyword-row large">
              {story.keywords.map((keyword) => <span key={keyword} className="keyword-pill">{keyword}</span>)}
            </div>
          </div>
          {completed ? <Stars count={stars} /> : null}
          <PrimaryButton onClick={onStartReading}>{completed ? '再读一次' : '开始阅读'}</PrimaryButton>
        </div>
      </section>
    </div>
  )
}

export default StoryDetailPage
