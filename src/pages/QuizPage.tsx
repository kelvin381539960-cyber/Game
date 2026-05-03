import { useState } from 'react'
import Header from '../components/Header'
import PrimaryButton from '../components/PrimaryButton'
import type { Story } from '../types/story'

interface QuizPageProps {
  story: Story
  questionIndex: number
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
  onNextQuestion: () => void
  onFinishQuiz: () => void
  onBack: () => void
}

function QuizPage({ story, questionIndex, selectedAnswer, onSelectAnswer, onNextQuestion, onFinishQuiz, onBack }: QuizPageProps) {
  const [submitted, setSubmitted] = useState(false)
  const question = story.questions[questionIndex]
  const isLastQuestion = questionIndex === story.questions.length - 1
  const isCorrect = selectedAnswer === question.answer

  function handleSubmit() {
    if (!selectedAnswer) return
    setSubmitted(true)
  }

  function handleNext() {
    setSubmitted(false)
    if (isLastQuestion) {
      onFinishQuiz()
      return
    }
    onNextQuestion()
  }

  return (
    <div className="page-stack">
      <Header title="读后小练习" subtitle={`第 ${questionIndex + 1}/${story.questions.length} 题`} onBack={onBack} />
      <section className="quiz-card">
        <span className="question-type">{question.type === 'word' ? '识字题' : question.type === 'judge' ? '判断题' : '阅读理解题'}</span>
        <h2>{question.prompt}</h2>
        <div className="option-list">
          {question.options.map((option) => {
            const active = selectedAnswer === option
            return (
              <button
                key={option}
                className={`option-button ${active ? 'active' : ''}`}
                onClick={() => !submitted && onSelectAnswer(option)}
                disabled={submitted}
              >
                {option}
              </button>
            )
          })}
        </div>

        {submitted ? (
          <div className={`feedback-box ${isCorrect ? 'correct' : 'wrong'}`}>
            <strong>{isCorrect ? '答对啦！' : '没关系，再看看线索。'}</strong>
            <p>{question.explanation}</p>
          </div>
        ) : null}

        <div className="button-row spread">
          <PrimaryButton variant="secondary" onClick={onBack}>返回阅读</PrimaryButton>
          {submitted ? (
            <PrimaryButton onClick={handleNext}>{isLastQuestion ? '看结果' : '下一题'}</PrimaryButton>
          ) : (
            <PrimaryButton onClick={handleSubmit} disabled={!selectedAnswer}>提交答案</PrimaryButton>
          )}
        </div>
      </section>
    </div>
  )
}

export default QuizPage
