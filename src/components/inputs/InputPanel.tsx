import { useState } from 'react'
import { SliderField } from './SliderField'
import { BuyerTypeToggle } from './BuyerTypeToggle'
import { Card } from '../ui/Card'
import type { CalculatorInputs } from '../../types'

interface InputPanelProps {
  inputs: CalculatorInputs
  setInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void
}

const num = (s: string) => parseFloat(s.replace(/[^0-9.-]/g, ''))

const fmtGBP = (v: number) => `£${Math.round(v).toLocaleString('en-GB')}`
const parseGBP = (s: string) => num(s)

const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`
const parsePct = (s: string) => num(s) / 100

const fmtYrs = (v: number) => `${v} yr${v !== 1 ? 's' : ''}`
const parseYrs = (s: string) => num(s)

const fmtMo = (v: number) => `£${Math.round(v).toLocaleString('en-GB')}/mo`
const parseMo = (s: string) => num(s)

const fmtYr = (v: number) => `£${Math.round(v).toLocaleString('en-GB')}/yr`
const parseYr = (s: string) => num(s)

function CollapsibleCard({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1 py-0.5"
      >
        <span>{title}</span>
        <span className="text-gray-400 text-lg">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </Card>
  )
}

export function InputPanel({ inputs, setInput }: InputPanelProps) {
  return (
    <div className="space-y-4">
      <CollapsibleCard title="You">
        <SliderField
          label="Monthly Take-Home Pay"
          value={inputs.monthlyTakeHome}
          min={1_000} max={20_000} step={50}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('monthlyTakeHome', v)}
        />
        <SliderField
          label="Cash Savings"
          value={inputs.initialSavings}
          min={0} max={1_000_000} step={1_000}
          format={fmtGBP}
          parse={parseGBP}
          onChange={v => setInput('initialSavings', v)}
        />
        <SliderField
          label="Savings Interest Rate"
          value={inputs.annualSavingsRate}
          min={0} max={0.08} step={0.0025}
          format={fmtPct}
          parse={parsePct}
          onChange={v => setInput('annualSavingsRate', v)}
        />
        <SliderField
          label="Investments (stocks / ISA)"
          value={inputs.initialInvestments}
          min={0} max={1_000_000} step={1_000}
          format={fmtGBP}
          parse={parseGBP}
          onChange={v => setInput('initialInvestments', v)}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Buy Scenario">
        <BuyerTypeToggle value={inputs.buyerType} onChange={v => setInput('buyerType', v)} />
        <SliderField
          label="Purchase Price"
          value={inputs.purchasePrice}
          min={50_000} max={1_500_000} step={1_000}
          format={fmtGBP}
          parse={parseGBP}
          onChange={v => setInput('purchasePrice', v)}
        />
        <SliderField
          label="Deposit"
          value={inputs.depositAmount}
          min={0} max={500_000} step={1_000}
          format={fmtGBP}
          parse={parseGBP}
          onChange={v => setInput('depositAmount', v)}
        />
        <SliderField
          label="Mortgage Interest Rate"
          value={inputs.mortgageRateAnnual}
          min={0.01} max={0.10} step={0.001}
          format={fmtPct}
          parse={parsePct}
          onChange={v => setInput('mortgageRateAnnual', v)}
        />
        <SliderField
          label="Mortgage Term"
          value={inputs.mortgageTermYears}
          min={5} max={40} step={1}
          format={fmtYrs}
          parse={parseYrs}
          onChange={v => setInput('mortgageTermYears', v)}
        />

        <p className="text-sm text-gray-600 font-medium mt-4 mb-3">Ongoing costs</p>
        <SliderField
          label="Service Charge"
          value={inputs.serviceChargePerYear}
          min={0} max={10_000} step={100}
          format={fmtYr}
          parse={parseYr}
          onChange={v => setInput('serviceChargePerYear', v)}
        />
        <SliderField
          label="Ground Rent"
          value={inputs.groundRentPerYear}
          min={0} max={2_000} step={50}
          format={fmtYr}
          parse={parseYr}
          onChange={v => setInput('groundRentPerYear', v)}
        />
        <SliderField
          label="Buildings Insurance"
          value={inputs.buildingsInsurancePerMonth}
          min={0} max={200} step={5}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('buildingsInsurancePerMonth', v)}
        />
        <SliderField
          label="Maintenance"
          value={inputs.maintenancePerMonth}
          min={0} max={500} step={25}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('maintenancePerMonth', v)}
        />

        <p className="text-sm text-gray-600 font-medium mt-4 mb-3">One-off fees</p>
        <SliderField
          label="Solicitor / Conveyancing"
          value={inputs.solicitorFees}
          min={500} max={5_000} step={100}
          format={fmtGBP}
          parse={parseGBP}
          onChange={v => setInput('solicitorFees', v)}
        />
        <SliderField
          label="Survey"
          value={inputs.surveyFee}
          min={0} max={2_000} step={50}
          format={fmtGBP}
          parse={parseGBP}
          onChange={v => setInput('surveyFee', v)}
        />
        <SliderField
          label="Mortgage Arrangement Fee"
          value={inputs.mortgageArrangementFee}
          min={0} max={3_000} step={100}
          format={fmtGBP}
          parse={parseGBP}
          onChange={v => setInput('mortgageArrangementFee', v)}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Rent Scenario">
        <SliderField
          label="Monthly Rent"
          value={inputs.monthlyRent}
          min={300} max={5_000} step={25}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('monthlyRent', v)}
        />
        <SliderField
          label="Contents Insurance"
          value={inputs.contentsInsurancePerMonth}
          min={0} max={100} step={5}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('contentsInsurancePerMonth', v)}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Assumptions">
        <SliderField
          label="Time Horizon"
          value={inputs.timeHorizonYears}
          min={1} max={30} step={1}
          format={fmtYrs}
          parse={parseYrs}
          onChange={v => setInput('timeHorizonYears', v)}
        />
        <SliderField
          label="Property Appreciation"
          value={inputs.annualAppreciation}
          min={-0.05} max={0.10} step={0.005}
          format={fmtPct}
          parse={parsePct}
          onChange={v => setInput('annualAppreciation', v)}
        />
        <SliderField
          label="Rent Inflation"
          value={inputs.annualRentInflation}
          min={0} max={0.10} step={0.005}
          format={fmtPct}
          parse={parsePct}
          onChange={v => setInput('annualRentInflation', v)}
        />
        <SliderField
          label="Investment Return"
          value={inputs.annualInvestmentReturn}
          min={0} max={0.15} step={0.005}
          format={fmtPct}
          parse={parsePct}
          onChange={v => setInput('annualInvestmentReturn', v)}
        />
      </CollapsibleCard>

      <CollapsibleCard title="Monthly Budget">
        <SliderField
          label="Council Tax"
          value={inputs.councilTaxPerMonth}
          min={50} max={500} step={10}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('councilTaxPerMonth', v)}
        />
        <SliderField
          label="Groceries"
          value={inputs.groceriesPerMonth}
          min={100} max={1_500} step={25}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('groceriesPerMonth', v)}
        />
        <SliderField
          label="Transport"
          value={inputs.transportPerMonth}
          min={0} max={600} step={10}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('transportPerMonth', v)}
        />
        <SliderField
          label="Utilities"
          value={inputs.utilitiesPerMonth}
          min={50} max={500} step={10}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('utilitiesPerMonth', v)}
        />
        <SliderField
          label="Other Expenses"
          value={inputs.otherExpensesPerMonth}
          min={0} max={5_000} step={50}
          format={fmtMo}
          parse={parseMo}
          onChange={v => setInput('otherExpensesPerMonth', v)}
        />
      </CollapsibleCard>
    </div>
  )
}
