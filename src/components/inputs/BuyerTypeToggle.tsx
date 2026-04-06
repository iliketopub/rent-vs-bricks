import type { BuyerType } from '../../types'

interface BuyerTypeToggleProps {
  value: BuyerType
  onChange: (v: BuyerType) => void
}

const options: { value: BuyerType; label: string }[] = [
  { value: 'ftb', label: 'First-Time Buyer' },
  { value: 'mover', label: 'Home Mover' },
  { value: 'additional', label: 'Additional Property' },
]

export function BuyerTypeToggle({ value, onChange }: BuyerTypeToggleProps) {
  return (
    <div className="mb-5">
      <p className="text-sm text-gray-700 font-medium mb-2">Buyer Type</p>
      <div className="flex rounded-lg overflow-hidden border border-gray-200">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`flex-1 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none focus:z-10 ${
              value === opt.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
