import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import { TrafficLight } from '../ui/TrafficLight'
import type { CalculatorInputs, CalculatorOutputs } from '../../types'

interface StressTestProps {
  inputs: CalculatorInputs
  outputs: CalculatorOutputs
}

const bandLabel = {
  green: 'Comfortable',
  amber: 'Tight',
  red: 'Stretched',
}

export function StressTest({ inputs, outputs }: StressTestProps) {
  const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`
  const { stressTest, monthlyBuyCost, monthlyRentCost } = outputs

  const livingRows = [
    { label: 'Council Tax', value: inputs.councilTaxPerMonth },
    { label: 'Groceries', value: inputs.groceriesPerMonth },
    { label: 'Transport', value: inputs.transportPerMonth },
    { label: 'Utilities', value: inputs.utilitiesPerMonth },
    ...(inputs.otherExpensesPerMonth > 0 ? [{ label: 'Other', value: inputs.otherExpensesPerMonth }] : []),
  ]

  return (
    <Card>
      <SectionHeading>Monthly Budget — Buy vs Rent</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

        {/* Buy column */}
        <div>
          <p className="font-semibold text-blue-700 mb-2 text-xs uppercase tracking-wider">If buying</p>
          <div className="space-y-0">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Take-home</span>
              <span className="font-medium tabular-nums">{fmt(inputs.monthlyTakeHome)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Mortgage</span>
              <span className="text-gray-700 tabular-nums">−{fmt(monthlyBuyCost.mortgage)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Service/ground</span>
              <span className="text-gray-700 tabular-nums">−{fmt(monthlyBuyCost.serviceCharge + monthlyBuyCost.groundRent)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Insurance/maint.</span>
              <span className="text-gray-700 tabular-nums">−{fmt(monthlyBuyCost.buildingsInsurance + monthlyBuyCost.maintenance)}</span>
            </div>
            {livingRows.map(row => (
              <div key={row.label} className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">{row.label}</span>
                <span className="text-gray-700 tabular-nums">−{fmt(row.value)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t-2 border-gray-200 font-semibold">
              <span>Buffer</span>
              <span className={`tabular-nums ${stressTest.buyBuffer < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stressTest.buyBuffer < 0 ? '−' : ''}{fmt(Math.abs(stressTest.buyBuffer))}
              </span>
            </div>
            <div className="pt-1">
              <TrafficLight band={stressTest.buyBand} label={bandLabel[stressTest.buyBand]} />
            </div>
          </div>
        </div>

        {/* Rent column */}
        <div>
          <p className="font-semibold text-green-700 mb-2 text-xs uppercase tracking-wider">If renting</p>
          <div className="space-y-0">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Take-home</span>
              <span className="font-medium tabular-nums">{fmt(inputs.monthlyTakeHome)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Rent (yr 1)</span>
              <span className="text-gray-700 tabular-nums">−{fmt(monthlyRentCost.rent)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">Contents ins.</span>
              <span className="text-gray-700 tabular-nums">−{fmt(monthlyRentCost.contentsInsurance)}</span>
            </div>
            {livingRows.map(row => (
              <div key={row.label} className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">{row.label}</span>
                <span className="text-gray-700 tabular-nums">−{fmt(row.value)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t-2 border-gray-200 font-semibold">
              <span>Buffer</span>
              <span className={`tabular-nums ${stressTest.rentBuffer < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stressTest.rentBuffer < 0 ? '−' : ''}{fmt(Math.abs(stressTest.rentBuffer))}
              </span>
            </div>
            <div className="pt-1">
              <TrafficLight band={stressTest.rentBand} label={bandLabel[stressTest.rentBand]} />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Monthly buffer is invested at your chosen investment return rate in the wealth chart above.
      </p>
    </Card>
  )
}
