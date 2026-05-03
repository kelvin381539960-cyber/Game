import { getBadgeLabel } from '../utils/reward'

interface BadgeListProps {
  badges: string[]
  emptyText?: string
}

function BadgeList({ badges, emptyText = '还没有徽章，完成第一篇故事就能获得。' }: BadgeListProps) {
  if (badges.length === 0) {
    return <p className="muted-text">{emptyText}</p>
  }

  return (
    <div className="badge-list">
      {badges.map((badgeId) => (
        <span key={badgeId} className="badge-pill">
          🏅 {getBadgeLabel(badgeId)}
        </span>
      ))}
    </div>
  )
}

export default BadgeList
