import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import type { MonthlyRentCostBreakdown } from '../../types'

interface RentBreakdownProps {
  breakdown: MonthlyRentCostBreakdown
}

export function RentBreakdown({ breakdown }: RentBreakdownProps) {
  const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`

  return (
    <Card>
      <SectionHeading>Monthly Cost — Renting</SectionHeading>
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-gray-100">
            <td className="py-2 text-gray-600">Rent (year 1)</td>
            <td className="py-2 text-right font-medium text-gray-900 tabular-nums">{fmt(breakdown.rent)}</td>
          </tr>
          <tr className="border-b border-gray-100">
            <td className="py-2 text-gray-600">Contents Insurance</td>
            <td className="py-2 text-right font-medium text-gray-900 tabular-nums">{fmt(breakdown.contentsInsurance)}</td>
          </tr>
          <tr className="border-t-2 border-gray-200 font-semibold">
            <td className="pt-3 text-gray-800">Total Monthly</td>
            <td className="pt-3 text-right text-green-700 text-base tabular-nums">{fmt(breakdown.total)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}
