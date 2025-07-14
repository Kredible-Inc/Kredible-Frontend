"use client";

import { ToastManager } from "./toast-notification";
import { useToast } from "@/shared/hooks/use-toast";
import Navbar from "@/shared/components/Navbar";
import { useAuthStore } from "@/shared/stores/authStore";
import { useWallet } from "@/shared/hooks/useWallet";
import { DashboardProvider } from "@/shared/contexts/DashboardContext";
import DashboardContent from "@/shared/components/DashboardContent";

export function Dashboard() {
  const { toasts, addToast, removeToast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const { isConnected } = useWallet();

  // If not connected or authenticated, do not show dashboard
  if (!isConnected || !isAuthenticated) {
    return null;
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-black">
        {/* Navbar */}
        <Navbar />

        <div className="p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Main Content */}
            <DashboardContent />

            {/* Toast Notifications */}
            <ToastManager toasts={toasts} removeToast={removeToast} />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
