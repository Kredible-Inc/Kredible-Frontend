export interface User {
  address: string;
  creditScore: number;
  ltv: number;
  apr: number;
  totalBorrowed: number;
  totalRepaid: number;
  activeLoans: number;
}

export interface LoanRequest {
  id: string;
  borrower: string;
  borrowerScore: number;
  amountUSDC: number;
  collateralXLM: number;
  ltv: number;
  apr: number;
  duration: number;
  interestRate?: number;
  status: "pending" | "funded" | "repaid" | "defaulted";
  createdAt: Date;
  fundedBy?: string;
  dueDate?: Date;
}

export interface LenderOffer {
  id: string;
  lender: string;
  amountUSDC: number;
  interestRate: number;
  maxDuration: number;
  minCreditScore: number;
}

export interface AvailableLoan {
  id: string;
  lender: string;
  amountUSDC: number;
  apr: number;
  duration: number;
  minCreditScore: number;
  maxLTV: number;
  status: "available" | "taken";
  createdAt: Date;
}

export interface MyLoan {
  id: string;
  type: "borrowed" | "lent";
  counterparty: string;
  amountUSDC: number;
  apr: number;
  duration: number;
  startDate: Date;
  dueDate: Date;
  status: "active" | "repaid" | "overdue" | "defaulted";
  collateralXLM?: number;
  interestEarned?: number;
  interestOwed?: number;
}

export type CreditTier = "low" | "medium" | "medium-high" | "high";
