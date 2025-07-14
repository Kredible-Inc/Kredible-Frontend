"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  User,
  LoanRequest,
  AvailableLoan,
  LenderOffer,
  MyLoan,
} from "../types/lending";

interface LendingContextType {
  user: User;
  loanRequests: LoanRequest[];
  availableLoans: AvailableLoan[];
  lenderOffers: LenderOffer[];
  lendingHistory: MyLoan[];
  isLoading: boolean;
  createLoanRequest: (amount: number, duration: number) => Promise<void>;
  fundLoan: (loanId: string) => Promise<void>;
  takeLoan: (loanId: string) => Promise<void>;
  createLenderOffer: (
    offer: Omit<LenderOffer, "id" | "lender">,
  ) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const LendingContext = createContext<LendingContextType | undefined>(undefined);

export function useLending() {
  const context = useContext(LendingContext);
  if (!context) {
    throw new Error("useLending must be used within a LendingProvider");
  }
  return context;
}

interface LendingProviderProps {
  children: ReactNode;
  initialUser: User;
}

export function LendingProvider({
  children,
  initialUser,
}: LendingProviderProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // Initial states with simulated data
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([
    {
      id: "1",
      borrower: "GAXB...K2M4",
      borrowerScore: 650,
      amountUSDC: 500,
      collateralXLM: 1501.25, // $750 worth of XLM at $0.12 per XLM
      ltv: 75,
      apr: 7.0,
      duration: 30,
      status: "pending",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      borrower: "GCXD...L5N8",
      borrowerScore: 520,
      amountUSDC: 500,
      collateralXLM: 6944.44,
      ltv: 60,
      apr: 8.0,
      duration: 15,
      status: "pending",
      createdAt: new Date("2024-01-14"),
    },
  ]);

  const [availableLoans, setAvailableLoans] = useState<AvailableLoan[]>([
    {
      id: "1",
      lender: "GAXB...K2M4",
      amountUSDC: 5000,
      apr: 6.5,
      duration: 30,
      minCreditScore: 600,
      maxLTV: 70,
      status: "available",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      lender: "GCXD...L5N8",
      amountUSDC: 2500,
      apr: 7.2,
      duration: 15,
      minCreditScore: 500,
      maxLTV: 60,
      status: "available",
      createdAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      lender: "GBYZ...M9P2",
      amountUSDC: 10000,
      apr: 5.8,
      duration: 60,
      minCreditScore: 700,
      maxLTV: 80,
      status: "available",
      createdAt: new Date("2024-01-13"),
    },
    {
      id: "4",
      lender: "GDFE...N3Q7",
      amountUSDC: 1500,
      apr: 8.5,
      duration: 7,
      minCreditScore: 450,
      maxLTV: 50,
      status: "available",
      createdAt: new Date("2024-01-12"),
    },
    {
      id: "5",
      lender: "GHIJ...O1R4",
      amountUSDC: 7500,
      apr: 6.0,
      duration: 45,
      minCreditScore: 650,
      maxLTV: 75,
      status: "available",
      createdAt: new Date("2024-01-11"),
    },
    {
      id: "6",
      lender: "GKLM...P8S9",
      amountUSDC: 3000,
      apr: 7.8,
      duration: 20,
      minCreditScore: 550,
      maxLTV: 65,
      status: "available",
      createdAt: new Date("2024-01-10"),
    },
  ]);

  const [lenderOffers, setLenderOffers] = useState<LenderOffer[]>([]);
  const [lendingHistory, setLendingHistory] = useState<MyLoan[]>([]);

  const createLoanRequest = async (amount: number, duration: number) => {
    setIsLoading(true);
    try {
      // Simulate blockchain delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newRequest: LoanRequest = {
        id: Date.now().toString(),
        borrower: user.address,
        borrowerScore: user.creditScore,
        amountUSDC: amount,
        collateralXLM: amount / (user.ltv / 100) / 0.12, // Simulated XLM price
        ltv: user.ltv,
        apr: user.apr,
        duration,
        status: "pending",
        createdAt: new Date(),
      };

      setLoanRequests((prev) => [newRequest, ...prev]);

      // Update user statistics
      setUser((prev) => ({
        ...prev,
        activeLoans: prev.activeLoans + 1,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const fundLoan = async (loanId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Find the loan request
      const loanRequest = loanRequests.find(loan => loan.id === loanId);
      if (!loanRequest) {
        throw new Error("Loan request not found");
      }

      // Update loan request status
      setLoanRequests((prev) =>
        prev.map((loan) =>
          loan.id === loanId ? { ...loan, status: "funded" as const } : loan,
        ),
      );

      // Create a new lending transaction
      const newLendingTransaction: MyLoan = {
        id: `lend_${Date.now()}`,
        type: "lent",
        counterparty: loanRequest.borrower,
        amountUSDC: loanRequest.amountUSDC,
        apr: loanRequest.apr,
        duration: loanRequest.duration,
        startDate: new Date(),
        dueDate: new Date(Date.now() + loanRequest.duration * 24 * 60 * 60 * 1000),
        status: "active",
        collateralXLM: loanRequest.collateralXLM,
        interestEarned: (loanRequest.amountUSDC * loanRequest.apr / 100) * (loanRequest.duration / 365),
        interestOwed: 0,
      };

      // Add to lending history
      setLendingHistory((prev) => [newLendingTransaction, ...prev]);

      // Update user statistics
      setUser((prev) => ({
        ...prev,
        totalLent: (prev.totalLent || 0) + loanRequest.amountUSDC,
        activeLoans: (prev.activeLoans || 0) + 1,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const takeLoan = async (loanId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const loan = availableLoans.find(l => l.id === loanId);
      if (!loan) {
        throw new Error("Available loan not found");
      }

      setAvailableLoans((prev) =>
        prev.map((l) =>
          l.id === loanId ? { ...l, status: "taken" as const } : l,
        ),
      );

      // Create a new borrowing transaction
      const newBorrowingTransaction: MyLoan = {
        id: `borrow_${Date.now()}`,
        type: "borrowed",
        counterparty: loan.lender,
        amountUSDC: loan.amountUSDC,
        apr: loan.apr,
        duration: loan.duration,
        startDate: new Date(),
        dueDate: new Date(Date.now() + loan.duration * 24 * 60 * 60 * 1000),
        status: "active",
        interestEarned: 0,
        interestOwed: (loan.amountUSDC * loan.apr / 100) * (loan.duration / 365),
      };

      // Add to lending history (for borrowed loans too)
      setLendingHistory((prev) => [newBorrowingTransaction, ...prev]);

      // Update user statistics
      setUser((prev) => ({
        ...prev,
        activeLoans: prev.activeLoans + 1,
        totalBorrowed:
          prev.totalBorrowed +
          (availableLoans.find((l) => l.id === loanId)?.amountUSDC || 0),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const createLenderOffer = async (
    offer: Omit<LenderOffer, "id" | "lender">,
  ) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newOffer: LenderOffer = {
        ...offer,
        id: Date.now().toString(),
        lender: user.address,
      };

      setLenderOffers((prev) => [newOffer, ...prev]);

      // Add to available loans
      const newAvailableLoan: AvailableLoan = {
        id: newOffer.id,
        lender: user.address,
        amountUSDC: offer.amountUSDC,
        apr: offer.interestRate,
        duration: offer.maxDuration,
        minCreditScore: offer.minCreditScore,
        maxLTV: 80, // Default value
        status: "available",
        createdAt: new Date(),
      };

      setAvailableLoans((prev) => [newAvailableLoan, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <LendingContext.Provider
      value={{
        user,
        loanRequests,
        availableLoans,
        lenderOffers,
        lendingHistory,
        isLoading,
        createLoanRequest,
        fundLoan,
        takeLoan,
        createLenderOffer,
        updateUser,
      }}
    >
      {children}
    </LendingContext.Provider>
  );
}
