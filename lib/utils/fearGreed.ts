import { formatLongDate } from '@/lib/utils/date'

export enum GemStatus {
  Bearish = 'Bearish',
  Cautious = 'Cautious',
  Neutral = 'Neutral',
  Optimistic = 'Optimistic',
  Bullish = 'Bullish',
}

export type CryptoType = string

function formatDistanceToNow(timestamp: Date): string {
  const elapsedMs = Math.max(Date.now() - timestamp.getTime(), 0)
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (elapsedMs < hour) {
    const minutes = Math.max(1, Math.round(elapsedMs / minute))
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  if (elapsedMs < day) {
    const hours = Math.round(elapsedMs / hour)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = Math.round(elapsedMs / day)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

/**
 * Fear & Greed Level Enum
 * Single source of truth for all Fear & Greed levels
 */
export enum FearGreedLevel {
  ExtremeFear = 'ExtremeFear',
  Fear = 'Fear',
  Neutral = 'Neutral',
  Greed = 'Greed',
  ExtremeGreed = 'ExtremeGreed',
}

/**
 * Fear & Greed Color Constants
 * Single source of truth for all Fear & Greed colors
 */
export const FEAR_GREED_COLORS = {
  ExtremeFear: '#EA3943',
  Fear: '#EA8D00',
  Neutral: '#F3D42F',
  Greed: '#94D903',
  ExtremeGreed: '#19C785',
} as const

/**
 * Gauge segments for the Fear & Greed gauge visualization
 * Uses thresholds: 0-20, 20-40, 40-60, 60-80, 80-100
 */
export const GAUGE_SEGMENTS = [
  { from: 0, to: 20, color: FEAR_GREED_COLORS.ExtremeFear, label: 'Extreme Fear' },
  { from: 20, to: 40, color: FEAR_GREED_COLORS.Fear, label: 'Fear' },
  { from: 40, to: 60, color: FEAR_GREED_COLORS.Neutral, label: 'Neutral' },
  { from: 60, to: 80, color: FEAR_GREED_COLORS.Greed, label: 'Greed' },
  { from: 80, to: 100, color: FEAR_GREED_COLORS.ExtremeGreed, label: 'Extreme Greed' },
]

/**
 * Convert a Fear & Greed score (0-100) to a GemStatus
 */
export function getStatusFromScore(score: number): GemStatus {
  if (score < 20) return GemStatus.Bearish
  if (score < 40) return GemStatus.Cautious
  if (score < 60) return GemStatus.Neutral
  if (score < 80) return GemStatus.Optimistic
  return GemStatus.Bullish
}

/**
 * Format a timestamp into a relative time string with absolute date
 * @example "2 hours ago • December 17, 2025"
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const timeAgo = formatDistanceToNow(date)
  const dateStr = formatLongDate(date)
  return `${timeAgo} • ${dateStr}`
}

/**
 * Get the path to a coin icon, with fallback handling
 */
export function getCoinIconPath(crypto: CryptoType): string {
  const iconName = String(crypto).trim().toLowerCase() || 'crypto'
  return `/icons/coins/${iconName}.png`
}

/**
 * Get a fallback icon path when the main icon fails to load
 */
export function getFallbackIconPath(): string {
  return '/icons/coins/crypto.png'
}

/**
 * Get the label for a Fear & Greed level enum
 */
export function getLevelLabel(level: FearGreedLevel): string {
  switch (level) {
    case FearGreedLevel.ExtremeFear:
      return 'Extreme Fear'
    case FearGreedLevel.Fear:
      return 'Fear'
    case FearGreedLevel.Neutral:
      return 'Neutral'
    case FearGreedLevel.Greed:
      return 'Greed'
    case FearGreedLevel.ExtremeGreed:
      return 'Extreme Greed'
    default:
      return 'Neutral'
  }
}

/**
 * Get the color for a Fear & Greed level enum
 */
export function getLevelColor(level: FearGreedLevel): string {
  return FEAR_GREED_COLORS[level]
}

/**
 * Get the Fear & Greed level enum from a score
 */
export function getLevelFromScore(score: number): FearGreedLevel {
  if (score <= 20) return FearGreedLevel.ExtremeFear
  if (score <= 40) return FearGreedLevel.Fear
  if (score <= 60) return FearGreedLevel.Neutral
  if (score <= 80) return FearGreedLevel.Greed
  return FearGreedLevel.ExtremeGreed
}

/**
 * Get the label for a Fear & Greed score
 */
export function getScoreLabel(score: number): string {
  return getLevelLabel(getLevelFromScore(score))
}

/**
 * Get the color for a Fear & Greed score
 */
export function getScoreColor(score: number): string {
  return getLevelColor(getLevelFromScore(score))
}
