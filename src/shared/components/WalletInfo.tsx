"use client";

import { useWallet } from "@/shared/hooks/useWallet";
import { useAuthStore } from "@/shared/stores/authStore";

export default function WalletInfo() {
  const { isConnected, address, formatAddress } = useWallet();
  const { user, isAuthenticated } = useAuthStore();

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md">
      <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
        Wallet Connected
      </h3>
      <p className="text-xs text-blue-600 dark:text-blue-300 font-mono">
        {formatAddress(address)}
      </p>
      <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
        Ready for Stellar transactions
      </p>

      {isAuthenticated && user && (
        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
          <p className="text-xs text-blue-600 dark:text-blue-300">
            <strong>Usuario:</strong> {user.name}
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            <strong>Email:</strong> {user.email}
          </p>
          {user.createdAt && (
            <p className="text-xs text-blue-500 dark:text-blue-400">
              <strong>Registrado:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
