"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User, LoanRequest, AvailableLoan, LenderOffer } from "../types/lending"

interface LendingContextType {
  user: User
  loanRequests: LoanRequest[]
  availableLoans: AvailableLoan[]
  lenderOffers: LenderOffer[]
  isLoading: boolean
  createLoanRequest: (amount: number, duration: number) => Promise<void>
  fundLoan: (loanId: string) => Promise<void>
  takeLoan: (loanId: string) => Promise<void>
  createLenderOffer: (offer: Omit<LenderOffer, "id" | "lender">) => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const LendingContext = createContext<LendingContextType | undefined>(undefined)

export function useLending() {
  const context = useContext(LendingContext)
  if (!context) {
    throw new Error("useLending must be used within a LendingProvider")
  }
  return context
}

interface LendingProviderProps {
  children: ReactNode
  initialUser: User
}

export function LendingProvider({ children, initialUser }: LendingProviderProps) {
  const [user, setUser] = useState<User>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  // Estados iniciales con datos simulados
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([
    {
      id: "1",
      borrower: "GAXB...K2M4",
      borrowerScore: 650,
      amountUSDC: 1000,
      collateralXLM: 11904.76,
      ltv: 70,
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
  ])

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
  ])

  const [lenderOffers, setLenderOffers] = useState<LenderOffer[]>([])

  const createLoanRequest = async (amount: number, duration: number) => {
    setIsLoading(true)
    try {
      // Simular delay de blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newRequest: LoanRequest = {
        id: Date.now().toString(),
        borrower: user.address,
        borrowerScore: user.creditScore,
        amountUSDC: amount,
        collateralXLM: amount / (user.ltv / 100) / 0.12, // Precio XLM simulado
        ltv: user.ltv,
        apr: user.apr,
        duration,
        status: "pending",
        createdAt: new Date(),
      }

      setLoanRequests((prev) => [newRequest, ...prev])

      // Actualizar estadísticas del usuario
      setUser((prev) => ({
        ...prev,
        activeLoans: prev.activeLoans + 1,
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const fundLoan = async (loanId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setLoanRequests((prev) =>
        prev.map((loan) => (loan.id === loanId ? { ...loan, status: "funded" as const } : loan)),
      )
    } finally {
      setIsLoading(false)
    }
  }

  const takeLoan = async (loanId: string) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setAvailableLoans((prev) =>
        prev.map((loan) => (loan.id === loanId ? { ...loan, status: "taken" as const } : loan)),
      )

      // Actualizar estadísticas del usuario
      setUser((prev) => ({
        ...prev,
        activeLoans: prev.activeLoans + 1,
        totalBorrowed: prev.totalBorrowed + (availableLoans.find((l) => l.id === loanId)?.amountUSDC || 0),
      }))
    } finally {
      setIsLoading(false)
    }
  }

  const createLenderOffer = async (offer: Omit<LenderOffer, "id" | "lender">) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newOffer: LenderOffer = {
        ...offer,
        id: Date.now().toString(),
        lender: user.address,
      }

      setLenderOffers((prev) => [newOffer, ...prev])

      // Agregar a préstamos disponibles
      const newAvailableLoan: AvailableLoan = {
        id: newOffer.id,
        lender: user.address,
        amountUSDC: offer.amountUSDC,
        apr: offer.interestRate,
        duration: offer.maxDuration,
        minCreditScore: offer.minCreditScore,
        maxLTV: 80, // Valor por defecto
        status: "available",
        createdAt: new Date(),
      }

      setAvailableLoans((prev) => [newAvailableLoan, ...prev])
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  return (
    <LendingContext.Provider
      value={{
        user,
        loanRequests,
        availableLoans,
        lenderOffers,
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
  )
}
