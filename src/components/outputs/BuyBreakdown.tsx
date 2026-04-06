import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import type { MonthlyBuyCostBreakdown } from '../../types'

interface BuyBreakdownProps {
  breakdown: MonthlyBuyCostBreakdown
}

export function BuyBreakdown({ breakdown }: BuyBreakdownProps) {
  const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`

  const rows = [
    { label: 'Mortgage Repayment', value: breakdown.mortgage },
    { label: 'Service Charge', value: breakdown.serviceCharge },
    { label: 'Ground Rent', value: breakdown.groundRent },
    { label: 'Buildings Insurance', value: breakdown.buildingsInsurance },
    { label: 'Maintenance', value: breakdown.maintenance },
  ]

  return (
    <Card>
      <SectionHeading>Monthly Cost — Buying</SectionHeading>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(row => (
            <tr key={row.label} className="border-b border-gray-100 last:border-0">
              <td className="py-2 text-gray-600">{row.label}</td>
              <td className="py-2 text-right font-medium text-gray-900 tabular-nums">{fmt(row.value)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-gray-200 font-semibold">
            <td className="pt-3 text-gray-800">Total Monthly</td>
            <td className="pt-3 text-right text-blue-700 text-base tabular-nums">{fmt(breakdown.total)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  )
}
