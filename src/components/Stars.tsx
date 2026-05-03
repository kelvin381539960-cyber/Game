interface StarsProps {
  count: number
  max?: number
}

function Stars({ count, max = 3 }: StarsProps) {
  return (
    <span className="stars" aria-label={`${count} 颗星`}>
      {Array.from({ length: max }).map((_, index) => (
        <span key={index} className={index < count ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  )
}

export default Stars
