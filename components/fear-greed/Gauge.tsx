'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { getLevelFromScore, GAUGE_SEGMENTS } from '@/lib/utils/fearGreed'
import { formatLongDate } from '@/lib/utils/date'
import FGChip from './FGChip'

type Segment = {
  from: number
  to: number
  color: string
  label: string
}

const DEFAULT_SEGMENTS: Segment[] = GAUGE_SEGMENTS

type Props = {
  value: number // 0..100
  segments?: Segment[]
  className?: string
  lastUpdated: string
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function pointOnArc(radius: number, angle: number) {
  return {
    x: radius * Math.sin(angle),
    y: -radius * Math.cos(angle),
  }
}

function describeGaugeArc(radius: number, startAngle: number, endAngle: number) {
  const start = pointOnArc(radius, startAngle)
  const end = pointOnArc(radius, endAngle)
  const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}

export default function Gauge({
  value,
  segments = DEFAULT_SEGMENTS,
  className,
  lastUpdated,
}: Props) {
  const v = clamp(value, 0, 100)

  const formattedDate = lastUpdated ? formatLongDate(lastUpdated) : ''

  const startAngle = -Math.PI / 2
  const endAngle = Math.PI / 2

  const vbW = 420
  const vbH = 280
  const cx = vbW / 2
  const cy = 220

  const outerR = 200
  const innerR = 180
  const midR = (outerR + innerR) / 2

  const valueRange = endAngle - startAngle

  const { paths, marker } = useMemo(() => {
    const valueToAngle = (val: number) =>
      startAngle + (clamp(val, 0, 100) / 100) * valueRange

    const segmentPaths = segments.map((s, idx) => {
      const d = describeGaugeArc(midR, valueToAngle(s.from), valueToAngle(s.to))

      return { d, color: s.color, key: `${s.label}-${idx}` }
    })

    const a = valueToAngle(v)
    const mx = midR * Math.sin(a)
    const my = -midR * Math.cos(a)

    return {
      paths: segmentPaths,
      marker: { x: mx, y: my },
    }
  }, [midR, segments, startAngle, v, valueRange])

  return (
    <div className="w-full">
      <div
        className={[
          'relative mx-auto w-full aspect-[3/2] [container-type:inline-size]',
          'max-w-[280px] sm:max-w-[360px] md:max-w-[420px]',
          className ?? '',
        ].join(' ')}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${vbW} ${vbH}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Fear and Greed gauge"
        >
          <g transform={`translate(${cx},${cy})`}>
            {paths.map((path) => (
              <path
                key={path.key}
                d={path.d}
                fill="none"
                stroke={path.color}
                strokeWidth={outerR - innerR}
                strokeLinecap="butt"
              />
            ))}

            {/* Marker (black center + white ring) */}
            <circle
              cx={marker.x}
              cy={marker.y}
              r={16}
              fill="#0B0C0D"
              stroke="#F4F4F5"
              strokeWidth={2}
            />
            <circle cx={marker.x} cy={marker.y} r={10} fill="#121314" />
          </g>
        </svg>

        {/* Center value + pill */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-[14%]">
          <div className="tabular-nums text-[clamp(22px,10cqw,40px)] font-semibold tracking-tight text-neutral-200 leading-none">
            {v.toFixed(2)}
          </div>
        </div>

        {/* Bottom labels */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[4%] flex items-center gap-4 px-6">
          <div className="pointer-events-none flex-1 text-left text-[clamp(11px,4cqw,14px)] text-neutral-500">
            Fear
          </div>
          <FGChip level={getLevelFromScore(v)} className="shrink-0" />
          <div className="pointer-events-none flex-1 text-right text-[clamp(11px,4cqw,14px)] text-neutral-500">
            Greed
          </div>
        </div>
      </div>

      {/* Brand mark and last updated */}
      <div className="mt-6 flex items-center justify-between text-xs font-medium leading-5 text-neutral-500">
        <div className="flex items-center gap-2">
          <Image
            src="/static/membit-insight.svg"
            alt="Membit"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span>insight.membit.ai</span>
        </div>
        <div className="text-right flex flex-col lg:flex-row gap-1">
          <span>Last Updated: </span> <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}
