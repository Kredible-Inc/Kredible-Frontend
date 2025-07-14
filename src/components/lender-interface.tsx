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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  DollarSign,
  TrendingUp,
  Loader2,
  User,
} from "lucide-react";
import { LoanRequestsTable } from "./loan-requests-table";
import { MyLoansTable } from "./my-loans-table";
import { useLending } from "@/shared/contexts/lending-context";

interface LenderInterfaceProps {
  addToast: (message: string, type: "success" | "error" | "info") => void;
}

export function LenderInterface({ addToast }: LenderInterfaceProps) {
  const { createLenderOffer, isLoading } = useLending();
  const [offerAmount, setOfferAmount] = useState<string>("");
  const [offerRate, setOfferRate] = useState<string>("7.5");
  const [maxDuration, setMaxDuration] = useState<string>("30");
  const [minScore, setMinScore] = useState<string>("500");

  const handleCreateOffer = async () => {
    const amount = Number.parseFloat(offerAmount);
    const rate = Number.parseFloat(offerRate);
    const duration = Number.parseInt(maxDuration);
    const score = Number.parseInt(minScore);

    if (
      amount <= 0 ||
      rate <= 0 ||
      duration <= 0 ||
      score < 400 ||
      score > 800
    ) {
      addToast("Please verify that all fields are valid", "error");
      return;
    }

    try {
      await createLenderOffer({
        amountUSDC: amount,
        interestRate: rate,
        maxDuration: duration,
        minCreditScore: score,
      });
      addToast("Loan offer created successfully", "success");
      setOfferAmount("");
      setOfferRate("7.5");
      setMaxDuration("30");
      setMinScore("500");
    } catch {
      addToast("Error creating loan offer", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-blue-950/30 border-blue-500/30">
          <TabsTrigger
            value="requests"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
          >
            <User className="h-4 w-4" />
            Solicitudes
          </TabsTrigger>
          <TabsTrigger
            value="offer"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
          >
            <PlusCircle className="h-4 w-4" />
            Crear Oferta
          </TabsTrigger>
          <TabsTrigger
            value="my-loans"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
          >
            <TrendingUp className="h-4 w-4" />
            My Loans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <LoanRequestsTable addToast={addToast} />
        </TabsContent>

        <TabsContent value="offer">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-blue-900/20 border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5 text-blue-400" />
                  Create Loan Offer
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Define your terms and conditions for lending
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="offer-amount" className="text-gray-300">
                    Available amount (USDC)
                  </Label>
                  <Input
                    id="offer-amount"
                    type="number"
                    placeholder="5000"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="bg-blue-950/50 border-blue-500/30 text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer-rate" className="text-gray-300">
                    Annual interest rate (%)
                  </Label>
                  <Input
                    id="offer-rate"
                    type="number"
                    step="0.1"
                    value={offerRate}
                    onChange={(e) => setOfferRate(e.target.value)}
                    className="bg-blue-950/50 border-blue-500/30 text-white"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-duration" className="text-gray-300">
                    Maximum duration (days)
                  </Label>
                  <Input
                    id="max-duration"
                    type="number"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
                    className="bg-blue-950/50 border-blue-500/30 text-white"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-score" className="text-gray-300">
                    Minimum required score (400-800)
                  </Label>
                  <Input
                    id="min-score"
                    type="number"
                    min="400"
                    max="800"
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                    className="bg-blue-950/50 border-blue-500/30 text-white"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={handleCreateOffer}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Offer...
                    </>
                  ) : (
                    "Create Offer"
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    Market Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-950/30 border border-blue-400/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        7.2%
                      </div>
                      <div className="text-sm text-gray-400">Average APR</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-950/30 border border-emerald-400/30 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-400">
                        94%
                      </div>
                      <div className="text-sm text-gray-400">
                        Repayment Rate
                      </div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-purple-950/30 border border-purple-400/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">
                      $2.4M
                    </div>
                    <div className="text-sm text-gray-400">Total Volume</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-900/20 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Lender Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span className="text-gray-300">
                      Diversify among multiple borrowers to reduce risk
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span className="text-gray-300">
                      Consider duration vs. interest rate
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span className="text-gray-300">
                      Borrowers with higher scores have lower default risk
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <span className="text-gray-300">
                      Review collateral and LTV before financing
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-loans">
          <MyLoansTable addToast={addToast} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
