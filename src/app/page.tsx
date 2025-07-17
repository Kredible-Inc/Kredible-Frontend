"use client";
import { LendingProvider } from "@/shared/contexts/lending-context";
import { Dashboard } from "@/components/dashboard";
import ConnectWallet from "@/shared/components/ConnectWallet";
import UserInfoModal from "@/shared/components/UserInfoModal";
import { useAuthStore } from "@/shared/stores/authStore";
import { useWallet } from "@/shared/hooks/useWallet";
import { useCreditScore } from "@/shared/hooks/useCreditScore";
import type { User } from "../shared/types/lending";

const WALLET_ADDRESS = "GAXB4K2M4LXYZ789ABCDEF123456789STELLAR";

function AppContent({ user }: { user: User }) {
  const { isAuthenticated } = useAuthStore();
  const { isConnected } = useWallet();

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

  return <Dashboard />;
}

export default function Page() {
  const { data, isLoading } = useCreditScore(WALLET_ADDRESS);
  const score = typeof data?.score === "number" ? data.score : 650;
  const user: User = {
    address: WALLET_ADDRESS,
    creditScore: score,
  ltv: 70,
  apr: 7.0,
  totalBorrowed: 15000,
    totalLent: 0,
  totalRepaid: 12,
  activeLoans: 2,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading credit score...
      </div>
    );
  }

  return (
    <LendingProvider initialUser={user}>
      <AppContent user={user} />
    </LendingProvider>
  );
}
