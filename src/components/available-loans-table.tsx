"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, DollarSign, Percent, Loader2 } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/shared/utils/credit"
import { useLending } from "@/shared/contexts/lending-context"

interface AvailableLoansTableProps {
  addToast: (message: string, type: "success" | "error" | "info") => void
}

export function AvailableLoansTable({ addToast }: AvailableLoansTableProps) {
  const { user, availableLoans, takeLoan, isLoading } = useLending()

  const handleTakeLoan = async (loanId: string) => {
    try {
      await takeLoan(loanId)
      addToast("Préstamo tomado exitosamente", "success")
    } catch (error) {
      addToast("Error al tomar el préstamo", "error")
    }
  }

  const canTakeLoan = (loan: any) => {
    return user.creditScore >= loan.minCreditScore && loan.status === "available"
  }

  return (
    <Card className="bg-blue-900/20 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-400" />
          Préstamos Disponibles
        </CardTitle>
        <CardDescription className="text-gray-400">
          Préstamos ofrecidos por otros usuarios que puedes tomar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-blue-500/30">
              <TableHead className="text-gray-300">Lender</TableHead>
              <TableHead className="text-gray-300">Cantidad</TableHead>
              <TableHead className="text-gray-300">APR</TableHead>
              <TableHead className="text-gray-300">Duración</TableHead>
              <TableHead className="text-gray-300">Score Mín.</TableHead>
              <TableHead className="text-gray-300">LTV Máx.</TableHead>
              <TableHead className="text-gray-300">Estado</TableHead>
              <TableHead className="text-gray-300">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availableLoans.map((loan) => {
              const eligible = canTakeLoan(loan)
              return (
                <TableRow key={loan.id} className="border-blue-500/30">
                  <TableCell className="font-mono text-sm text-gray-300">{loan.lender}</TableCell>
                  <TableCell className="font-semibold text-white">{formatCurrency(loan.amountUSDC)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">{formatPercentage(loan.apr)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-300">{loan.duration} días</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={eligible ? "text-emerald-400 border-emerald-500" : "text-red-400 border-red-500"}
                    >
                      {loan.minCreditScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-blue-400 border-blue-500">
                      {loan.maxLTV}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        loan.status === "available"
                          ? "text-emerald-400 border-emerald-500"
                          : "text-gray-400 border-gray-500"
                      }
                    >
                      {loan.status === "available" ? "Disponible" : "Tomado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleTakeLoan(loan.id)}
                      disabled={!eligible || isLoading || loan.status !== "available"}
                      className={
                        eligible && loan.status === "available"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : eligible && loan.status === "available" ? (
                        "Tomar"
                      ) : loan.status !== "available" ? (
                        "No disponible"
                      ) : (
                        "No elegible"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
