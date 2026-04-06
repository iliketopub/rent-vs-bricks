import { useState, useId } from 'react'

interface SliderFieldProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  parse: (s: string) => number
  onChange: (v: number) => void
}

export function SliderField({ label, value, min, max, step, format, parse, onChange }: SliderFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const sliderId = useId()
  const textId = useId()

  function commit(raw: string) {
    const parsed = parse(raw)
    if (!isNaN(parsed)) {
      const snapped = Math.round((parsed - min) / step) * step + min
      onChange(Math.min(max, Math.max(min, snapped)))
    }
    setDraft(null)
  }

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1.5">
        <label htmlFor={sliderId} className="text-sm text-gray-800 font-medium">
          {label}
        </label>
        <input
          id={textId}
          type="text"
          inputMode="decimal"
          aria-label={`${label} value`}
          value={draft ?? format(value)}
          onFocus={e => {
            const stripped = e.target.value.replace(/[^0-9.-]/g, '')
            setDraft(stripped)
            e.target.select()
          }}
          onChange={e => setDraft(e.target.value)}
          onBlur={e => commit(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
          className="w-28 text-right text-sm font-semibold text-gray-900 tabular-nums bg-white border border-gray-300 rounded px-1.5 py-0.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
        />
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-3 accent-blue-600 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-lg"
      />
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}
