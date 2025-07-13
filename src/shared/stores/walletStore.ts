"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  connectWallet,
  disconnectWallet,
  getPublicKey,
  signTransaction,
} from "@/shared/utils/stellar-wallet-kid";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;

  connect: () => Promise<void>;
  disconnect: () => void;
  checkConnection: () => Promise<void>;
  signTransaction: (xdr: string, network: string) => Promise<string>;

  setAddress: (address: string | null) => void;
  setConnecting: (connecting: boolean) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      address: null,
      isConnected: false,
      isConnecting: false,

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
      partialize: (state) => ({
        address: state.address,
        isConnected: state.isConnected,
      }), // Only persist these fields
    },
  ),
);
