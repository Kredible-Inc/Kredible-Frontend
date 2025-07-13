"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/shared/hooks/useWallet";
import { useWalletStore } from "@/shared/stores/walletStore";
import { useAuthStore } from "@/shared/stores/authStore";
import { handleWalletAuth } from "@/shared/lib/auth";

export default function ConnectWallet() {
  const { 
    address, 
    isConnecting, 
    isConnected,
    connect, 
    disconnect, 
    formatAddress 
  } = useWallet();
  
  const checkConnection = useWalletStore((state) => state.checkConnection);
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected on component mount
    checkConnection();
  }, [checkConnection]);

  // Handle wallet authentication when wallet connects
  useEffect(() => {
    if (isConnected && address && !isAuthenticated && !isProcessingAuth) {
      handleWalletConnection();
    }
  }, [isConnected, address, isAuthenticated, isProcessingAuth]);

  const handleWalletConnection = async () => {
    if (!address) return;
    
    setIsProcessingAuth(true);
    try {
      await handleWalletAuth(address);
    } catch (error) {
      console.error("Error in wallet authentication:", error);
    } finally {
      setIsProcessingAuth(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    logout();
  };

  if (isAuthenticated && user && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-mono text-green-800 dark:text-green-200">
            {formatAddress(address)}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          ¡Hola, {user.name}!
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          Desconectar
        </button>
      </div>
    );
  }

  if (isConnected && address && !isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-sm font-mono text-yellow-800 dark:text-yellow-200">
            {formatAddress(address)}
          </span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isProcessingAuth ? "Verificando..." : "Wallet conectada"}
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20 transition-colors"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      {isConnecting ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Conectando...
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          Conectar Wallet
        </>
      )}
    </button>
  );
}
