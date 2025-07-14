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
import {
  Clock,
  Percent,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/shared/utils/credit";
import { useLending } from "@/shared/contexts/lending-context";

interface MyLoansTableProps {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export function MyLoansTable({ addToast }: MyLoansTableProps) {
  const { isLoading } = useLending();

  // Datos simulados simplificados
  const borrowedLoans = [
    {
      id: "ml1",
      lender: "Alice",
      amount: 1000,
      apr: 7.5,
      duration: 30,
      status: "active" as const,
      dueDate: "2024-02-15",
      collateral: 1500,
    },
  ];

  const lentLoans = [
    {
      id: "ml2",
      borrower: "Bob",
      amount: 500,
      apr: 8.0,
      duration: 60,
      status: "active" as const,
      dueDate: "2024-03-15",
      collateral: 800,
    },
  ];

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

  return (
    <div className="space-y-6">
      {/* Borrowed Loans */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">
              My Borrowed Loans
            </h3>
            <p className="text-sm text-gray-400">
              Loans you have taken from other users
            </p>
          </div>
        </div>

        {borrowedLoans.length === 0 ? (
          <div className="text-center py-8">
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
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowedLoans.map((loan) => (
                <TableRow key={loan.id} className="border-blue-500/30">
                  <TableCell className="font-mono text-sm text-gray-300">
                    {loan.lender}
                  </TableCell>
                  <TableCell className="font-semibold text-white">
                    {formatCurrency(loan.amount)}
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
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        loan.status === "active"
                          ? "text-emerald-400 border-emerald-500"
                          : "text-gray-400 border-gray-500"
                      }
                    >
                      {loan.status === "active" ? "Active" : "Completed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRepayLoan()}
                        disabled={isLoading}
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
                        disabled={isLoading}
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
            <h3 className="text-lg font-semibold text-white">My Lent Loans</h3>
            <p className="text-sm text-gray-400">
              Loans you have lent to other users
            </p>
          </div>
        </div>

        {lentLoans.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400">No has prestado dinero</div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-green-500/30">
                <TableHead className="text-gray-300">Borrower</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">APR</TableHead>
                <TableHead className="text-gray-300">Duration</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lentLoans.map((loan) => (
                <TableRow key={loan.id} className="border-green-500/30">
                  <TableCell className="font-mono text-sm text-gray-300">
                    {loan.borrower}
                  </TableCell>
                  <TableCell className="font-semibold text-white">
                    {formatCurrency(loan.amount)}
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
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        loan.status === "active"
                          ? "text-emerald-400 border-emerald-500"
                          : "text-gray-400 border-gray-500"
                      }
                    >
                      {loan.status === "active" ? "Active" : "Completed"}
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
