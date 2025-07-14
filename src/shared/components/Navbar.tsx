"use client";

import { useState } from "react";
import { useAuthStore } from "@/shared/stores/authStore";
import { useWallet } from "@/shared/hooks/useWallet";
import ConnectWallet from "./ConnectWallet";
import { Button } from "@/components/ui/button";
import { User, TrendingUp, DollarSign, Shield } from "lucide-react";
import AccountInfoDialog from "./AccountInfoDialog";
import { ThemeToggle } from "./ThemeToggle";
import { useDashboard } from "@/shared/contexts/DashboardContext";

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { isConnected } = useWallet();
  const { activeTab, setActiveTab } = useDashboard();
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  if (!isConnected || !isAuthenticated || !user) {
    return (
      <nav className="bg-black backdrop-blur-sm border-b border-[#0B0A0B] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Kredible</h1>
          <ConnectWallet />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-black mb-[7rem] backdrop-blur-sm border-b border-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Kredible</h1>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 ml-8">
            <Button
              variant={activeTab === "loans" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("loans")}
              className={`flex items-center gap-2 ${
                activeTab === "loans"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Lending
            </Button>
            
            <Button
              variant={activeTab === "borrows" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("borrows")}
              className={`flex items-center gap-2 ${
                activeTab === "borrows"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <Shield className="w-4 h-4" />
              Borrowing
            </Button>
            
            <Button
              variant={activeTab === "credit-score" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("credit-score")}
              className={`flex items-center gap-2 ${
                activeTab === "credit-score"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Credit Score
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAccountDialogOpen(true)}
            className="text-white hover:bg-gray-700"
          >
            <User className="w-4 h-4 mr-2" />
            Account
          </Button>
        </div>
      </div>

      {/* Account Info Dialog */}
      <AccountInfoDialog
        isOpen={isAccountDialogOpen}
        onClose={() => setIsAccountDialogOpen(false)}
      />
    </nav>
  );
}
