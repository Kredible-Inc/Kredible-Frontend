"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Percent, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/shared/utils/credit";
import { useLending } from "@/shared/contexts/lending-context";

interface MyLoansTableProps {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export function MyLoansTable({ addToast }: MyLoansTableProps) {
  const { lendingHistory, isLoading } = useLending();

  const borrowedLoans = lendingHistory.filter(loan => loan.type === "borrowed");
  const lentLoans = lendingHistory.filter(loan => loan.type === "lent");

  const handleRepayLoan = async () => {
    try {
      addToast("Loan paid successfully", "success");
    } catch {
      addToast("Error paying loan", "error");
    }
  };

  const handleExtendLoan = async () => {
    try {
      addToast("Loan extended successfully", "success");
    } catch {
      addToast("Error extending loan", "error");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Borrowed Loans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-blue-400" />
              My Borrowed Loans
            </h3>
            <p className="text-sm text-gray-400">
              Loans you have taken from other users
            </p>
          </div>
        </div>

        {borrowedLoans.length === 0 ? (
          <div className="text-center py-8">
            <TrendingDown className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400">
              You don&apos;t have any borrowed loans
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-blue-500/30">
                <TableHead className="text-gray-300">Lender</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">APR</TableHead>
                <TableHead className="text-gray-300">Duration</TableHead>
                <TableHead className="text-gray-300">Due Date</TableHead>
                <TableHead className="text-gray-300">Interest Owed</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowedLoans.map((loan) => (
                <TableRow key={loan.id} className="border-blue-500/30">
                  <TableCell className="font-mono text-sm text-gray-300">
                    {loan.counterparty}
                  </TableCell>
                  <TableCell className="font-semibold text-white">
                    {formatCurrency(loan.amountUSDC)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">
                        {formatPercentage(loan.apr)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-300">
                        {loan.duration} days
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(loan.dueDate)}
                  </TableCell>
                  <TableCell className="text-red-400 font-semibold">
                    {formatCurrency(loan.interestOwed || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        loan.status === "active"
                          ? "text-emerald-400 border-emerald-500"
                          : loan.status === "overdue"
                          ? "text-red-400 border-red-500"
                          : "text-gray-400 border-gray-500"
                      }
                    >
                      {loan.status === "active" ? "Active" : 
                       loan.status === "overdue" ? "Overdue" : 
                       loan.status === "repaid" ? "Repaid" : "Defaulted"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRepayLoan()}
                        disabled={isLoading || loan.status !== "active"}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Pay"
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleExtendLoan()}
                        disabled={isLoading || loan.status !== "active"}
                        variant="outline"
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                      >
                        Extend
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Lent Loans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              My Lent Loans
            </h3>
            <p className="text-sm text-gray-400">
              Loans you have lent to other users
            </p>
          </div>
        </div>

        {lentLoans.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <div className="text-gray-400">You haven&apos;t lent any money yet</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-green-500/30">
                <TableHead className="text-gray-300">Borrower</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">APR</TableHead>
                <TableHead className="text-gray-300">Duration</TableHead>
                <TableHead className="text-gray-300">Due Date</TableHead>
                <TableHead className="text-gray-300">Interest Earned</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lentLoans.map((loan) => (
                <TableRow key={loan.id} className="border-green-500/30">
                  <TableCell className="font-mono text-sm text-gray-300">
                    {loan.counterparty}
                  </TableCell>
                  <TableCell className="font-semibold text-white">
                    {formatCurrency(loan.amountUSDC)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">
                        {formatPercentage(loan.apr)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-300">
                        {loan.duration} days
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {formatDate(loan.dueDate)}
                  </TableCell>
                  <TableCell className="text-emerald-400 font-semibold">
                    {formatCurrency(loan.interestEarned || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        loan.status === "active"
                          ? "text-emerald-400 border-emerald-500"
                          : loan.status === "overdue"
                          ? "text-red-400 border-red-500"
                          : "text-gray-400 border-gray-500"
                      }
                    >
                      {loan.status === "active" ? "Active" : 
                       loan.status === "overdue" ? "Overdue" : 
                       loan.status === "repaid" ? "Repaid" : "Defaulted"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-400 hover:bg-green-500/20"
                      disabled={isLoading}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
