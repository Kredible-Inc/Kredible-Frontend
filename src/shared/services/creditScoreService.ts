import { CreditScore, CreditFactor } from "@/shared/types/user.types";
import { UserService } from "./userService";
import { LoanService } from "./loanService";
import { User } from "@/shared/types/user.types";

export class CreditScoreService {
  private static readonly MAX_CREDIT_SCORE = 850;
  private static readonly MIN_CREDIT_SCORE = 300;

  /**
   * Calculate credit score for a user
   */
  static async calculateCreditScore(userId: string): Promise<CreditScore> {
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const factors: CreditFactor[] = [];
      let totalScore = 0;

      // Factor 1: Payment History (35% of score)
      const paymentHistoryScore = await this.calculatePaymentHistoryScore(
        user.walletAddress,
      );
      factors.push({
        name: "Payment History",
        impact: paymentHistoryScore >= 0 ? "positive" : "negative",
        description: "Based on completed loan payments",
        value: paymentHistoryScore,
      });
      totalScore += paymentHistoryScore * 0.35;

      // Factor 2: Credit Utilization (30% of score)
      const utilizationScore = this.calculateCreditUtilizationScore(user);
      factors.push({
        name: "Credit Utilization",
        impact: utilizationScore >= 0 ? "positive" : "negative",
        description: "Based on current borrowing vs total borrowed",
        value: utilizationScore,
      });
      totalScore += utilizationScore * 0.3;

      // Factor 3: Length of Credit History (15% of score)
      const historyScore = this.calculateCreditHistoryScore(user);
      factors.push({
        name: "Credit History Length",
        impact: historyScore >= 0 ? "positive" : "neutral",
        description: "Based on time since first loan",
        value: historyScore,
      });
      totalScore += historyScore * 0.15;

      // Factor 4: Credit Mix (10% of score)
      const mixScore = this.calculateCreditMixScore(user);
      factors.push({
        name: "Credit Mix",
        impact: mixScore >= 0 ? "positive" : "neutral",
        description: "Based on variety of loan types",
        value: mixScore,
      });
      totalScore += mixScore * 0.1;

      // Factor 5: New Credit (10% of score)
      const newCreditScore = await this.calculateNewCreditScore(
        user.walletAddress,
      );
      factors.push({
        name: "New Credit",
        impact: newCreditScore >= 0 ? "positive" : "negative",
        description: "Based on recent loan applications",
        value: newCreditScore,
      });
      totalScore += newCreditScore * 0.1;

      // Normalize score to 300-850 range
      const normalizedScore = Math.max(
        this.MIN_CREDIT_SCORE,
        Math.min(this.MAX_CREDIT_SCORE, Math.round(totalScore + 500)),
      );

      const creditScore: CreditScore = {
        score: normalizedScore,
        maxScore: this.MAX_CREDIT_SCORE,
        factors,
        lastUpdated: new Date().toISOString(),
      };

      // Update user's credit score
      await UserService.updateCreditScore(userId, creditScore);

      return creditScore;
    } catch (error) {
      console.error("Error calculating credit score:", error);
      throw error;
    }
  }

  /**
   * Calculate payment history score
   */
  private static async calculatePaymentHistoryScore(
    walletAddress: string,
  ): Promise<number> {
    try {
      const borrowingTransactions =
        await LoanService.getBorrowingTransactionsByBorrower(walletAddress);

      if (borrowingTransactions.length === 0) {
        return 0; // No credit history
      }

      const completedTransactions = borrowingTransactions.filter(
        (t) => t.status === "completed",
      );
      const defaultedTransactions = borrowingTransactions.filter(
        (t) => t.status === "defaulted",
      );

      const totalTransactions = borrowingTransactions.length;
      const completedRatio = completedTransactions.length / totalTransactions;
      const defaultedRatio = defaultedTransactions.length / totalTransactions;

      // Score based on completion rate and default rate
      const score = completedRatio * 100 - defaultedRatio * 200;

      return Math.max(-100, Math.min(100, score));
    } catch (error) {
      console.error("Error calculating payment history score:", error);
      return 0;
    }
  }

  /**
   * Calculate credit utilization score
   */
  private static calculateCreditUtilizationScore(user: User): number {
    const totalBorrowed = user.totalBorrowed || 0;
    const totalLent = user.totalLent || 0;

    if (totalBorrowed === 0) {
      return 50; // Neutral score for no borrowing
    }

    // Calculate utilization ratio (simplified)
    const utilizationRatio = totalBorrowed / (totalBorrowed + totalLent);

    // Lower utilization is better
    if (utilizationRatio <= 0.3) {
      return 100; // Excellent
    } else if (utilizationRatio <= 0.5) {
      return 50; // Good
    } else if (utilizationRatio <= 0.7) {
      return 0; // Fair
    } else {
      return -50; // Poor
    }
  }

  /**
   * Calculate credit history length score
   */
  private static calculateCreditHistoryScore(user: User): number {
    if (!user.createdAt) {
      return 0;
    }

    const createdAt = new Date(user.createdAt);
    const now = new Date();
    const monthsSinceCreation =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsSinceCreation >= 60) {
      return 100; // 5+ years
    } else if (monthsSinceCreation >= 36) {
      return 75; // 3-5 years
    } else if (monthsSinceCreation >= 24) {
      return 50; // 2-3 years
    } else if (monthsSinceCreation >= 12) {
      return 25; // 1-2 years
    } else {
      return 0; // Less than 1 year
    }
  }

  /**
   * Calculate credit mix score
   */
  private static calculateCreditMixScore(user: User): number {
    const lendingHistory = user.lendingHistory || [];
    const borrowingHistory = user.borrowingHistory || [];

    const hasLending = lendingHistory.length > 0;
    const hasBorrowing = borrowingHistory.length > 0;

    if (hasLending && hasBorrowing) {
      return 100; // Both lending and borrowing
    } else if (hasLending || hasBorrowing) {
      return 50; // One type only
    } else {
      return 0; // No credit history
    }
  }

  /**
   * Calculate new credit score
   */
  private static async calculateNewCreditScore(
    walletAddress: string,
  ): Promise<number> {
    try {
      const loanRequests =
        await LoanService.getLoanRequestsByBorrower(walletAddress);

      // Get requests from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentRequests = loanRequests.filter(
        (request) => new Date(request.createdAt) > sixMonthsAgo,
      );

      if (recentRequests.length === 0) {
        return 50; // No recent applications
      } else if (recentRequests.length === 1) {
        return 25; // One recent application
      } else if (recentRequests.length <= 3) {
        return 0; // 2-3 recent applications
      } else {
        return -50; // Too many recent applications
      }
    } catch (error) {
      console.error("Error calculating new credit score:", error);
      return 0;
    }
  }

  /**
   * Get credit score for a user
   */
  static async getCreditScore(userId: string): Promise<CreditScore | null> {
    try {
      const user = await UserService.getUserById(userId);
      if (!user || !user.creditScore) {
        return null;
      }

      // If credit score is older than 30 days, recalculate
      const lastUpdate = user.lastCreditScoreUpdate
        ? new Date(user.lastCreditScoreUpdate)
        : null;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (!lastUpdate || lastUpdate < thirtyDaysAgo) {
        return await this.calculateCreditScore(userId);
      }

      // Return existing credit score details
      return (
        user.creditScoreDetails || {
          score: user.creditScore,
          maxScore: this.MAX_CREDIT_SCORE,
          factors: [],
          lastUpdated: user.lastCreditScoreUpdate || new Date().toISOString(),
        }
      );
    } catch (error) {
      console.error("Error getting credit score:", error);
      return null;
    }
  }

  /**
   * Update credit score manually (for testing/admin purposes)
   */
  static async updateCreditScore(userId: string, score: number): Promise<void> {
    try {
      const creditScore: CreditScore = {
        score: Math.max(
          this.MIN_CREDIT_SCORE,
          Math.min(this.MAX_CREDIT_SCORE, score),
        ),
        maxScore: this.MAX_CREDIT_SCORE,
        factors: [
          {
            name: "Manual Update",
            impact: "neutral",
            description: "Credit score updated manually",
            value: 0,
          },
        ],
        lastUpdated: new Date().toISOString(),
      };

      await UserService.updateCreditScore(userId, creditScore);
    } catch (error) {
      console.error("Error updating credit score:", error);
      throw error;
    }
  }

  /**
   * Get credit score range description
   */
  static getCreditScoreRange(score: number): {
    range: string;
    description: string;
    color: string;
  } {
    if (score >= 800) {
      return {
        range: "Excellent",
        description: "Very low risk borrower",
        color: "green",
      };
    } else if (score >= 740) {
      return {
        range: "Very Good",
        description: "Low risk borrower",
        color: "green",
      };
    } else if (score >= 670) {
      return {
        range: "Good",
        description: "Moderate risk borrower",
        color: "yellow",
      };
    } else if (score >= 580) {
      return {
        range: "Fair",
        description: "Higher risk borrower",
        color: "orange",
      };
    } else {
      return {
        range: "Poor",
        description: "High risk borrower",
        color: "red",
      };
    }
  }
}
