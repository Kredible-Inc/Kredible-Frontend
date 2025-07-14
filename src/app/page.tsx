"use client"
import { LendingProvider } from "@/shared/contexts/lending-context"
import { Dashboard } from "@/components/dashboard"
import ConnectWallet from "@/shared/components/ConnectWallet"
import UserInfoModal from "@/shared/components/UserInfoModal"
import { useAuthStore } from "@/shared/stores/authStore"
import { useWallet } from "@/shared/hooks/useWallet"
import type { User } from "../shared/types/lending"

// Usuario simulado con nuevo rango de score
const mockUser: User = {
  address: "GAXB4K2M4LXYZ789ABCDEF123456789STELLAR",
  creditScore: 650, // Score en rango 400-800
  ltv: 70,
  apr: 7.0,
  totalBorrowed: 15000,
  totalRepaid: 12,
  activeLoans: 2,
}

function AppContent() {
  const { isAuthenticated, user } = useAuthStore()
  const { isConnected } = useWallet()

  // Si no está conectado, mostrar pantalla de conexión
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-black flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Kredible
          </h1>
          <p className="text-gray-400 text-lg">
            Préstamos P2P descentralizados con credit score on-chain
          </p>
          <ConnectWallet />
        </div>
      </div>
    )
  }

  // Si está conectado pero no autenticado, mostrar pantalla de bienvenida
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1224] to-black flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Kredible
          </h1>
          <p className="text-gray-400 text-lg">Please complete your registration</p>
          <ConnectWallet />
          <UserInfoModal />
        </div>
      </div>
    )
  }

  // Si está autenticado, mostrar dashboard
  return <Dashboard />
}

export default function Page() {
  return (
    <LendingProvider initialUser={mockUser}>
      <AppContent />
    </LendingProvider>
  )
}
