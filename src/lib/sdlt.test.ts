import { describe, it, expect } from 'vitest'
import { calcSDLT } from './sdlt'

describe('calcSDLT - home mover', () => {
  it('pays 0 under £125k', () => {
    expect(calcSDLT(100_000, 'mover')).toBe(0)
  })

  it('correct for £250k', () => {
    // 0% on £125k + 2% on £125k = £2,500
    expect(calcSDLT(250_000, 'mover')).toBe(2_500)
  })

  it('correct for £400k', () => {
    // 0% on £125k + 2% on £125k + 5% on £150k = 0 + 2500 + 7500 = £10,000
    expect(calcSDLT(400_000, 'mover')).toBe(10_000)
  })
})

describe('calcSDLT - first-time buyer', () => {
  it('pays 0 under £300k', () => {
    expect(calcSDLT(250_000, 'ftb')).toBe(0)
  })

  it('correct for £400k FTB', () => {
    // 0% on £300k + 5% on £100k = £5,000
    expect(calcSDLT(400_000, 'ftb')).toBe(5_000)
  })

  it('FTB over £500k uses standard rates', () => {
    // Standard: 0% on £125k + 2% on £125k + 5% on £275k = 0 + 2500 + 13750 = £16,250
    expect(calcSDLT(525_000, 'ftb')).toBe(16_250)
  })
})

describe('calcSDLT - additional property', () => {
  it('adds 5% surcharge on entire price', () => {
    // Standard for £400k = £10,000, plus 5% of £400k = £20,000 = £30,000
    expect(calcSDLT(400_000, 'additional')).toBe(30_000)
  })
})
