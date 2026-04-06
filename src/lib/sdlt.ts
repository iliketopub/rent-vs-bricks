import type { BuyerType } from '../types'

/**
 * UK Stamp Duty Land Tax (SDLT) calculator.
 * Post-April 2025 rules.
 */
export function calcSDLT(price: number, buyerType: BuyerType): number {
  if (buyerType === 'ftb' && price <= 500_000) {
    return calcFTBSdlt(price)
  }
  const standard = calcStandardSdlt(price)
  if (buyerType === 'additional') {
    return standard + price * 0.05
  }
  return standard
}

function calcStandardSdlt(price: number): number {
  const bands = [
    { limit: 125_000, rate: 0.00 },
    { limit: 250_000, rate: 0.02 },
    { limit: 925_000, rate: 0.05 },
    { limit: 1_500_000, rate: 0.10 },
    { limit: Infinity, rate: 0.12 },
  ]
  return calcBanded(price, bands)
}

function calcFTBSdlt(price: number): number {
  // FTB relief under £500k: 0% to £300k, 5% on £300k-£500k
  const bands = [
    { limit: 300_000, rate: 0.00 },
    { limit: 500_000, rate: 0.05 },
  ]
  return calcBanded(price, bands)
}

function calcBanded(
  price: number,
  bands: Array<{ limit: number; rate: number }>,
): number {
  let tax = 0
  let prev = 0
  for (const band of bands) {
    if (price <= prev) break
    const taxable = Math.min(price, band.limit) - prev
    tax += taxable * band.rate
    prev = band.limit
  }
  return tax
}
