"use client";

import { useState, useEffect } from "react";
import { resolveUserInfoPromise } from "@/shared/lib/auth";
import { useAuthStore } from "@/shared/stores/authStore";
import { useWalletStore } from "@/shared/stores/walletStore";

export default function UserInfoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; lastName?: string; email?: string }>({});

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isConnected = useWalletStore((state) => state.isConnected);

  // Only open modal on custom event
  useEffect(() => {
    const handleOpenModal = () => {
      setIsOpen(true);
    };
    window.addEventListener("openUserInfoModal", handleOpenModal);
    return () => {
      window.removeEventListener("openUserInfoModal", handleOpenModal);
    };
  }, []);

  const validateForm = () => {
    const newErrors: { name?: string; lastName?: string; email?: string } = {};
    if (!name.trim()) {
      newErrors.name = "First name is required";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      resolveUserInfoPromise({ name: `${name.trim()} ${lastName.trim()}`, email: email.trim() });
      setIsOpen(false);
      setName("");
      setLastName("");
      setEmail("");
      setErrors({});
    } catch (error) {
      console.error("Error submitting user info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setName("");
    setLastName("");
    setEmail("");
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0F1224] rounded-lg shadow-2xl border border-[#0B0A0B] max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-[#0B0A0B]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome to Kredible</h2>
              <p className="text-gray-400 mt-1">
                Please complete your registration to continue
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              className={`w-full px-4 py-3 bg-[#0B0A0B] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className={`w-full px-4 py-3 bg-[#0B0A0B] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.lastName ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={`w-full px-4 py-3 bg-[#0B0A0B] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 mt-0.5">ℹ️</div>
              <div>
                <h4 className="font-medium text-blue-200 mb-2">Account Creation</h4>
                <p className="text-blue-100 text-sm">
                  Your account will be created with the connected wallet address. 
                  This information will be used for loan transactions and account management.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 