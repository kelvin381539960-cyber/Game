import Header from '../components/Header'
import PrimaryButton from '../components/PrimaryButton'
import type { Story } from '../types/story'

interface ReaderPageProps {
  story: Story
  pageIndex: number
  onPreviousPage: () => void
  onNextPage: () => void
  onGoQuiz: () => void
  onBack: () => void
}

function ReaderPage({ story, pageIndex, onPreviousPage, onNextPage, onGoQuiz, onBack }: ReaderPageProps) {
  const page = story.pages[pageIndex]
  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex === story.pages.length - 1

  return (
    <div className="page-stack">
      <Header title={story.title} subtitle={`第 ${pageIndex + 1}/${story.pages.length} 页`} onBack={onBack} />
      <section className="reader-card">
        <p className="reader-text">{page.text}</p>
        <div>
          <h3>这一页的重点字词</h3>
          <div className="keyword-row large">
            {page.keywords.map((keyword) => <span key={keyword} className="keyword-pill">{keyword}</span>)}
          </div>
        </div>
        <div className="reader-progress" aria-label="阅读进度">
          <span style={{ width: `${((pageIndex + 1) / story.pages.length) * 100}%` }} />
        </div>
        <div className="button-row spread">
          <PrimaryButton variant="secondary" onClick={onPreviousPage} disabled={isFirstPage}>上一页</PrimaryButton>
          {isLastPage ? (
            <PrimaryButton onClick={onGoQuiz}>去答题</PrimaryButton>
          ) : (
            <PrimaryButton onClick={onNextPage}>下一页</PrimaryButton>
          )}
        </div>
      </section>
    </div>
  )
}

export default ReaderPage
