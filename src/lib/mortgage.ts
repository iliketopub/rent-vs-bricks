/**
 * Monthly mortgage payment using standard annuity formula.
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calcMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  if (principal <= 0) return 0
  const r = annualRate / 12
  const n = termYears * 12
  if (r === 0) return principal / n
  return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)
}

/**
 * Remaining mortgage balance after monthsPaid payments.
 * B(m) = P * [(1+r)^n - (1+r)^m] / [(1+r)^n - 1]
 */
export function calcRemainingBalance(
  principal: number,
  annualRate: number,
  termYears: number,
  monthsPaid: number,
): number {
  if (principal <= 0) return 0
  const r = annualRate / 12
  const n = termYears * 12
  if (r === 0) {
    return Math.max(0, principal - (principal / n) * monthsPaid)
  }
  const balance =
    (principal * (Math.pow(1 + r, n) - Math.pow(1 + r, monthsPaid))) /
    (Math.pow(1 + r, n) - 1)
  return Math.max(0, balance)
}
