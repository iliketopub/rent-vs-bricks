import { calcMonthlyPayment, calcRemainingBalance } from './mortgage'
import { calcSDLT } from './sdlt'
import type {
  CalculatorInputs,
  CalculatorOutputs,
  MonthlyBuyCostBreakdown,
  MonthlyRentCostBreakdown,
  UpfrontCostBreakdown,
  WealthDataPoint,
} from '../types'

export function calcUpfrontCosts(inputs: CalculatorInputs): UpfrontCostBreakdown {
  const { purchasePrice, depositAmount, buyerType, solicitorFees, surveyFee, mortgageArrangementFee } = inputs
  const stampDuty = calcSDLT(purchasePrice, buyerType)
  return {
    deposit: depositAmount,
    stampDuty,
    solicitorFees,
    surveyFee,
    mortgageArrangementFee,
    total: depositAmount + stampDuty + solicitorFees + surveyFee + mortgageArrangementFee,
  }
}

export function calcMonthlyBuyCost(inputs: CalculatorInputs): MonthlyBuyCostBreakdown {
  const {
    purchasePrice,
    depositAmount,
    mortgageRateAnnual,
    mortgageTermYears,
    serviceChargePerYear,
    groundRentPerYear,
    buildingsInsurancePerMonth,
    maintenancePerMonth,
  } = inputs
  const principal = purchasePrice - depositAmount
  const mortgage = calcMonthlyPayment(principal, mortgageRateAnnual, mortgageTermYears)
  const serviceCharge = serviceChargePerYear / 12
  const groundRent = groundRentPerYear / 12
  return {
    mortgage,
    serviceCharge,
    groundRent,
    buildingsInsurance: buildingsInsurancePerMonth,
    maintenance: maintenancePerMonth,
    total: mortgage + serviceCharge + groundRent + buildingsInsurancePerMonth + maintenancePerMonth,
  }
}

export function calcMonthlyRentCostAtYear(
  inputs: CalculatorInputs,
  year: number,
): MonthlyRentCostBreakdown {
  const rent = inputs.monthlyRent * Math.pow(1 + inputs.annualRentInflation, year)
  return {
    rent,
    contentsInsurance: inputs.contentsInsurancePerMonth,
    total: rent + inputs.contentsInsurancePerMonth,
  }
}

function band(buffer: number): 'green' | 'amber' | 'red' {
  return buffer > 500 ? 'green' : buffer >= 200 ? 'amber' : 'red'
}

export function buildWealthSeries(
  inputs: CalculatorInputs,
  upfrontTotal: number,
  monthlyBuyCostTotal: number,
  canAffordToBuy: boolean,
): WealthDataPoint[] {
  const {
    purchasePrice,
    depositAmount,
    mortgageRateAnnual,
    mortgageTermYears,
    annualAppreciation,
    annualInvestmentReturn,
    annualSavingsRate,
    annualRentInflation,
    monthlyRent,
    contentsInsurancePerMonth,
    initialSavings,
    initialInvestments,
    monthlyTakeHome,
    councilTaxPerMonth,
    groceriesPerMonth,
    transportPerMonth,
    utilitiesPerMonth,
    otherExpensesPerMonth,
    timeHorizonYears,
  } = inputs

  const principal = purchasePrice - depositAmount
  const monthlySavingsRate = Math.pow(1 + annualSavingsRate, 1 / 12) - 1
  const monthlyInvestRate = Math.pow(1 + annualInvestmentReturn, 1 / 12) - 1
  const livingCosts = councilTaxPerMonth + groceriesPerMonth + transportPerMonth + utilitiesPerMonth + otherExpensesPerMonth

  // Buy scenario: draw from savings first, then investments, to cover upfront costs
  const savingsDrawn = Math.min(initialSavings, upfrontTotal)
  const investmentsDrawn = Math.max(0, upfrontTotal - initialSavings)
  const buySavingsStart = initialSavings - savingsDrawn
  const buyInvestmentsStart = Math.max(0, initialInvestments - investmentsDrawn)
  const buyMonthlyBuffer = monthlyTakeHome - monthlyBuyCostTotal - livingCosts

  // Rent scenario: both pots untouched, monthly buffer added to investments
  const rentSavingsStart = initialSavings
  const rentInvestmentsStart = initialInvestments

  // Year 0
  const rentWealth0 = rentSavingsStart + rentInvestmentsStart
  const series: WealthDataPoint[] = [
    {
      year: 0,
      buyWealth: canAffordToBuy ? (purchasePrice - principal) + buySavingsStart + buyInvestmentsStart : undefined,
      rentWealth: rentWealth0,
    },
  ]

  let buySavings = buySavingsStart
  let buyInvestments = buyInvestmentsStart
  let rentSavings = rentSavingsStart
  let rentInvestments = rentInvestmentsStart
  const totalMonths = timeHorizonYears * 12

  for (let m = 1; m <= totalMonths; m++) {
    const year = Math.floor((m - 1) / 12)

    // Buy side (only if affordable)
    let buyWealth: number | undefined
    if (canAffordToBuy) {
      const propertyValue = purchasePrice * Math.pow(1 + annualAppreciation, m / 12)
      const remaining = calcRemainingBalance(principal, mortgageRateAnnual, mortgageTermYears, m)
      const propertyEquity = propertyValue - remaining
      buySavings = buySavings * (1 + monthlySavingsRate)
      buyInvestments = Math.max(0, buyInvestments * (1 + monthlyInvestRate) + buyMonthlyBuffer)
      buyWealth = propertyEquity + buySavings + buyInvestments
    }

    // Rent side: savings grow at savings rate, investments grow at investment rate + monthly buffer
    const currentRent = monthlyRent * Math.pow(1 + annualRentInflation, year)
    const rentMonthlyCost = currentRent + contentsInsurancePerMonth
    const rentMonthlyBuffer = monthlyTakeHome - rentMonthlyCost - livingCosts
    rentSavings = rentSavings * (1 + monthlySavingsRate)
    rentInvestments = Math.max(0, rentInvestments * (1 + monthlyInvestRate) + rentMonthlyBuffer)

    if (m % 12 === 0) {
      series.push({ year: m / 12, buyWealth, rentWealth: rentSavings + rentInvestments })
    }
  }

  return series
}

export function deriveOutputs(rawInputs: CalculatorInputs): CalculatorOutputs {
  // Clamp deposit so it never exceeds purchase price
  const inputs = {
    ...rawInputs,
    depositAmount: Math.min(rawInputs.depositAmount, rawInputs.purchasePrice),
  }
  const loanAmount = inputs.purchasePrice - inputs.depositAmount
  const ltv = inputs.purchasePrice > 0 ? (loanAmount / inputs.purchasePrice) * 100 : 0

  const upfrontCosts = calcUpfrontCosts(inputs)
  const savingsSurplusAfterPurchase =
    inputs.initialSavings + inputs.initialInvestments - upfrontCosts.total

  const monthlyBuyCost = calcMonthlyBuyCost(inputs)
  const monthlyRentCost = calcMonthlyRentCostAtYear(inputs, 0)

  const livingCosts =
    inputs.councilTaxPerMonth +
    inputs.groceriesPerMonth +
    inputs.transportPerMonth +
    inputs.utilitiesPerMonth +
    inputs.otherExpensesPerMonth

  const buyBuffer = inputs.monthlyTakeHome - monthlyBuyCost.total - livingCosts
  const rentBuffer = inputs.monthlyTakeHome - monthlyRentCost.total - livingCosts

  const canAffordToBuy = savingsSurplusAfterPurchase >= 0
  const wealthSeries = buildWealthSeries(inputs, upfrontCosts.total, monthlyBuyCost.total, canAffordToBuy)

  return {
    canAffordToBuy,
    loanAmount,
    ltv,
    savingsSurplusAfterPurchase,
    upfrontCosts,
    monthlyBuyCost,
    monthlyRentCost,
    stressTest: {
      livingCosts,
      buyHousingCosts: monthlyBuyCost.total,
      rentHousingCosts: monthlyRentCost.total,
      buyBuffer,
      rentBuffer,
      buyBand: band(buyBuffer),
      rentBand: band(rentBuffer),
    },
    wealthSeries,
  }
}
