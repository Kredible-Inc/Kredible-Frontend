export function getCreditTier(score: number): {
  tier: string;
  ltv: number;
  apr: number;
  color: string;
  bgColor: string;
} {
  if (score >= 700)
    return {
      tier: "High",
      ltv: 80,
      apr: 6.0,
      color: "text-blue-300",
      bgColor: "bg-blue-900/40 border-blue-400/40",
    };
  if (score >= 600)
    return {
      tier: "Mid-high",
      ltv: 70,
      apr: 7.0,
      color: "text-blue-400",
      bgColor: "bg-blue-900/30 border-blue-500/30",
    };
  if (score >= 500)
    return {
      tier: "Mid",
      ltv: 60,
      apr: 8.0,
      color: "text-blue-500",
      bgColor: "bg-blue-900/20 border-blue-600/20",
    };
  return {
    tier: "Low",
    ltv: 50,
    apr: 9.0,
    color: "text-blue-700",
    bgColor: "bg-blue-950/30 border-blue-800/30",
  };
}

export function calculateCollateral(
  amountUSDC: number,
  ltv: number,
  xlmPrice: number,
): number {
  return amountUSDC / (ltv / 100) / xlmPrice;
}

export function calculateAPR(score: number): number {
  // APR entre 6% y 9% basado en score 400-800
  const minAPR = 6.0;
  const maxAPR = 9.0;
  const minScore = 400;
  const maxScore = 800;

  // Normalizar score entre 0 y 1
  const normalizedScore = Math.max(
    0,
    Math.min(1, (score - minScore) / (maxScore - minScore)),
  );

  // Invertir para que mejor score = menor APR
  return maxAPR - normalizedScore * (maxAPR - minAPR);
}

export function formatCurrency(amount: number, currency = "USDC"): string {
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
