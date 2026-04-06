import { useState, useMemo } from 'react'
import { DEFAULT_INPUTS } from '../lib/defaults'
import { deriveOutputs } from '../lib/calculator'
import type { CalculatorInputs, CalculatorOutputs } from '../types'

export function useCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS)

  const outputs = useMemo(() => deriveOutputs(inputs), [inputs])

  function setInput<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  function reset() {
    setInputs(DEFAULT_INPUTS)
  }

  return { inputs, outputs, setInput, reset }
}
