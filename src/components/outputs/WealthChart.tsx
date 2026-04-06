import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import type { WealthDataPoint } from '../../types'

interface WealthChartProps {
  data: WealthDataPoint[]
  canAffordToBuy: boolean
}

const fmtAxis = (v: number) =>
  v >= 1_000_000
    ? `£${(v / 1_000_000).toFixed(1)}m`
    : v >= 1_000
    ? `£${Math.round(v / 1_000)}k`
    : `£${v}`

const fmtTooltip = (v: number) => [`£${Math.round(v).toLocaleString('en-GB')}`, '']

function findBreakeven(data: WealthDataPoint[]): number | null {
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1]
    const curr = data[i]
    if (prev.buyWealth == null || curr.buyWealth == null) continue
    const prevDiff = prev.buyWealth - prev.rentWealth
    const currDiff = curr.buyWealth - curr.rentWealth
    if (prevDiff <= 0 && currDiff > 0) {
      // Linear interpolation for the crossover year
      const t = -prevDiff / (currDiff - prevDiff)
      return prev.year + t * (curr.year - prev.year)
    }
  }
  return null
}

function ChartContent({ data, height, showBuy }: { data: WealthDataPoint[]; height: number; showBuy: boolean }) {
  const breakeven = showBuy ? findBreakeven(data) : null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="year"
          tickFormatter={v => v === 0 ? 'Now' : `Yr ${v}`}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
        />
        <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 11, fill: '#9ca3af' }} width={64} />
        <Tooltip
          formatter={fmtTooltip}
          labelFormatter={l => l === 0 ? 'Now' : `Year ${l}`}
          contentStyle={{ fontSize: 13, borderRadius: 8, border: '1px solid #e5e7eb' }}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        {breakeven !== null && (
          <ReferenceLine
            x={Math.round(breakeven)}
            stroke="#6b7280"
            strokeDasharray="4 4"
            label={{ value: `Break-even ~yr ${breakeven.toFixed(1)}`, position: 'top', fontSize: 11, fill: '#6b7280' }}
          />
        )}
        {showBuy && (
          <Line
            type="monotone"
            dataKey="buyWealth"
            name="Buy"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        )}
        <Line
          type="monotone"
          dataKey="rentWealth"
          name="Rent"
          stroke="#16a34a"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function WealthChart({ data, canAffordToBuy }: WealthChartProps) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded])

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionHeading>Net Worth Over Time</SectionHeading>
          <button
            onClick={() => setExpanded(true)}
            aria-label="Expand chart"
            className="text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors shrink-0"
          >
            Expand
          </button>
        </div>
        <ChartContent data={data} height={280} showBuy={canAffordToBuy} />
      </Card>

      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:p-8"
          onClick={e => { if (e.target === e.currentTarget) setExpanded(false) }}
        >
          <div role="dialog" aria-label="Net Worth Over Time — expanded" className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Net Worth Over Time</h2>
              <button
                onClick={() => setExpanded(false)}
                aria-label="Close expanded chart"
                className="text-gray-600 hover:text-gray-900 text-2xl leading-none px-2 focus:ring-2 focus:ring-blue-400 focus:outline-none rounded"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 min-h-0 px-2 sm:px-6 pb-4 sm:pb-6">
              <ChartContent data={data} height={400} showBuy={canAffordToBuy} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
