export function getCreditTier(score: number): {
  tier: string;
  ltv: number;
  apr: number;
  color: string;
  bgColor: string;
} {
  if (score >= 700)
    return {
      tier: "Alto",
      ltv: 80,
      apr: 6.0,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/20 border-emerald-500/30",
    };
  if (score >= 600)
    return {
      tier: "Medio-Alto",
      ltv: 70,
      apr: 7.0,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20 border-blue-500/30",
    };
  if (score >= 500)
    return {
      tier: "Medio",
      ltv: 60,
      apr: 8.0,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/20 border-yellow-500/30",
    };
  return {
    tier: "Bajo",
    ltv: 50,
    apr: 9.0,
    color: "text-red-400",
    bgColor: "bg-red-900/20 border-red-500/30",
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
