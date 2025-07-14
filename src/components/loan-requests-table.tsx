"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Percent, Loader2, User, Shield } from "lucide-react"
import { getCreditTier, formatCurrency, formatPercentage } from "@/shared/utils/credit"
import { useLending } from "@/shared/contexts/lending-context"


interface LoanRequestsTableProps {
  addToast: (message: string, type: "success" | "error" | "info") => void
}

export function LoanRequestsTable({ addToast }: LoanRequestsTableProps) {
  const { loanRequests, fundLoan, isLoading } = useLending()

  const handleFundLoan = async (loanId: string) => {
    try {
      await fundLoan(loanId)
      addToast("Préstamo financiado exitosamente", "success")
    } catch (error) {
      addToast("Error al financiar el préstamo", "error")
    }
  }

  const calculatePotentialReturn = (amount: number, apr: number, duration: number) => {
    const dailyRate = apr / 100 / 365
    const totalReturn = amount * dailyRate * duration
    return totalReturn
  }

  const getRiskLevel = (score: number) => {
    if (score >= 700) return { level: "Bajo", color: "text-emerald-400", bgColor: "bg-emerald-900/20" }
    if (score >= 600) return { level: "Medio", color: "text-blue-400", bgColor: "bg-blue-900/20" }
    if (score >= 500) return { level: "Alto", color: "text-yellow-400", bgColor: "bg-yellow-900/20" }
    return { level: "Muy Alto", color: "text-red-400", bgColor: "bg-red-900/20" }
  }

  return (
    <Card className="bg-blue-900/20 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5 text-blue-400" />
          Solicitudes de Préstamo
        </CardTitle>
        <CardDescription className="text-gray-400">
          Usuarios buscando financiación - Revisa y financia las oportunidades que te interesen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-blue-500/30">
              <TableHead className="text-gray-300">Borrower</TableHead>
              <TableHead className="text-gray-300">Score / Riesgo</TableHead>
              <TableHead className="text-gray-300">Cantidad</TableHead>
              <TableHead className="text-gray-300">APR</TableHead>
              <TableHead className="text-gray-300">Duración</TableHead>
              <TableHead className="text-gray-300">Colateral</TableHead>
              <TableHead className="text-gray-300">LTV</TableHead>
              <TableHead className="text-gray-300">Retorno Estimado</TableHead>
              <TableHead className="text-gray-300">Estado</TableHead>
              <TableHead className="text-gray-300">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loanRequests.map((request) => {
              const creditInfo = getCreditTier(request.borrowerScore)
              const riskInfo = getRiskLevel(request.borrowerScore)
              const potentialReturn = calculatePotentialReturn(request.amountUSDC, request.apr, request.duration)

              return (
                <TableRow key={request.id} className="border-blue-500/30">
                  <TableCell className="font-mono text-sm text-gray-300">{request.borrower}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{request.borrowerScore}</span>
                        <Badge className={`${creditInfo.color} ${creditInfo.bgColor} border`} size="sm">
                          {creditInfo.tier}
                        </Badge>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${riskInfo.bgColor}`}>
                        <span className={riskInfo.color}>Riesgo {riskInfo.level}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-white">{formatCurrency(request.amountUSDC)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">{formatPercentage(request.apr)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-300">{request.duration} días</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-white">{request.collateralXLM.toFixed(2)} XLM</div>
                      <div className="text-sm text-gray-400">~${(request.collateralXLM * 0.12).toFixed(2)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-blue-400" />
                      <Badge variant="outline" className="text-blue-400 border-blue-500">
                        {request.ltv}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-semibold text-emerald-400">+${potentialReturn.toFixed(2)}</div>
                      <div className="text-xs text-gray-400">
                        {((potentialReturn / request.amountUSDC) * 100).toFixed(2)}% ROI
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        request.status === "pending"
                          ? "text-yellow-400 border-yellow-500"
                          : request.status === "funded"
                            ? "text-emerald-400 border-emerald-500"
                            : "text-gray-400 border-gray-500"
                      }
                    >
                      {request.status === "pending"
                        ? "Pendiente"
                        : request.status === "funded"
                          ? "Financiado"
                          : "Completado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleFundLoan(request.id)}
                      disabled={request.status !== "pending" || isLoading}
                      className={
                        request.status === "pending"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : request.status === "pending" ? (
                        "Financiar"
                      ) : (
                        "Financiado"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {loanRequests.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No hay solicitudes disponibles</h3>
            <p className="text-gray-500">Las nuevas solicitudes de préstamo aparecerán aquí</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
