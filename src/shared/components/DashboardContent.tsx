"use client";

import { useAuthStore } from "@/shared/stores/authStore";
import { TrendingUp, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/shared/contexts/DashboardContext";
import { CreditScoreCard } from "@/components/credit-score-card";
import { useLending } from "@/shared/contexts/lending-context";
import { BorrowerInterface } from "@/components/borrower-interface";
import { LenderInterface } from "@/components/lender-interface";
import { useToast } from "@/shared/hooks/use-toast";
// import { useCreditScore } from "@/shared/hooks/useCreditScore";
import {
  LendingHistoryVisual,
  downloadLendingHistoryPDF,
} from "@/components/lending-history-visual";
import { Download } from "lucide-react";

export default function DashboardContent() {
  const { user: authUser } = useAuthStore();
  const { user: lendingUser, lendingHistory } = useLending();
  const { activeTab } = useDashboard();
  const { addToast } = useToast();
  // const { data: creditScoreData, isLoading: isScoreLoading } = useCreditScore(lendingUser.address);

  const getHeaderContent = () => {
    switch (activeTab) {
      case "credit-score":
        return {
          title: "Credit Score Dashboard",
          subtitle: "Monitor and improve your on-chain credit standing",
          gradient: "from-purple-400 to-pink-400",
        };
      case "loans":
        return {
          title: "Lend & Earn",
          subtitle: "Earn interest by providing liquidity to borrowings",
          gradient: "from-blue-400 to-cyan-400",
        };
      case "borrows":
        return {
          title: "Borrowings Platform",
          subtitle: "Access liquidity with your credit score and collateral",
          gradient: "from-green-400 to-emerald-400",
        };
      default:
        return {
          title: "Stellar Lendings Platform",
          subtitle: "Decentralized P2P lendings with on-chain credit score",
          gradient: "from-blue-400 to-purple-400",
        };
    }
  };

  const headerContent = getHeaderContent();

  if (activeTab === "credit-score") {
    const completedLendings = lendingHistory.filter(
      (loan) => loan.type === "lent" && loan.status === "repaid",
    );
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className={`text-4xl font-bold bg-gradient-to-r ${headerContent.gradient} bg-clip-text text-transparent`}
          >
            {headerContent.title}
          </h1>
          <p className="text-gray-400 text-lg">{headerContent.subtitle}</p>
        </div>

        {/* Credit Score Card */}
        <CreditScoreCard user={lendingUser} />

        {/* Credit Score Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">
                  Score Range
                </h3>
                <p className="text-sm text-gray-400">Your current position</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Poor (400-500)</span>
                <div className="w-24 h-2 bg-red-900/30 rounded-full">
                  <div className="w-0 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fair (500-600)</span>
                <div className="w-24 h-2 bg-yellow-900/30 rounded-full">
                  <div className="w-0 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Good (600-700)</span>
                <div className="w-24 h-2 bg-blue-900/30 rounded-full">
                  <div className="w-0 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Excellent (700-800)</span>
                <div className="w-24 h-2 bg-green-900/30 rounded-full">
                  <div className="w-0 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-emerald-900/20 rounded-lg">
                <Award className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-white">Benefits</h3>
                <p className="text-sm text-gray-400">Your current advantages</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">Lower interest rates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">Higher borrowing limits</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">Better loan terms</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300">Priority access to offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Score History */}
        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Credit History
              </h3>
              <p className="text-gray-400">Track your progress over time</p>
            </div>
            <Button
              variant="outline"
              className="border-gray-600 text-black bg-white hover:bg-gray-200"
              onClick={() => downloadLendingHistoryPDF(completedLendings)}
            >
              Download Credit History <Download />
            </Button>
          </div>

          {/* Lending history visual */}
          <LendingHistoryVisual />
        </div>

        {/* Improvement Tips */}
        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">
                Improvement Tips
              </h3>
              <p className="text-sm text-gray-400">
                Actions to boost your score
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">
                Immediate Actions
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Pay off any overdue loans</li>
                <li>• Reduce your current debt</li>
                <li>• Maintain consistent activity</li>
              </ul>
            </div>
            <div className="bg-green-950/20 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-400 mb-2">
                Long-term Strategy
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Build a positive lending history</li>
                <li>• Diversify your transactions</li>
                <li>• Stay active in the ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "loans") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className={`text-4xl font-bold bg-gradient-to-r ${headerContent.gradient} bg-clip-text text-transparent`}
          >
            {headerContent.title}
          </h1>
          <p className="text-gray-400 text-lg">{headerContent.subtitle}</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Lendings Dashboard
              </h2>
              <p className="text-gray-400">
                Manage your lendings portfolio and find borrowings
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Lent</div>
              <div className="text-2xl font-bold text-blue-400">
                ${(authUser?.totalLent || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Lending Interface */}
        <LenderInterface addToast={addToast} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1
          className={`text-4xl font-bold bg-gradient-to-r ${headerContent.gradient} bg-clip-text text-transparent`}
        >
          {headerContent.title}
        </h1>
        <p className="text-gray-400 text-lg">{headerContent.subtitle}</p>
      </div>

      {/* Welcome Card */}
      <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Borrowings Dashboard
            </h2>
            <p className="text-gray-400">
              Find lenders and manage your borrowings
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Borrowed</div>
            <div className="text-2xl font-bold text-green-400">
              ${(authUser?.totalBorrowed || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Borrowing Interface */}
      <BorrowerInterface addToast={addToast} />
    </div>
  );
}
