import { useCalculator } from './hooks/useCalculator'
import { InputPanel } from './components/inputs/InputPanel'
import { OutputPanel } from './components/outputs/OutputPanel'

const fmt = (n: number) => `£${Math.round(n).toLocaleString('en-GB')}`

export default function App() {
  const { inputs, outputs, setInput, reset } = useCalculator()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Buy vs Rent Calculator</h1>
            <p className="text-sm text-gray-600">UK property — compare buying and renting over time</p>
          </div>
          <button
            onClick={reset}
            className="text-sm text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-colors"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,400px),1fr] gap-6 items-start">
          <div className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto pr-1">
            <InputPanel inputs={inputs} setInput={setInput} />
          </div>
          <div id="results">
            <OutputPanel inputs={inputs} outputs={outputs} />
          </div>
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-10 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 truncate">
            Mortgage {fmt(outputs.monthlyBuyCost.mortgage)}/mo
            {' · '}
            {outputs.monthlyBuyCost.total - outputs.monthlyRentCost.total >= 0 ? 'Buy' : 'Rent'} costs{' '}
            {fmt(Math.abs(outputs.monthlyBuyCost.total - outputs.monthlyRentCost.total))}/mo more
          </p>
        </div>
        <a
          href="#results"
          className="shrink-0 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          Results ↓
        </a>
      </div>
    </div>
  )
}
