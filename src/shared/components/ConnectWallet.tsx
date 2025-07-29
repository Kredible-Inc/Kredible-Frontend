"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@/shared/hooks/useWallet";
import { useWalletStore } from "@/shared/stores/walletStore";
import { useAuthStore } from "@/shared/stores/authStore";
import { handleWalletAuth } from "@/shared/lib/auth";
import { Wallet, Loader2 } from "lucide-react";

export default function ConnectWallet() {
  const { address, isConnecting, isConnected, connect, formatAddress } =
    useWallet();

  const checkConnection = useWalletStore((state) => state.checkConnection);
  const { user, isAuthenticated } = useAuthStore();

  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  const handleWalletConnection = useCallback(async () => {
    if (!address) return;

    setIsProcessingAuth(true);
    try {
      await handleWalletAuth(address);
    } catch (error) {
      console.error("Error in wallet authentication:", error);
    } finally {
      setIsProcessingAuth(false);
    }
  }, [address]);

  useEffect(() => {
    // Check if wallet is already connected on component mount
    checkConnection();
  }, [checkConnection]);

  // Handle wallet authentication when wallet connects
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isProcessingAuth) {
      handleWalletConnection();
    }
  }, [
    isConnected,
    address,
    isAuthenticated,
    isProcessingAuth,
    handleWalletConnection,
  ]);

  if (isAuthenticated && user && address) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/20 rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-mono text-green-300">
          {formatAddress(address)}
        </span>
      </div>
    );
  }

  if (isConnected && address && !isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <span className="text-sm font-mono text-yellow-300">
          {formatAddress(address)}
        </span>
        <div className="text-sm text-yellow-300">
          {isProcessingAuth ? "Verifying..." : "Wallet connected"}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center">
      <button
        onClick={connect}
        disabled={isConnecting}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </>
        )}
      </button>
    </div>
  );
}
