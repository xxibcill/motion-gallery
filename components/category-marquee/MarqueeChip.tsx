import type { LucideIcon } from 'lucide-react'

export interface Category {
  name: string
  color: string
  icon: LucideIcon
}

interface MarqueeChipProps {
  category: Category
}

export function MarqueeChip({ category }: MarqueeChipProps) {
  const Icon = category.icon
  return (
    <div className="flex items-center gap-2 bg-white rounded-full px-2 py-2.5 shrink-0">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: category.color }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
      </div>
      <span className="font-medium text-[#202327] text-lg whitespace-nowrap pr-2">
        {category.name}
      </span>
    </div>
  )
}
