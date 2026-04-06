import { describe, it, expect } from 'vitest'
import { calcMonthlyPayment, calcRemainingBalance } from './mortgage'

describe('calcMonthlyPayment', () => {
  it('calculates a standard repayment mortgage correctly', () => {
    // £320k loan, 4.5% annual rate, 25 year term
    const payment = calcMonthlyPayment(320_000, 0.045, 25)
    expect(payment).toBeCloseTo(1778.66, 0)
  })

  it('handles zero interest rate', () => {
    const payment = calcMonthlyPayment(120_000, 0, 10)
    expect(payment).toBeCloseTo(1000, 0)
  })

  it('returns 0 for zero principal', () => {
    expect(calcMonthlyPayment(0, 0.05, 25)).toBe(0)
  })
})

describe('calcRemainingBalance', () => {
  it('starts at the full principal at month 0', () => {
    const balance = calcRemainingBalance(320_000, 0.045, 25, 0)
    expect(balance).toBeCloseTo(320_000, 0)
  })

  it('reaches near zero at end of term', () => {
    const balance = calcRemainingBalance(320_000, 0.045, 25, 300)
    expect(balance).toBeCloseTo(0, 0)
  })

  it('is positive halfway through term', () => {
    const balance = calcRemainingBalance(320_000, 0.045, 25, 150)
    expect(balance).toBeGreaterThan(0)
    expect(balance).toBeLessThan(320_000)
  })
})
