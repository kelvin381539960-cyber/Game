import { useMemo, useState } from 'react'
import { getNextUnfinishedStoryId, getStoryById, stories } from './data/stories'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ReaderPage from './pages/ReaderPage'
import ResultPage from './pages/ResultPage'
import StoryDetailPage from './pages/StoryDetailPage'
import StoryListPage from './pages/StoryListPage'
import type { ProgressState, ResultState } from './types/progress'
import { calculateStars } from './utils/reward'
import { completeStory, loadProgress } from './utils/progressStorage'

type ViewName = 'home' | 'story-list' | 'story-detail' | 'reader' | 'quiz' | 'result'

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('home')
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(stories[0]?.id ?? null)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [lastResult, setLastResult] = useState<ResultState | null>(null)

  const selectedStory = useMemo(() => getStoryById(selectedStoryId), [selectedStoryId])
  const recommendedStoryId = getNextUnfinishedStoryId(progress.completedStoryIds)
  const recommendedStory = getStoryById(recommendedStoryId) ?? stories[0]

  function openStoryDetail(storyId: string) {
    setSelectedStoryId(storyId)
    setCurrentPageIndex(0)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setCurrentView('story-detail')
  }

  function startReading() {
    setCurrentPageIndex(0)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setCurrentView('reader')
  }

  function selectAnswer(answer: string) {
    if (!selectedStory) return
    const question = selectedStory.questions[currentQuestionIndex]
    setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: answer }))
  }

  function finishQuiz() {
    if (!selectedStory) return

    const correctCount = selectedStory.questions.reduce((count, question) => {
      return answers[question.id] === question.answer ? count + 1 : count
    }, 0)

    const stars = calculateStars(correctCount)
    const baseResult: ResultState = {
      storyId: selectedStory.id,
      correctCount,
      totalQuestions: selectedStory.questions.length,
      stars,
      earnedBadges: [],
    }

    const { progress: nextProgress, earnedBadges } = completeStory(progress, baseResult)
    const result = { ...baseResult, earnedBadges }

    setProgress(nextProgress)
    setLastResult(result)
    setCurrentView('result')
  }

  function goNextStory() {
    const nextStoryId = getNextUnfinishedStoryId(progress.completedStoryIds)
    if (nextStoryId) {
      openStoryDetail(nextStoryId)
      return
    }
    setCurrentView('home')
  }

  if (!recommendedStory) {
    return <main className="app-shell"><p>暂无故事内容。</p></main>
  }

  return (
    <main className="app-shell">
      <div className="app-container">
        {currentView === 'home' ? (
          <HomePage
            progress={progress}
            recommendedStory={recommendedStory}
            onStart={openStoryDetail}
            onShowStories={() => setCurrentView('story-list')}
          />
        ) : null}

        {currentView === 'story-list' ? (
          <StoryListPage
            stories={stories}
            progress={progress}
            onSelectStory={openStoryDetail}
            onBack={() => setCurrentView('home')}
          />
        ) : null}

        {currentView === 'story-detail' && selectedStory ? (
          <StoryDetailPage
            story={selectedStory}
            completed={progress.completedStoryIds.includes(selectedStory.id)}
            stars={progress.storyStars[selectedStory.id] ?? 0}
            onStartReading={startReading}
            onBack={() => setCurrentView('story-list')}
          />
        ) : null}

        {currentView === 'reader' && selectedStory ? (
          <ReaderPage
            story={selectedStory}
            pageIndex={currentPageIndex}
            onPreviousPage={() => setCurrentPageIndex((page) => Math.max(0, page - 1))}
            onNextPage={() => setCurrentPageIndex((page) => Math.min(selectedStory.pages.length - 1, page + 1))}
            onGoQuiz={() => {
              setCurrentQuestionIndex(0)
              setCurrentView('quiz')
            }}
            onBack={() => setCurrentView('story-detail')}
          />
        ) : null}

        {currentView === 'quiz' && selectedStory ? (
          <QuizPage
            key={`${selectedStory.id}-${currentQuestionIndex}`}
            story={selectedStory}
            questionIndex={currentQuestionIndex}
            selectedAnswer={answers[selectedStory.questions[currentQuestionIndex].id] ?? null}
            onSelectAnswer={selectAnswer}
            onNextQuestion={() => setCurrentQuestionIndex((index) => index + 1)}
            onFinishQuiz={finishQuiz}
            onBack={() => setCurrentView('reader')}
          />
        ) : null}

        {currentView === 'result' && selectedStory && lastResult ? (
          <ResultPage
            story={selectedStory}
            result={lastResult}
            onHome={() => setCurrentView('home')}
            onNextStory={goNextStory}
          />
        ) : null}
      </div>
    </main>
  )
}

export default App
