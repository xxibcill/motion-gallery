export type FearGreedData = {
  asset: string
  score: number
  summary: string
  timestamp: string
  greed_post?: string | null
  fear_post?: string | null
}

export type LatestAssetDataResponse = {
  asset: string
  score: number
  summary: string
  created_at: string
  greed_post?: string | null
  fear_post?: string | null
}

export type GemResponse = {
  id: string
  sector: string
  ticker: string
  project_name: string
  sentiment: string
  summary: string
  created_at: string
  sources: unknown[]
}

export type Gem = {
  id: string
  sector: string
  ticker: string
  project_name: string
  sentiment: string
  summary: string
  created_at: string
  sources: unknown[]
}

export function transformFearGreedResponse(
  response: LatestAssetDataResponse
): FearGreedData {
  // Transform API response to app type (created_at -> timestamp)
  return {
    asset: response.asset,
    score: response.score,
    summary: response.summary,
    timestamp: response.created_at, // Map created_at to timestamp
    greed_post: response.greed_post,
    fear_post: response.fear_post,
  }
}

export function transformGemsResponse(response: GemResponse[]): Gem[] {
  // API response already matches app type structure
  return response.map((gem) => ({
    id: gem.id,
    sector: gem.sector.toLowerCase(),
    ticker: gem.ticker,
    project_name: gem.project_name,
    sentiment: gem.sentiment,
    summary: gem.summary,
    created_at: gem.created_at,
    sources: gem.sources,
  }))
}

export function transformGemResponse(response: GemResponse): Gem {
  // API response already matches app type structure
  return {
    id: response.id,
    sector: response.sector.toLowerCase(),
    ticker: response.ticker,
    project_name: response.project_name,
    sentiment: response.sentiment,
    summary: response.summary,
    created_at: response.created_at,
    sources: response.sources,
  }
}
