"use client";

import { formatCurrency } from "@/shared/utils/credit";
import { LoanRequest } from "@/shared/types/user.types";
import { LoanService } from "@/shared/services/loanService";
import { useEffect, useState } from "react";

interface AvailableLoansTableProps {
  addToast: (message: string, type: "success" | "error") => void;
}

export function AvailableLoansTable({ addToast }: AvailableLoansTableProps) {
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const fetchedLoans = await LoanService.getOpenLoanRequests();
        setLoans(fetchedLoans);
      } catch (_error) {
        console.error("Error fetching loans:", _error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleAcceptLoan = async (loan: LoanRequest) => {
    try {
      // Implement loan acceptance logic
      console.log("Accepting loan:", loan);
      addToast("Loan accepted successfully", "success");
    } catch (_error) {
      console.error("Error accepting loan:", _error);
      addToast("Error accepting loan", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Available Loans</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400">Loading loans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Available Loans</h3>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400">No loans available</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="bg-[#0B0A0B] border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{loan.borrowerName}</h4>
                  <p className="text-sm text-gray-400">
                    Amount: {formatCurrency(loan.amount)}
                  </p>
                  <p className="text-sm text-gray-400">
                    Duration: {loan.term} days
                  </p>
                  <p className="text-sm text-gray-400">
                    Purpose: {loan.purpose}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    Credit Score: {loan.creditScore}
                  </p>
                  <button
                    onClick={() => handleAcceptLoan(loan)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
