import { useLending } from "@/shared/contexts/lending-context";
import { CheckCircle, Flame } from "lucide-react";
import jsPDF from "jspdf";
import type { MyLoan } from "@/shared/types/lending";

export function LendingHistoryVisual() {
  const { lendingHistory } = useLending();
  const completedLendings = lendingHistory.filter(
    (loan) => loan.type === "lent" && loan.status === "repaid",
  );

  if (completedLendings.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-gray-500">
        <Flame className="w-10 h-10 mb-2 text-gray-700" />
        <div className="text-lg font-semibold">No completed lendings yet</div>
        <div className="text-sm">
          Your paid-off lendings will appear here as a badge of honor!
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {completedLendings.map((loan) => (
        <div
          key={loan.id}
          className="flex items-center gap-4 bg-gradient-to-r from-gray-900/60 to-gray-800/40 border border-gray-700 rounded-lg p-4 opacity-60 shadow-inner"
        >
          <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-lg font-bold text-white">
              ${loan.amountUSDC.toLocaleString()} USDC
            </div>
            <div className="text-sm text-gray-300">
              Borrower: <span className="font-mono">{loan.counterparty}</span>
            </div>
            <div className="text-xs text-gray-400">
              Paid off on: {new Date(loan.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function downloadLendingHistoryPDF(lendingHistory: MyLoan[]) {
  const doc = new jsPDF();
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.text("Completed Lending History", 14, 18);
  doc.setFontSize(12);
  let y = 30;
  lendingHistory.forEach((loan, idx) => {
    doc.text(`Lending #${idx + 1}`, 14, y);
    y += 8;
    doc.text(`Amount: $${loan.amountUSDC} USDC`, 14, y);
    y += 8;
    doc.text(`Borrower: ${loan.counterparty}`, 14, y);
    y += 8;
    doc.text(
      `Paid off on: ${new Date(loan.dueDate).toLocaleDateString()}`,
      14,
      y,
    );
    y += 8;
    doc.text(`APR: ${loan.apr}%`, 14, y);
    y += 8;
    doc.text(`Interest Earned: $${loan.interestEarned ?? 0}`, 14, y);
    y += 12;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });
  doc.save("lending-history.pdf");
}
