"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  connectWallet,
  disconnectWallet,
  getPublicKey,
  signTransaction,
} from "@/shared/utils/stellar-wallet-kid";

interface WalletState {
  // State
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  checkConnection: () => Promise<void>;
  signTransaction: (xdr: string, network: string) => Promise<string>;

  // Internal actions (for store management)
  setAddress: (address: string | null) => void;
  setConnecting: (connecting: boolean) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      address: null,
      isConnected: false,
      isConnecting: false,

      // Actions
      connect: async () => {
        set({ isConnecting: true });

        try {
          await connectWallet((address: string) => {
            set({
              address,
              isConnected: true,
              isConnecting: false,
            });
          });
        } catch (error) {
          console.error("Failed to connect wallet:", error);
          set({ isConnecting: false });
          throw error;
        }
      },

      disconnect: () => {
        disconnectWallet();
        set({
          address: null,
          isConnected: false,
          isConnecting: false,
        });
      },

      checkConnection: async () => {
        try {
          const address = await getPublicKey();
          if (address) {
            set({
              address,
              isConnected: true,
            });
          } else {
            set({
              address: null,
              isConnected: false,
            });
          }
        } catch {
          console.log("No wallet connected");
          set({
            address: null,
            isConnected: false,
          });
        }
      },

      signTransaction: async (xdr: string, network: string) => {
        const { address } = get();
        if (!address) {
          throw new Error("Wallet not connected");
        }

        return await signTransaction(xdr, network);
      },

      // Internal actions
      setAddress: (address: string | null) => {
        set({
          address,
          isConnected: !!address,
        });
      },

      setConnecting: (isConnecting: boolean) => {
        set({ isConnecting });
      },
    }),
    {
      name: "wallet-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
      }), // Only persist these fields
      skipHydration: true, // Skip hydration to avoid SSR issues
    },
  ),
);
