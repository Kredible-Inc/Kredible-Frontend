"use client";

import { useAuthStore } from "@/shared/stores/authStore";

export const useAuth = () => {
  const store = useAuthStore();

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,

    // Actions
    login: store.login,
    logout: store.logout,

    // Utility functions
    isUserRegistered: (walletAddress: string) => {
      return store.user?.walletAddress === walletAddress;
    },

    // Check if user is ready (authenticated and has wallet)
    isReady: store.isAuthenticated && !!store.user,
  };
};
