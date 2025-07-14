"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Shield } from "lucide-react"
import { CreditScoreCard } from "./credit-score-card"
import { StatsGrid } from "./stats-grid"
import { BorrowerInterface } from "./borrower-interface"
import { LenderInterface } from "./lender-interface"
import { ToastManager } from "./toast-notification"
import { useToast } from "@/shared/hooks/use-toast"
import { useLending } from "@/shared/contexts/lending-context"
import Navbar from "@/shared/components/Navbar"
import { useAuthStore } from "@/shared/stores/authStore"
import { useWallet } from "@/shared/hooks/useWallet"
import { DashboardProvider } from "@/shared/contexts/DashboardContext"

export function Dashboard() {
  const { user } = useLending()
  const { toasts, addToast, removeToast } = useToast()
  const { isAuthenticated } = useAuthStore()
  const { isConnected } = useWallet()

  // Si no está conectado o autenticado, no mostrar el dashboard
  if (!isConnected || !isAuthenticated) {
    return null
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-black">
        {/* Navbar */}
        <Navbar />
        
        <div className="p-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stellar Lending Platform
              </h1>
              <p className="text-gray-400">Préstamos P2P descentralizados con credit score on-chain</p>
            </div>

            {/* Stats Grid */}
            <StatsGrid />

            {/* Credit Score Card */}
            <CreditScoreCard user={user} />

            {/* Main Interface */}
            <Tabs defaultValue="borrow" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-blue-900/30 border-blue-500/30">
                <TabsTrigger
                  value="borrow"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                >
                  <DollarSign className="h-4 w-4" />
                  Pedir Prestado
                </TabsTrigger>
                <TabsTrigger
                  value="lend"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
                >
                  <Shield className="h-4 w-4" />
                  Prestar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="borrow">
                <BorrowerInterface addToast={addToast} />
              </TabsContent>

              <TabsContent value="lend">
                <LenderInterface addToast={addToast} />
              </TabsContent>
            </Tabs>

            {/* Toast Notifications */}
            <ToastManager toasts={toasts} removeToast={removeToast} />
          </div>
        </div>
      </div>
    </DashboardProvider>
  )
}
