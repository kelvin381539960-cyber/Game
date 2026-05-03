import PrimaryButton from './PrimaryButton'

interface HeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
}

function Header({ title, subtitle, onBack }: HeaderProps) {
  return (
    <header className="page-header">
      {onBack ? (
        <PrimaryButton variant="ghost" onClick={onBack}>
          ← 返回
        </PrimaryButton>
      ) : null}
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </header>
  )
}

export default Header
