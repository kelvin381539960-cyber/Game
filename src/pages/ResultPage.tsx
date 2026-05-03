import BadgeList from '../components/BadgeList'
import Header from '../components/Header'
import PrimaryButton from '../components/PrimaryButton'
import Stars from '../components/Stars'
import type { ResultState } from '../types/progress'
import type { Story } from '../types/story'

interface ResultPageProps {
  story: Story
  result: ResultState
  onHome: () => void
  onNextStory: () => void
}

function ResultPage({ story, result, onHome, onNextStory }: ResultPageProps) {
  return (
    <div className="page-stack">
      <Header title="太棒啦！" subtitle="你完成了今天的阅读任务。" />
      <section className="result-card">
        <div className="result-cover" aria-hidden="true">{story.coverEmoji}</div>
        <h2>你完成了《{story.title}》</h2>
        <Stars count={result.stars} />
        <p className="result-score">答对 {result.correctCount}/{result.totalQuestions} 题</p>
        <p className="encourage-text">继续保持，星星会越来越多！</p>
        <div className="section-card compact">
          <h3>新获得徽章</h3>
          <BadgeList badges={result.earnedBadges} emptyText="这次没有新徽章，但阅读记录已经保存啦。" />
        </div>
        <div className="button-row center">
          <PrimaryButton onClick={onHome}>返回首页</PrimaryButton>
          <PrimaryButton variant="secondary" onClick={onNextStory}>继续下一篇</PrimaryButton>
        </div>
      </section>
    </div>
  )
}

export default ResultPage
