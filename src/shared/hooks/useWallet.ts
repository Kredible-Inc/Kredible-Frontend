"use client";

import { useWalletStore } from "@/shared/stores/walletStore";

export const useWallet = () => {
  const address = useWalletStore((state) => state.address);
  const isConnected = useWalletStore((state) => state.isConnected);
  const isConnecting = useWalletStore((state) => state.isConnecting);
  const connect = useWalletStore((state) => state.connect);
  const disconnect = useWalletStore((state) => state.disconnect);
  const signTransaction = useWalletStore((state) => state.signTransaction);

  return {
    // State
    address,
    isConnected,
    isConnecting,

    // Actions
    connect,
    disconnect,
    signTransaction,

    // Utility functions
    formatAddress: (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },

    // Check if wallet is ready for transactions
    isReady: isConnected && !!address,
  };
};
