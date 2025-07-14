"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  Percent,
  Shield,
  User,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/shared/utils/credit";
import { LoanRequest } from "@/shared/types/lending";
import { useLending } from "@/shared/contexts/lending-context";

interface FundLoanDrawerProps {
  loanRequest: LoanRequest;
  addToast: (message: string, type: "success" | "error") => void;
  children: React.ReactNode;
}

export function FundLoanDrawer({
  loanRequest,
  addToast,
  children,
}: FundLoanDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { fundLoan } = useLending();

  const calculatePotentialReturn = (
    amount: number,
    apr: number,
    duration: number,
  ) => {
    const dailyRate = apr / 100 / 365;
    const totalReturn = amount * dailyRate * duration;
    return totalReturn;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 700)
      return {
        level: "Low",
        color: "text-emerald-400",
        bgColor: "bg-emerald-900/20",
      };
    if (score >= 600)
      return {
        level: "Medium",
        color: "text-blue-400",
        bgColor: "bg-blue-900/20",
      };
    if (score >= 500)
      return {
        level: "High",
        color: "text-yellow-400",
        bgColor: "bg-yellow-900/20",
      };
    return {
      level: "Very High",
      color: "text-red-400",
      bgColor: "bg-red-900/20",
    };
  };

  const handleConfirmFunding = async () => {
    setIsConfirming(true);
    try {
      await fundLoan(loanRequest.id);
      addToast(
        "Loan funded successfully! Check 'My Loans' to track your investment.",
        "success",
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error funding loan:", error);
      addToast("Error funding loan. Please try again.", "error");
    } finally {
      setIsConfirming(false);
    }
  };

  const potentialReturn = calculatePotentialReturn(
    loanRequest.amountUSDC,
    loanRequest.apr,
    loanRequest.duration,
  );
  const riskInfo = getRiskLevel(loanRequest.borrowerScore);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-[#0F1224] border-l border-[#0B0A0B] w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            Fund Loan Request
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Review the loan details and confirm your investment
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Borrower Information */}
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Borrower Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wallet Address</span>
                <span className="font-mono text-sm text-white">
                  {loanRequest.borrower}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Credit Score</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {loanRequest.borrowerScore}
                  </span>
                  <Badge className={riskInfo.bgColor}>
                    <span className={riskInfo.color}>
                      Risk {riskInfo.level}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card className="bg-emerald-900/20 border-emerald-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="font-semibold text-white">
                      {formatCurrency(loanRequest.amountUSDC)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">APR</p>
                    <p className="font-semibold text-white">
                      {formatPercentage(loanRequest.apr)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="font-semibold text-white">
                      {loanRequest.duration} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">LTV</p>
                    <p className="font-semibold text-white">
                      {loanRequest.ltv}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collateral Information */}
          <Card className="bg-purple-900/20 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Collateral Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">XLM Collateral</span>
                <span className="font-semibold text-white">
                  {loanRequest.collateralXLM.toFixed(2)} XLM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Collateral Value</span>
                <span className="font-semibold text-white">
                  ~${(loanRequest.collateralXLM * 0.12).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Collateral Ratio</span>
                <span className="font-semibold text-white">
                  {(
                    ((loanRequest.collateralXLM * 0.12) /
                      loanRequest.amountUSDC) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Investment Summary */}
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                Your Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Investment Amount</span>
                <span className="font-semibold text-white">
                  {formatCurrency(loanRequest.amountUSDC)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Expected Return</span>
                <span className="font-semibold text-emerald-400">
                  +{formatCurrency(potentialReturn)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ROI</span>
                <span className="font-semibold text-emerald-400">
                  {((potentialReturn / loanRequest.amountUSDC) * 100).toFixed(
                    2,
                  )}
                  %
                </span>
              </div>
              <Separator className="bg-yellow-500/30" />
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Return</span>
                <span className="font-semibold text-white">
                  {formatCurrency(loanRequest.amountUSDC + potentialReturn)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Risk Warning */}
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-400">
                    Investment Risk Warning
                  </h4>
                  <p className="text-sm text-gray-300">
                    This is a peer-to-peer lending investment. Returns are not
                    guaranteed and you may lose your investment if the borrower
                    defaults. The collateral provides some protection but may
                    not cover the full amount in case of XLM price volatility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmFunding}
              disabled={isConfirming}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Funding
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
