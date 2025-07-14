"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Shield, Percent } from "lucide-react";
import { getCreditTier, formatPercentage } from "@/shared/utils/credit";
import type { User } from "@/shared/types/lending";

interface CreditScoreCardProps {
  user: User;
}

export function CreditScoreCard({ user }: CreditScoreCardProps) {
  const creditInfo = getCreditTier(user.creditScore);
  const scorePercentage = ((user.creditScore - 400) / (800 - 400)) * 100;

  return (
    <Card className="border-2 border-blue-500/30 bg-blue-900/20 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Your Credit Score</CardTitle>
        <CardDescription className="text-gray-400">
          Based on your on-chain history in Stellar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-400 mb-2">
            {user.creditScore}
          </div>
          <div className="text-xl text-gray-400">/ 800</div>
          <Badge
            className={`mt-2 ${creditInfo.color} ${creditInfo.bgColor} border`}
          >
            Level {creditInfo.tier}
          </Badge>
        </div>

        <Progress value={scorePercentage} className="h-3 bg-blue-950/50" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-950/30 border border-blue-400/30 rounded-lg">
            <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">
              {creditInfo.ltv}%
            </div>
            <div className="text-sm text-gray-400">Max LTV</div>
          </div>
          <div className="text-center p-4 bg-emerald-950/30 border border-emerald-400/30 rounded-lg">
            <Percent className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-400">
              {formatPercentage(creditInfo.apr)}
            </div>
            <div className="text-sm text-gray-400">Min APR</div>
          </div>
          <div className="text-center p-4 bg-purple-950/30 border border-purple-400/30 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {user.totalRepaid}
            </div>
            <div className="text-sm text-gray-400">Repaid Loans</div>
          </div>
        </div>

        <div className="bg-blue-950/30 border border-blue-400/30 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-white">
            How to improve your score?
          </h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Repay your loans on time</li>
            <li>• Maintain a consistent history</li>
            <li>• Avoid defaults or liquidations</li>
            <li>• Participate actively in the protocol</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
