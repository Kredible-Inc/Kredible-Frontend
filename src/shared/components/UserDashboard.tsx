"use client";

import { useAuthStore } from "@/shared/stores/authStore";
import { useWallet } from "@/shared/hooks/useWallet";
import ConnectWallet from "./ConnectWallet";
import UserInfoModal from "./UserInfoModal";
import Navbar from "./Navbar";
import DashboardContent from "./DashboardContent";
import { DashboardProvider } from "@/shared/contexts/DashboardContext";

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { isConnected } = useWallet();

  // If not connected, show connection screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-black flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Kredible</h1>
            <p className="text-gray-400">Decentralized Lending Platform</p>
          </div>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // If connected but not authenticated, show welcome screen
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-black flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to Kredible
            </h1>
            <p className="text-gray-400">Please complete your registration</p>
          </div>
          <UserInfoModal />
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // If authenticated, show main dashboard
  return (
    <DashboardProvider>
    <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-black">
        <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
          <DashboardContent />
        </div>
      </div>
    </DashboardProvider>
  );
} 
