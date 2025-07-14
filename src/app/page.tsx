"use client";
import { LendingProvider } from "@/shared/contexts/lending-context";
import { Dashboard } from "@/components/dashboard";
import ConnectWallet from "@/shared/components/ConnectWallet";
import UserInfoModal from "@/shared/components/UserInfoModal";
import { useAuthStore } from "@/shared/stores/authStore";
import { useWallet } from "@/shared/hooks/useWallet";
import type { User } from "../shared/types/lending";

// Simulated user with new score range
const mockUser: User = {
  address: "GAXB4K2M4LXYZ789ABCDEF123456789STELLAR",
  creditScore: 650, // Score in range 400-800
  ltv: 70,
  apr: 7.0,
  totalBorrowed: 15000,
  totalLent: 0, // Added to fix type error
  totalRepaid: 12,
  activeLoans: 2,
};

function AppContent() {
  const { isAuthenticated, user } = useAuthStore();
  const { isConnected } = useWallet();

  // If not connected, show connection screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-black flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Kredible
          </h1>
          <p className="text-gray-400 text-lg">
            Decentralized P2P lending with on-chain credit score
          </p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  // If connected but not authenticated, show welcome screen
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-black flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Kredible
          </h1>
          <p className="text-gray-400 text-lg">
            Please complete your registration
          </p>
          <ConnectWallet />
          <UserInfoModal />
        </div>
      </div>
    );
  }

  // If authenticated, show dashboard
  return <Dashboard />;
}

export default function Page() {
  return (
    <LendingProvider initialUser={mockUser}>
      <AppContent />
    </LendingProvider>
  );
}
