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
import { AvailableLoan } from "@/shared/types/lending";
import { useLending } from "@/shared/contexts/lending-context";

interface TakeLoanDrawerProps {
  loan: AvailableLoan;
  addToast: (message: string, type: "success" | "error") => void;
  children: React.ReactNode;
}

export function TakeLoanDrawer({
  loan,
  addToast,
  children,
}: TakeLoanDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { takeLoan, user } = useLending();

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

  const handleConfirmTakeLoan = async () => {
    setIsConfirming(true);
    try {
      await takeLoan(loan.id);
      addToast(
        "Loan taken successfully! Check 'My Loans' to track your loan.",
        "success",
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error taking loan:", error);
      addToast("Error taking loan. Please try again.", "error");
    } finally {
      setIsConfirming(false);
    }
  };

  const riskInfo = getRiskLevel(loan.minCreditScore);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-[#0F1224] border-l border-[#0B0A0B] w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-400" />
            Take Loan
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Review the loan details and confirm to take this loan
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Lender Information */}
          <Card className="bg-blue-900/20 border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Lender Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wallet Address</span>
                <span className="font-mono text-sm text-white">
                  {loan.lender}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Min Credit Score</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">
                    {loan.minCreditScore}
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
                      {formatCurrency(loan.amountUSDC)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-400" />
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
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">Max LTV</p>
                    <p className="font-semibold text-white">{loan.maxLTV}%</p>
                  </div>
                </div>
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
                    Loan Risk Warning
                  </h4>
                  <p className="text-sm text-gray-300">
                    This is a peer-to-peer loan. You are responsible for
                    repayment and collateral. Defaulting may result in loss of
                    collateral and negative credit impact.
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
              onClick={handleConfirmTakeLoan}
              disabled={isConfirming}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Loan
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
