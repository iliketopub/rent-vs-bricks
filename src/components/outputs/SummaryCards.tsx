import type { CalculatorInputs, CalculatorOutputs } from '../../types'

interface SummaryCardsProps {
  inputs: CalculatorInputs
  outputs: CalculatorOutputs
}

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}

function MetricCard({ label, value, sub, highlight }: MetricCardProps) {
  return (
    <div className={`rounded-xl border p-3 sm:p-4 ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
      <p className="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
      {sub && <p className="text-xs sm:text-sm text-gray-600 mt-1">{sub}</p>}
    </div>
  )
}

export function SummaryCards({ inputs, outputs }: SummaryCardsProps) {
  const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`
  const { ltv, savingsSurplusAfterPurchase, upfrontCosts, monthlyBuyCost, monthlyRentCost } = outputs
  const monthlyDiff = monthlyBuyCost.total - monthlyRentCost.total
  const canAfford = savingsSurplusAfterPurchase >= 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
      <MetricCard label="LTV" value={`${ltv.toFixed(1)}%`} sub={`${fmt(inputs.depositAmount)} deposit`} />
      <MetricCard
        label="After-purchase savings"
        value={canAfford ? fmt(savingsSurplusAfterPurchase) : `−${fmt(Math.abs(savingsSurplusAfterPurchase))}`}
        sub={canAfford ? 'available to invest' : 'shortfall — increase savings'}
        highlight={!canAfford}
      />
      <MetricCard label="Stamp Duty" value={fmt(upfrontCosts.stampDuty)} />
      <MetricCard label="Total Upfront" value={fmt(upfrontCosts.total)} highlight={canAfford} />
      <MetricCard label="Monthly Mortgage" value={fmt(monthlyBuyCost.mortgage)} />
      <MetricCard
        label="Buy vs Rent (monthly)"
        value={`${monthlyDiff >= 0 ? '+' : ''}${fmt(monthlyDiff)}`}
        sub={monthlyDiff >= 0 ? 'buying costs more' : 'renting costs more'}
      />
    </div>
  )
}
