"use client";

import { useState } from "react";
import { useAuthStore } from "@/shared/stores/authStore";
import { useWallet } from "@/shared/hooks/useWallet";
import ConnectWallet from "./ConnectWallet";
import { useDashboard } from "@/shared/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import { User, TrendingUp, DollarSign } from "lucide-react";
import AccountInfoDialog from "./AccountInfoDialog";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isConnected, disconnect } = useWallet();
  const { activeTab, setActiveTab } = useDashboard();
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDisconnect = () => {
    disconnect();
    logout();
    localStorage.removeItem("auth-store");
    localStorage.removeItem("wallet-storage");
    localStorage.removeItem("user-store");
    sessionStorage.setItem("was-logged-out", "true");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isConnected || !isAuthenticated || !user) {
    return (
      <nav className="bg-[#0F1224]/80 backdrop-blur-sm border-b border-[#0B0A0B] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Kredible</h1>
          <ConnectWallet />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#0F1224]/80 backdrop-blur-sm border-b border-[#0B0A0B] p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Kredible</h1>

          <div className="flex items-center bg-[#0B0A0B] rounded-lg p-1 ml-8">
            <Button
              variant={activeTab === "loans" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("loans")}
              className={`flex items-center gap-2 ${activeTab === "loans"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
            >
              <DollarSign className="w-4 h-4" />
              Loans
            </Button>
            <Button
              variant={activeTab === "borrows" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("borrows")}
              className={`flex items-center gap-2 ${activeTab === "borrows"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
            >
              <TrendingUp className="w-4 h-4" />
              Borrows
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
