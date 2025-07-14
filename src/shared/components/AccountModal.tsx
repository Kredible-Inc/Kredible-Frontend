"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/shared/stores/authStore";

export default function AccountModal() {
  const { user } = useAuthStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem className="cursor-pointer text-white hover:bg-gray-700 focus:bg-gray-700">
          <User className="mr-2 h-4 w-4 text-white" />
          <span>Account Information</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="bg-[#0F1224] text-white max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Account Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Name</label>
            <p className="text-white font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <p className="text-white font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-300">Wallet Address</label>
            <p className="text-white font-mono text-sm break-all">
              {user?.walletAddress}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#0B0A0B]">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                ${(user?.totalLent || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300">Total Lent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                ${(user?.totalBorrowed || 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-300">Total Borrowed</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
