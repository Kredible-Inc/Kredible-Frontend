export interface User {
  id?: string;
  walletAddress: string;
  email?: string;
  name?: string;
  createdAt?: string;
  creditScore?: number;
  userRole?: UserRole;
  lendingHistory?: LendingTransaction[];
  borrowingHistory?: BorrowingTransaction[];
  totalLent?: number;
  totalBorrowed?: number;
  reputation?: number;
  [key: string]: any;
}

export type UserRole = 'borrower' | 'lender' | 'both';

export interface CreditScore {
  score: number;
  maxScore: number;
  factors: CreditFactor[];
  lastUpdated: string;
}

export interface CreditFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  value: number;
}

export interface LendingTransaction {
  id: string;
  lenderAddress: string;
  borrowerAddress: string;
  borrowerName: string;
  amount: number;
  interestRate: number;
  term: number; // in days
  status: TransactionStatus;
  createdAt: string;
  dueDate: string;
  collateral?: string;
  ltvRatio?: number;
}

export interface BorrowingTransaction {
  id: string;
  lenderAddress: string;
  borrowerAddress: string;
  lenderName: string;
  amount: number;
  interestRate: number;
  term: number; // in days
  status: TransactionStatus;
  createdAt: string;
  dueDate: string;
  collateral?: string;
  ltvRatio?: number;
}

export type TransactionStatus = 'pending' | 'active' | 'completed' | 'defaulted' | 'cancelled';

export interface LoanRequest {
  id: string;
  borrowerAddress: string;
  borrowerName: string;
  amount: number;
  term: number; // in days
  purpose: string;
  creditScore: number;
  collateral?: string;
  ltvRatio?: number;
  createdAt: string;
  status: 'open' | 'matched' | 'cancelled';
}

export interface LendingOffer {
  id: string;
  lenderAddress: string;
  lenderName: string;
  maxAmount: number;
  minAmount: number;
  interestRate: number;
  maxTerm: number; // in days
  minCreditScore: number;
  createdAt: string;
  status: 'active' | 'inactive';
} 