"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Loader2, Calendar } from "lucide-react"
import { formatCurrency, formatPercentage } from "@/shared/utils/credit"
import { useLending } from "@/shared/contexts/lending-context"
import type { MyLoan } from "@/shared/types/lending"

interface MyLoansTableProps {
  addToast: (message: string, type: "success" | "error" | "info") => void
}

export function MyLoansTable({ addToast }: MyLoansTableProps) {
  const { user, isLoading } = useLending()

  // Datos simulados de mis préstamos
  const myLoans: MyLoan[] = [
    {
      id: "ml1",
      type: "borrowed",
      counterparty: "GDEF...X9Y2",
      amountUSDC: 1500,
      apr: 7.0,
      duration: 30,
      startDate: new Date("2024-01-10"),
      dueDate: new Date("2024-02-09"),
      status: "active",
      collateralXLM: 17857.14,
      interestOwed: 8.75,
    },
    {
      id: "ml2",
      type: "lent",
      counterparty: "GHIJ...A1B2",
      amountUSDC: 2000,
      apr: 6.5,
      duration: 45,
      startDate: new Date("2024-01-05"),
      dueDate: new Date("2024-02-19"),
      status: "active",
      interestEarned: 16.03,
    },
    {
      id: "ml3",
      type: "borrowed",
      counterparty: "GKLM...C3D4",
      amountUSDC: 800,
      apr: 8.0,
      duration: 15,
      startDate: new Date("2023-12-20"),
      dueDate: new Date("2024-01-04"),
      status: "repaid",
      collateralXLM: 11111.11,
      interestOwed: 2.63,
    },
    {
      id: "ml4",
      type: "lent",
      counterparty: "GNOP...E5F6",
      amountUSDC: 3000,
      apr: 7.5,
      duration: 60,
      startDate: new Date("2023-12-15"),
      dueDate: new Date("2024-02-13"),
      status: "repaid",
      interestEarned: 37.5,
    },
  ]

  const borrowedLoans = myLoans.filter((loan) => loan.type === "borrowed")
  const lentLoans = myLoans.filter((loan) => loan.type === "lent")

  const handleRepayLoan = async (loanId: string) => {
    try {
      // Simular repago
      await new Promise((resolve) => setTimeout(resolve, 1500))
      addToast("Préstamo repagado exitosamente", "success")
    } catch (error) {
      addToast("Error al repagar el préstamo", "error")
    }
  }

  const handleCollectPayment = async (loanId: string) => {
    try {
      // Simular cobro
      await new Promise((resolve) => setTimeout(resolve, 1500))
      addToast("Pago recibido exitosamente", "success")
    } catch (error) {
      addToast("Error al procesar el pago", "error")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="text-emerald-400 border-emerald-500">Activo</Badge>
      case "repaid":
        return <Badge className="text-blue-400 border-blue-500">Repagado</Badge>
      case "overdue":
        return <Badge className="text-red-400 border-red-500">Vencido</Badge>
      case "defaulted":
        return <Badge className="text-red-400 border-red-500">Default</Badge>
      default:
        return <Badge className="text-gray-400 border-gray-500">Desconocido</Badge>
    }
  }

  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card className="bg-blue-900/20 border-blue-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          Mis Préstamos
        </CardTitle>
        <CardDescription className="text-gray-400">
          Gestiona tus préstamos activos y revisa tu historial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="borrowed" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-blue-950/30 border-blue-500/30">
            <TabsTrigger
              value="borrowed"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              <TrendingDown className="h-4 w-4" />
              Préstamos Tomados ({borrowedLoans.length})
            </TabsTrigger>
            <TabsTrigger
              value="lent"
              className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
            >
              <TrendingUp className="h-4 w-4" />
              Préstamos Otorgados ({lentLoans.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="borrowed">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-500/30">
                  <TableHead className="text-gray-300">Lender</TableHead>
                  <TableHead className="text-gray-300">Cantidad</TableHead>
                  <TableHead className="text-gray-300">APR</TableHead>
                  <TableHead className="text-gray-300">Colateral</TableHead>
                  <TableHead className="text-gray-300">Vencimiento</TableHead>
                  <TableHead className="text-gray-300">Interés Adeudado</TableHead>
                  <TableHead className="text-gray-300">Estado</TableHead>
                  <TableHead className="text-gray-300">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedLoans.map((loan) => {
                  const daysRemaining = getDaysRemaining(loan.dueDate)
                  return (
                    <TableRow key={loan.id} className="border-blue-500/30">
                      <TableCell className="font-mono text-sm text-gray-300">{loan.counterparty}</TableCell>
                      <TableCell className="font-semibold text-white">{formatCurrency(loan.amountUSDC)}</TableCell>
                      <TableCell className="text-emerald-400">{formatPercentage(loan.apr)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-white">{loan.collateralXLM?.toFixed(2)} XLM</div>
                          <div className="text-sm text-gray-400">~${((loan.collateralXLM || 0) * 0.12).toFixed(2)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-blue-400" />
                          <div>
                            <div className="text-gray-300">{loan.dueDate.toLocaleDateString()}</div>
                            {loan.status === "active" && (
                              <div
                                className={`text-xs ${
                                  daysRemaining < 0
                                    ? "text-red-400"
                                    : daysRemaining < 7
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                                }`}
                              >
                                {daysRemaining < 0
                                  ? `${Math.abs(daysRemaining)} días vencido`
                                  : `${daysRemaining} días`}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-red-400 font-semibold">
                        ${loan.interestOwed?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell>
                        {loan.status === "active" ? (
                          <Button
                            size="sm"
                            onClick={() => handleRepayLoan(loan.id)}
                            disabled={isLoading}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Repagar"}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">Completado</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="lent">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-500/30">
                  <TableHead className="text-gray-300">Borrower</TableHead>
                  <TableHead className="text-gray-300">Cantidad</TableHead>
                  <TableHead className="text-gray-300">APR</TableHead>
                  <TableHead className="text-gray-300">Vencimiento</TableHead>
                  <TableHead className="text-gray-300">Interés Ganado</TableHead>
                  <TableHead className="text-gray-300">Estado</TableHead>
                  <TableHead className="text-gray-300">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lentLoans.map((loan) => {
                  const daysRemaining = getDaysRemaining(loan.dueDate)
                  return (
                    <TableRow key={loan.id} className="border-blue-500/30">
                      <TableCell className="font-mono text-sm text-gray-300">{loan.counterparty}</TableCell>
                      <TableCell className="font-semibold text-white">{formatCurrency(loan.amountUSDC)}</TableCell>
                      <TableCell className="text-emerald-400">{formatPercentage(loan.apr)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-blue-400" />
                          <div>
                            <div className="text-gray-300">{loan.dueDate.toLocaleDateString()}</div>
                            {loan.status === "active" && (
                              <div
                                className={`text-xs ${
                                  daysRemaining < 0
                                    ? "text-red-400"
                                    : daysRemaining < 7
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                                }`}
                              >
                                {daysRemaining < 0
                                  ? `${Math.abs(daysRemaining)} días vencido`
                                  : `${daysRemaining} días`}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-emerald-400 font-semibold">
                        +${loan.interestEarned?.toFixed(2) || "0.00"}
                      </TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell>
                        {loan.status === "active" ? (
                          <Button
                            size="sm"
                            onClick={() => handleCollectPayment(loan.id)}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Monitorear"}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">Completado</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
