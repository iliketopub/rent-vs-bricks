import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import type { UpfrontCostBreakdown } from '../../types'

interface UpfrontCostsProps {
  breakdown: UpfrontCostBreakdown
}

export function UpfrontCosts({ breakdown }: UpfrontCostsProps) {
  const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`

  const rows = [
    { label: 'Deposit', value: breakdown.deposit },
    { label: 'Stamp Duty (SDLT)', value: breakdown.stampDuty },
    { label: 'Solicitor / Conveyancing', value: breakdown.solicitorFees },
    { label: 'Survey', value: breakdown.surveyFee },
    { label: 'Mortgage Arrangement Fee', value: breakdown.mortgageArrangementFee },
  ]

  return (
    <Card>
      <SectionHeading>Upfront Costs</SectionHeading>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(row => (
            <tr key={row.label} className="border-b border-gray-100 last:border-0">
              <td className="py-2 text-gray-600">{row.label}</td>
              <td className="py-2 text-right font-medium text-gray-900 tabular-nums">{fmt(row.value)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-gray-200 font-semibold">
            <td className="pt-3 text-gray-800">Total Cash Required</td>
            <td className="pt-3 text-right text-blue-700 text-base tabular-nums">{fmt(breakdown.total)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}
