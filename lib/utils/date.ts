export type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'All'

export type ChartPoint = {
  time: Date
  value: number
}

export type HistoricalPoint = {
  created_at: string | number | Date
  score: number
}

/**
 * Get the current Unix timestamp in seconds
 * @returns Unix timestamp (seconds since epoch)
 */
export function getCurrentUnixTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}

export function timeRangeToDays(range: TimeRange): number {
  const ranges: Record<TimeRange, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '1Y': 365,
    All: 9999,
  }

  return ranges[range]
}

export function timeRangeToEpoch(range: TimeRange): {
  fromTimestamp: number
  toTimestamp: number
} {
  const now = getCurrentUnixTimestamp()

  const ranges: Record<TimeRange, number> = {
    '1D': 86400, // 24 hours
    '1W': 604800, // 7 days
    '1M': 2592000, // 30 days
    '1Y': 31536000, // 365 days
    All: 0, // Special case
  }

  const secondsAgo = ranges[range]

  return {
    fromTimestamp: range === 'All' ? 0 : now - secondsAgo,
    toTimestamp: now,
  }
}

export function transformHistoricalToChartPoints(data: HistoricalPoint[]): ChartPoint[] {
  return data.map((point) => ({
    time: new Date(point.created_at), // Parse ISO 8601 timestamp
    value: point.score,
  }))
}

export function isFresh(timestamp: string, maxAgeMinutes = 5): boolean {
  const dataTime = new Date(timestamp)
  const now = new Date()
  const ageMinutes = Math.floor((now.getTime() - dataTime.getTime()) / 60000)

  return ageMinutes < maxAgeMinutes
}

export function formatLongDate(value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
