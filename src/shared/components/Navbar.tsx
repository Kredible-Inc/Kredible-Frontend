"use client";

import { useState } from "react";
import { useAuthStore } from "@/shared/stores/authStore";
import { useWallet } from "@/shared/hooks/useWallet";
import ConnectWallet from "./ConnectWallet";
import { useDashboard } from "@/shared/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import { User, TrendingUp, DollarSign } from "lucide-react";
import AccountInfoDialog from "./AccountInfoDialog";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { isConnected } = useWallet();
  const { activeTab, setActiveTab } = useDashboard();
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

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
