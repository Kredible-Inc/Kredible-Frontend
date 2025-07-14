"use client";

import { useAuthStore } from "@/shared/stores/authStore";
import {
  DollarSign,
  TrendingUp,
  Activity,
  Rocket,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/shared/contexts/DashboardContext";

export default function DashboardContent() {
  const { user } = useAuthStore();
  const { activeTab } = useDashboard();

  if (activeTab === "loans") {
    return (
      <div className="space-y-6">
        {/* Welcome Card */}
        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Lending Dashboard
              </h2>
              <p className="text-gray-400">
                Manage your lending portfolio and find borrowers
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Total Lent</div>
              <div className="text-2xl font-bold text-blue-400">
                ${(user?.totalLent || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-400">Active Loans</div>
                <div className="text-2xl font-bold text-white">
                  {user?.lendingHistory?.filter((t) => t.status === "active")
                    .length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-400">Completed Loans</div>
                <div className="text-2xl font-bold text-white">
                  {user?.lendingHistory?.filter((t) => t.status === "completed")
                    .length || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-400">Average Interest</div>
                <div className="text-2xl font-bold text-white">
                  {user?.lendingHistory?.length
                    ? `${(user.lendingHistory.reduce((sum, t) => sum + t.interestRate, 0) / user.lendingHistory.length).toFixed(1)}%`
                    : "0%"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Lending Offer
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Find Borrowers
            </Button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Lending Features Coming Soon
            </h3>
            <p className="text-gray-400">
              Advanced lending tools, risk assessment, and portfolio management.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Borrowing Dashboard
            </h2>
            <p className="text-gray-400">
              Find lenders and manage your borrowing needs
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Borrowed</div>
            <div className="text-2xl font-bold text-green-400">
              ${(user?.totalBorrowed || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-400">Active Borrows</div>
              <div className="text-2xl font-bold text-white">
                {user?.borrowingHistory?.filter((t) => t.status === "active")
                  .length || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-400">Completed Borrows</div>
              <div className="text-2xl font-bold text-white">
                {user?.borrowingHistory?.filter((t) => t.status === "completed")
                  .length || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-400" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-400">Credit Score</div>
              <div className="text-2xl font-bold text-white">
                {user?.creditScore || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Request Loan
          </Button>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            Find Lenders
          </Button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-[#0F1224] rounded-lg shadow-lg border border-[#0B0A0B] p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Borrowing Features Coming Soon
          </h3>
          <p className="text-gray-400">
            Credit score improvement, loan matching, and repayment tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
