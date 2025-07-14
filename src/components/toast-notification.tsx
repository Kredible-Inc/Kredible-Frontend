"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    info: <AlertCircle className="h-5 w-5 text-blue-400" />,
  };

  const colors = {
    success: "bg-emerald-900/20 border-emerald-500/30",
    error: "bg-red-900/20 border-red-500/30",
    info: "bg-blue-900/20 border-blue-500/30",
  };

  return (
    <Card
      className={`fixed top-4 right-4 z-50 p-4 ${colors[type]} border backdrop-blur`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="text-white">{message}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}

interface ToastManagerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "info";
  }>;
  removeToast: (id: string) => void;
}

export function ToastManager({ toasts, removeToast }: ToastManagerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${4 + index * 80}px` }}
          className="fixed right-4 z-50"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
}
