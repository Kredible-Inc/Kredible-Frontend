"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, TrendingUp, User, DollarSign, Loader2, CheckCircle } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/shared/utils/credit";
import { useLending } from "@/shared/contexts/lending-context";
import { AvailableLoan } from "@/shared/types/lending";

interface AvailableLoansTableProps {
  addToast: (message: string, type: "success" | "error") => void;
}

export function AvailableLoansTable({ addToast }: AvailableLoansTableProps) {
  const { availableLoans, takeLoan, isLoading, user } = useLending();
  const [processingLoan, setProcessingLoan] = useState<string | null>(null);

  const handleTakeLoan = async (loan: AvailableLoan) => {
    if (user.creditScore < loan.minCreditScore) {
      addToast(`Your credit score (${user.creditScore}) is below the minimum required (${loan.minCreditScore})`, "error");
      return;
    }

    setProcessingLoan(loan.id);
    try {
      await takeLoan(loan.id);
      addToast("Loan taken successfully", "success");
    } catch (error) {
      console.error("Error taking loan:", error);
      addToast("Error taking loan", "error");
    } finally {
      setProcessingLoan(null);
    }
  };

  const getRiskLevel = (creditScore: number) => {
    if (creditScore >= 700) return { level: "Low", color: "bg-green-500/20 text-green-400 border-green-500/30" };
    if (creditScore >= 600) return { level: "Medium", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    if (creditScore >= 500) return { level: "High", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" };
    return { level: "Very High", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  };

  const availableLoansFiltered = availableLoans.filter(loan => loan.status === "available");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Available Loans</h3>
        </div>
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-2" />
          <div className="text-gray-400">Loading loans...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Available Loans</h3>
          <p className="text-sm text-gray-400">
            Loans you can take based on your credit score ({user.creditScore})
          </p>
        </div>
        <Badge variant="outline" className="border-blue-500/30 text-blue-400">
          {availableLoansFiltered.length} available
        </Badge>
      </div>

      {availableLoansFiltered.length === 0 ? (
        <Card className="bg-[#0F1224] border-[#0B0A0B]">
          <CardContent className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              No loans available
            </h3>
            <p className="text-gray-500">
              Check back later for new lending opportunities
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {availableLoansFiltered.map((loan) => {
            const riskInfo = getRiskLevel(loan.minCreditScore);
            const canTakeLoan = user.creditScore >= loan.minCreditScore;
            
            return (
              <Card key={loan.id} className="bg-[#0F1224] border-[#0B0A0B] hover:border-blue-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-900/20 rounded-lg">
                          <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            Lender: {loan.lender.slice(0, 6)}...{loan.lender.slice(-4)}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={riskInfo.color}>
                              Risk: {riskInfo.level}
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-400">
                              Min Score: {loan.minCreditScore}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-sm text-gray-400">Amount</p>
                            <p className="font-semibold text-white">
                              {formatCurrency(loan.amountUSDC)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-400">APR</p>
                            <p className="font-semibold text-white">
                              {formatPercentage(loan.apr)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-400" />
                          <div>
                            <p className="text-sm text-gray-400">Duration</p>
                            <p className="font-semibold text-white">
                              {loan.duration} days
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Shield className="w-4 h-4" />
                        <span>Max LTV: {loan.maxLTV}%</span>
                        <span>•</span>
                        <span>Created: {loan.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="ml-6 flex flex-col items-end gap-3">
                      {canTakeLoan ? (
                        <Button
                          onClick={() => handleTakeLoan(loan)}
                          disabled={processingLoan === loan.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {processingLoan === loan.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Take Loan
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="text-center">
                          <Badge variant="outline" className="border-red-500/30 text-red-400 mb-2">
                            Score too low
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Need {loan.minCreditScore - user.creditScore} more points
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
