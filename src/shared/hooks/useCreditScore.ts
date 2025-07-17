import { useQuery } from "@tanstack/react-query";
import { fetchCreditScore } from "../lib/baseApi";

export function useCreditScore(walletAddress: string) {
  return useQuery({
    queryKey: ["creditScore", walletAddress],
    queryFn: () =>
      walletAddress ? fetchCreditScore(walletAddress) : Promise.resolve(null),
    enabled: !!walletAddress,
  });
}
