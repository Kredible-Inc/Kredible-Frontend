"use client";

import { useAuthStore } from "@/shared/stores/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccountInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountInfoDialog({
  isOpen,
  onClose,
}: AccountInfoDialogProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0F1224] text-white max-w-lg w-full max-h-[90vh] overflow-y-auto border-[#0B0A0B]">
        <DialogHeader>
          <DialogTitle className="text-white">Account Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <p className="text-white font-medium">{user.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <p className="text-white font-medium">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-300">Wallet Address</label>
            <p className="text-white font-mono text-sm break-all">
              {user.walletAddress}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-300">Member Since</label>
            <p className="text-white font-medium">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-300">User Role</label>
            <p className="text-white font-medium capitalize">
              {user.userRole || "borrower"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-300">Reputation</label>
            <p className="text-white font-medium">{user.reputation || 0}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#0B0A0B]">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                ${(user.totalLent || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300">Total Lent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                ${(user.totalBorrowed || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300">Total Borrowed</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
 