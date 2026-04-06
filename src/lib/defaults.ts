import type { CalculatorInputs } from '../types'

export const DEFAULT_INPUTS: CalculatorInputs = {
  // You
  monthlyTakeHome: 2_200,
  initialSavings: 0,
  annualSavingsRate: 0.04,
  initialInvestments: 0,

  // Buy scenario
  purchasePrice: 250_000,
  depositAmount: 0,
  mortgageRateAnnual: 0.05,
  mortgageTermYears: 35,
  buyerType: 'ftb',

  // Rent scenario
  monthlyRent: 900,
  contentsInsurancePerMonth: 10,

  // Assumptions
  timeHorizonYears: 10,
  annualAppreciation: 0.03,
  annualRentInflation: 0.03,
  annualInvestmentReturn: 0.07,

  // Buy — ongoing
  serviceChargePerYear: 1_200,
  groundRentPerYear: 0,
  buildingsInsurancePerMonth: 20,
  maintenancePerMonth: 75,

  // Buy — one-off
  solicitorFees: 1_500,
  surveyFee: 400,
  mortgageArrangementFee: 1_000,

  // Monthly budget
  councilTaxPerMonth: 120,
  groceriesPerMonth: 250,
  transportPerMonth: 100,
  utilitiesPerMonth: 100,
  otherExpensesPerMonth: 0,
}
