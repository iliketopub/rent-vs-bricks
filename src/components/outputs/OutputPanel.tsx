import { SummaryCards } from './SummaryCards'
import { UpfrontCosts } from './UpfrontCosts'
import { BuyBreakdown } from './BuyBreakdown'
import { RentBreakdown } from './RentBreakdown'
import { WealthChart } from './WealthChart'
import { StressTest } from './StressTest'
import { Card } from '../ui/Card'
import type { CalculatorInputs, CalculatorOutputs } from '../../types'

interface OutputPanelProps {
  inputs: CalculatorInputs
  outputs: CalculatorOutputs
}

const fmt = (n: number) => `£${Math.round(Math.abs(n)).toLocaleString('en-GB')}`

export function OutputPanel({ inputs, outputs }: OutputPanelProps) {
  const { canAffordToBuy } = outputs

  return (
    <div className="space-y-4">
      <SummaryCards inputs={inputs} outputs={outputs} />

      {!canAffordToBuy && (
        <Card className="border-red-200 bg-red-50">
          <p className="text-sm font-semibold text-red-800">
            Cannot simulate buying — you need {fmt(Math.abs(outputs.savingsSurplusAfterPurchase))} more to cover the upfront costs (deposit + stamp duty + fees).
          </p>
          <p className="text-sm text-red-700 mt-1">
            Increase your savings/investments or reduce the deposit to see the buy scenario.
          </p>
        </Card>
      )}

      <UpfrontCosts breakdown={outputs.upfrontCosts} />

      {canAffordToBuy && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BuyBreakdown breakdown={outputs.monthlyBuyCost} />
          <RentBreakdown breakdown={outputs.monthlyRentCost} />
        </div>
      )}
      {!canAffordToBuy && (
        <RentBreakdown breakdown={outputs.monthlyRentCost} />
      )}

      <WealthChart data={outputs.wealthSeries} canAffordToBuy={canAffordToBuy} />

      {canAffordToBuy && (
        <StressTest inputs={inputs} outputs={outputs} />
      )}
    </div>
  )
}
