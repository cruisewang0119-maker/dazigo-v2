'use client'

import {
  TASTE_DIMENSIONS,
  type TasteRadarData,
  getTasteValues,
} from '@/lib/taste-profile'

const CHART_COLOR = '#FF6B6B'
const SIZE = 280
const CX = SIZE / 2
const CY = SIZE / 2
const MAX_R = 88
const LABEL_R = 112

function polarToXY(angleIndex: number, radius: number) {
  const angleDeg = angleIndex * 60 - 90
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function polygonPoints(values: number[], radiusScale: number) {
  return values
    .map((value, i) => {
      const r = (value / 100) * MAX_R * radiusScale
      const { x, y } = polarToXY(i, r)
      return `${x},${y}`
    })
    .join(' ')
}

interface TasteRadarChartProps {
  data: TasteRadarData
}

export default function TasteRadarChart({ data }: TasteRadarChartProps) {
  const values = getTasteValues(data)
  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <div className="w-full flex justify-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[300px] h-auto"
        role="img"
        aria-label="Taste profile radar chart"
      >
        {/* 网格六边形 */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(values.map(() => 100), level)}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1}
            className="text-foreground"
          />
        ))}

        {/* 轴线 */}
        {TASTE_DIMENSIONS.map((_, i) => {
          const { x, y } = polarToXY(i, MAX_R)
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={1}
              className="text-foreground"
            />
          )
        })}

        {/* 数据区域填充 */}
        <polygon
          points={polygonPoints(values, 1)}
          fill={CHART_COLOR}
          fillOpacity={0.3}
          stroke={CHART_COLOR}
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* 数据顶点 */}
        {values.map((value, i) => {
          const { x, y } = polarToXY(i, (value / 100) * MAX_R)
          return <circle key={i} cx={x} cy={y} r={3.5} fill={CHART_COLOR} />
        })}

        {/* 维度标签 */}
        {TASTE_DIMENSIONS.map((dim, i) => {
          const { x, y } = polarToXY(i, LABEL_R)
          const anchor =
            i === 0 ? 'middle' : i === 1 || i === 2 ? 'start' : i === 4 || i === 5 ? 'end' : 'middle'
          const dy = i === 0 ? -6 : i === 3 ? 14 : 4
          return (
            <text
              key={dim.key}
              x={x}
              y={y + dy}
              textAnchor={anchor}
              className="fill-muted-foreground text-[10px]"
              style={{ fontSize: '10px' }}
            >
              {dim.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
