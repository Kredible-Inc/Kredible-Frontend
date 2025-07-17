"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  AlertTriangle,
  CheckCircle,
  Percent,
  Loader2,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  getCreditTier,
  calculateCollateral,
  formatCurrency,
  formatPercentage,
} from "@/shared//utils/credit";
import { AvailableLoansTable } from "./available-loans-table";
import { MyLoansTable } from "./my-loans-table";
import { useLending } from "@/shared/contexts/lending-context";

interface BorrowerInterfaceProps {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export function BorrowerInterface({ addToast }: BorrowerInterfaceProps) {
  const { user, createLoanRequest, isLoading } = useLending();
  const [amountUSDC, setAmountUSDC] = useState<string>("");
  const [duration, setDuration] = useState<string>("30");
  const xlmPrice = 0.12; // Precio simulado de XLM en USD

  const creditInfo = getCreditTier(user.creditScore);
  const amount = Number.parseFloat(amountUSDC) || 0;
  const requiredCollateral =
    amount > 0 ? calculateCollateral(amount, creditInfo.ltv, xlmPrice) : 0;
  const collateralValue = requiredCollateral * xlmPrice;

  const handleSubmitLoan = async () => {
    if (amount <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }

    if (Number.parseInt(duration) <= 0) {
      addToast("Please enter a valid duration", "error");
      return;
    }

    try {
      await createLoanRequest(amount, Number.parseInt(duration));
      addToast("Loan request created successfully", "success");
      setAmountUSDC("");
      setDuration("30");
    } catch {
      addToast("Error creating loan request", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="request" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-blue-950/30 border-blue-500/30">
          <TabsTrigger
            value="request"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
          >
            <Calculator className="h-4 w-4" />
            Request Borrowing
          </TabsTrigger>
          <TabsTrigger
            value="available"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
          >
            <DollarSign className="h-4 w-4" />
            Available Borrowings
          </TabsTrigger>
          <TabsTrigger
            value="my-loans"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
          >
            <TrendingUp className="h-4 w-4" />
            My Borrowings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulario de Solicitud */}
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calculator className="h-5 w-5 text-blue-400" />
                  Request Borrowing
                </CardTitle>
                <CardDescription className="text-gray-400">
                  With your credit score of {user.creditScore}, you can request a borrowing
                  up to {creditInfo.ltv}% LTV with {formatPercentage(creditInfo.apr)} APR
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">
                    Amount to borrow (USDC)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={amountUSDC}
                    onChange={(e) => setAmountUSDC(e.target.value)}
                    className="bg-blue-950/50 border-blue-500/30 text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-300">
                    Borrowing Duration (days)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-blue-950/50 border-blue-500/30 text-white"
                    disabled={isLoading}
                  />
                </div>

                <Separator className="bg-blue-500/30" />

                {amount > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-white">Borrowing Summary</h4>

                    <div className="bg-blue-950/30 border border-blue-400/30 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Amount borrowed:</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Your allowed LTV:</span>
                        <Badge
                          className={`${creditInfo.color} ${creditInfo.bgColor} border`}
                        >
                          {creditInfo.ltv}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Estimated APR:</span>
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-emerald-400" />
                          <span className="font-semibold text-emerald-400">
                            {formatPercentage(creditInfo.apr)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">
                          Required collateral for borrowing:
                        </span>
                        <span className="font-semibold text-white">
                          {requiredCollateral.toFixed(2)} XLM
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Collateral value:</span>
                        <span className="text-gray-400">
                          ${collateralValue.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Alert className="bg-yellow-900/20 border-yellow-500/30">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-200">
                        Your collateral will be locked until you repay the borrowing.
                        If the XLM price drops significantly, you could be liquidated.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleSubmitLoan}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                      disabled={amount <= 0 || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Borrowing Request...
                        </>
                      ) : (
                        "Request Borrowing"
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information and Score Levels */}
            <div className="space-y-4">
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">
                    Credit Score Levels
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Range: 400 - 800 points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-red-900/20 border border-red-500/30 rounded">
                      <div>
                        <span className="text-sm text-white">
                          400 - 500 (Low)
                        </span>
                        <div className="text-xs text-red-400">APR: ~9.0%</div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-red-400 border-red-500"
                      >
                        LTV 50%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                      <div>
                        <span className="text-sm text-white">
                          500 - 600 (Medium)
                        </span>
                        <div className="text-xs text-yellow-400">
                          APR: ~8.0%
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-yellow-400 border-yellow-500"
                      >
                        LTV 60%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                      <div>
                        <span className="text-sm text-white">
                          600 - 700 (Medium-High)
                        </span>
                        <div className="text-xs text-blue-400">APR: ~7.0%</div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-blue-400 border-blue-500"
                      >
                        LTV 70%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-900/20 border border-emerald-500/30 rounded">
                      <div>
                        <span className="text-sm text-white">
                          700 - 800 (High)
                        </span>
                        <div className="text-xs text-emerald-400">
                          APR: ~6.0%
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-emerald-400 border-emerald-500"
                      >
                        LTV 80%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 rounded-full p-2 mt-1">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Request your borrowing
                      </h4>
                      <p className="text-sm text-gray-400">
                        Enter the amount in USDC you need to borrow
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 rounded-full p-2 mt-1">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Lock XLM according to your allowed LTV for borrowing
                      </h4>
                      <p className="text-sm text-gray-400">
                        Lock XLM according to your allowed LTV
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 rounded-full p-2 mt-1">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Wait for lending
                      </h4>
                      <p className="text-sm text-gray-400">
                        Lenders will see your borrowing request and can fund it
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-600 rounded-full p-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Receive USDC</h4>
                      <p className="text-sm text-gray-400">
                        Once funded, you receive the USDC in your wallet
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="available">
          <AvailableLoansTable addToast={addToast} />
        </TabsContent>

        <TabsContent value="my-loans">
          <MyLoansTable addToast={addToast} show="borrowed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
