import { cn } from '@/lib/utils'
import { FearGreedLevel, getLevelLabel, getLevelColor } from '@/lib/utils/fearGreed'

type Props = {
  level: FearGreedLevel
  className?: string
}

export default function FGChip({ level, className }: Props) {
  const label = getLevelLabel(level)
  const color = getLevelColor(level)

  return (
    <div
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-2xl px-3 py-1 text-sm font-medium text-neutral-900 whitespace-nowrap',
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  )
}
