"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, TrendingUp, Activity } from "lucide-react"

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Volumen Total</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">$2.4M</div>
          <p className="text-xs text-gray-400">+12% desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Usuarios Activos</CardTitle>
          <Users className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">1,234</div>
          <p className="text-xs text-gray-400">+8% desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">APR Promedio</CardTitle>
          <TrendingUp className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">7.2%</div>
          <p className="text-xs text-gray-400">-0.3% desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Tasa de Repago</CardTitle>
          <Activity className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">94.2%</div>
          <p className="text-xs text-gray-400">+1.2% desde el mes pasado</p>
        </CardContent>
      </Card>
    </div>
  )
}
