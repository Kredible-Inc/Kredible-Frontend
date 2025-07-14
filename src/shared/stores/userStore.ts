"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  UserRole,
  CreditScore,
  LendingTransaction,
  BorrowingTransaction,
} from "@/shared/types/user.types";

interface UserState {
  // User profile
  user: User | null;
  currentRole: UserRole;

  // Credit score
  creditScore: CreditScore | null;

  // Transaction history
  lendingHistory: LendingTransaction[];
  borrowingHistory: BorrowingTransaction[];

  // Actions
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setCurrentRole: (role: UserRole) => void;
  setCreditScore: (creditScore: CreditScore) => void;
  addLendingTransaction: (transaction: LendingTransaction) => void;
  addBorrowingTransaction: (transaction: BorrowingTransaction) => void;
  updateTransactionStatus: (
    transactionId: string,
    status: "pending" | "active" | "completed" | "defaulted" | "cancelled",
    type: "lending" | "borrowing",
  ) => void;
  clearUserData: () => void;

  // Computed values
  getTotalLent: () => number;
  getTotalBorrowed: () => number;
  getActiveLoans: () => {
    lending: LendingTransaction[];
    borrowing: BorrowingTransaction[];
  };
  getReputation: () => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      currentRole: "borrower",
      creditScore: null,
      lendingHistory: [],
      borrowingHistory: [],

      // Actions
      setUser: (user: User) => {
        set({
          user,
          currentRole: user.userRole || "borrower",
          lendingHistory: user.lendingHistory || [],
          borrowingHistory: user.borrowingHistory || [],
        });
      },

      updateUser: (updates: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      setCurrentRole: (role: UserRole) => {
        set({ currentRole: role });
      },

      setCreditScore: (creditScore: CreditScore) => {
        set({ creditScore });
      },

      addLendingTransaction: (transaction: LendingTransaction) => {
        set((state) => ({
          lendingHistory: [...state.lendingHistory, transaction],
        }));
      },

      addBorrowingTransaction: (transaction: BorrowingTransaction) => {
        set((state) => ({
          borrowingHistory: [...state.borrowingHistory, transaction],
        }));
      },

      updateTransactionStatus: (
        transactionId: string,
        status: "pending" | "active" | "completed" | "defaulted" | "cancelled",
        type: "lending" | "borrowing",
      ) => {
        set((state) => {
          if (type === "lending") {
            return {
              lendingHistory: state.lendingHistory.map((t) =>
                t.id === transactionId ? { ...t, status } : t,
              ),
            };
          } else {
            return {
              borrowingHistory: state.borrowingHistory.map((t) =>
                t.id === transactionId ? { ...t, status } : t,
              ),
            };
          }
        });
      },

      clearUserData: () => {
        set({
          user: null,
          currentRole: "borrower",
          creditScore: null,
          lendingHistory: [],
          borrowingHistory: [],
        });
      },

      // Computed values
      getTotalLent: () => {
        const { lendingHistory } = get();
        return lendingHistory
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalBorrowed: () => {
        const { borrowingHistory } = get();
        return borrowingHistory
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getActiveLoans: () => {
        const { lendingHistory, borrowingHistory } = get();
        return {
          lending: lendingHistory.filter((t) => t.status === "active"),
          borrowing: borrowingHistory.filter((t) => t.status === "active"),
        };
      },

      getReputation: () => {
        const { lendingHistory, borrowingHistory } = get();
        const completedLending = lendingHistory.filter(
          (t) => t.status === "completed",
        ).length;
        const completedBorrowing = borrowingHistory.filter(
          (t) => t.status === "completed",
        ).length;
        const defaultedLending = lendingHistory.filter(
          (t) => t.status === "defaulted",
        ).length;
        const defaultedBorrowing = borrowingHistory.filter(
          (t) => t.status === "defaulted",
        ).length;

        // Simple reputation calculation
        const positiveScore = (completedLending + completedBorrowing) * 10;
        const negativeScore = (defaultedLending + defaultedBorrowing) * -50;

        return Math.max(0, positiveScore + negativeScore);
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        currentRole: state.currentRole,
        creditScore: state.creditScore,
        lendingHistory: state.lendingHistory,
        borrowingHistory: state.borrowingHistory,
      }),
    },
  ),
);
