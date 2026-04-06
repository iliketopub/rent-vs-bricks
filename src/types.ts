export type BuyerType = 'ftb' | 'mover' | 'additional'

export interface CalculatorInputs {
  // Property & mortgage
  purchasePrice: number
  depositAmount: number
  mortgageRateAnnual: number   // as decimal, e.g. 0.045
  mortgageTermYears: number

  // Rental comparison
  monthlyRent: number

  // Growth rates (as decimals)
  annualAppreciation: number
  annualRentInflation: number
  annualInvestmentReturn: number

  // Time
  timeHorizonYears: number

  // Buyer classification
  buyerType: BuyerType

  // Monthly ongoing costs – buying
  serviceChargePerYear: number
  groundRentPerYear: number
  buildingsInsurancePerMonth: number
  maintenancePerMonth: number

  // Monthly ongoing costs – renting
  contentsInsurancePerMonth: number

  // One-off buying costs
  solicitorFees: number
  surveyFee: number
  mortgageArrangementFee: number

  // Savings / wealth
  initialSavings: number        // cash savings — grows at annualSavingsRate
  initialInvestments: number    // stocks/ISA/portfolio — grows at annualInvestmentReturn
  annualSavingsRate: number     // as decimal, e.g. 0.04

  // Income / stress test
  monthlyTakeHome: number
  councilTaxPerMonth: number
  groceriesPerMonth: number
  transportPerMonth: number
  utilitiesPerMonth: number
  otherExpensesPerMonth: number
}

export interface UpfrontCostBreakdown {
  deposit: number
  stampDuty: number
  solicitorFees: number
  surveyFee: number
  mortgageArrangementFee: number
  total: number
}

export interface MonthlyBuyCostBreakdown {
  mortgage: number
  serviceCharge: number
  groundRent: number
  buildingsInsurance: number
  maintenance: number
  total: number
}

export interface MonthlyRentCostBreakdown {
  rent: number
  contentsInsurance: number
  total: number
}

export interface StressTestResult {
  livingCosts: number
  buyHousingCosts: number
  rentHousingCosts: number
  buyBuffer: number
  rentBuffer: number
  buyBand: 'green' | 'amber' | 'red'
  rentBand: 'green' | 'amber' | 'red'
}

export interface WealthDataPoint {
  year: number
  buyWealth?: number
  rentWealth: number
}

export interface CalculatorOutputs {
  canAffordToBuy: boolean
  loanAmount: number
  ltv: number
  savingsSurplusAfterPurchase: number
  upfrontCosts: UpfrontCostBreakdown
  monthlyBuyCost: MonthlyBuyCostBreakdown
  monthlyRentCost: MonthlyRentCostBreakdown
  stressTest: StressTestResult
  wealthSeries: WealthDataPoint[]
}
