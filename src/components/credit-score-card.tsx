"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Shield, Percent } from "lucide-react"
import { getCreditTier, formatPercentage } from "@/shared/utils/credit"
import type { User } from "@/shared/types/lending"

interface CreditScoreCardProps {
  user: User
}

export function CreditScoreCard({ user }: CreditScoreCardProps) {
  const creditInfo = getCreditTier(user.creditScore)
  const scorePercentage = ((user.creditScore - 400) / (800 - 400)) * 100

  return (
    <Card className="border-2 border-blue-500/30 bg-blue-900/20 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-white">Tu Credit Score</CardTitle>
        <CardDescription className="text-gray-400">Basado en tu historial on-chain en Stellar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold text-blue-400 mb-2">{user.creditScore}</div>
          <div className="text-xl text-gray-400">/ 800</div>
          <Badge className={`mt-2 ${creditInfo.color} ${creditInfo.bgColor} border`}>Nivel {creditInfo.tier}</Badge>
        </div>

        <Progress value={scorePercentage} className="h-3 bg-blue-950/50" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-950/30 border border-blue-400/30 rounded-lg">
            <Shield className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{creditInfo.ltv}%</div>
            <div className="text-sm text-gray-400">LTV Máximo</div>
          </div>
          <div className="text-center p-4 bg-emerald-950/30 border border-emerald-400/30 rounded-lg">
            <Percent className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-400">{formatPercentage(creditInfo.apr)}</div>
            <div className="text-sm text-gray-400">APR Mínimo</div>
          </div>
          <div className="text-center p-4 bg-purple-950/30 border border-purple-400/30 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">{user.totalRepaid}</div>
            <div className="text-sm text-gray-400">Préstamos Repagados</div>
          </div>
        </div>

        <div className="bg-blue-950/30 border border-blue-400/30 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-white">¿Cómo mejorar tu score?</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Repaga tus préstamos a tiempo</li>
            <li>• Mantén un historial consistente</li>
            <li>• Evita defaults o liquidaciones</li>
            <li>• Participa activamente en el protocolo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
