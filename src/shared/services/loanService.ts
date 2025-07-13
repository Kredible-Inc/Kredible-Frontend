import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import { firebaseDB } from "@/shared/config/firebase";
import { LoanRequest, LendingOffer, LendingTransaction, BorrowingTransaction } from "@/shared/types/user.types";

export class LoanService {
  private static readonly LOAN_REQUESTS_COLLECTION = "loanRequests";
  private static readonly LENDING_OFFERS_COLLECTION = "lendingOffers";
  private static readonly LENDING_TRANSACTIONS_COLLECTION = "lendingTransactions";
  private static readonly BORROWING_TRANSACTIONS_COLLECTION = "borrowingTransactions";

  /**
   * Create a new loan request
   */
  static async createLoanRequest(loanRequest: Omit<LoanRequest, 'id'>): Promise<LoanRequest> {
    try {
      const requestsRef = collection(firebaseDB, this.LOAN_REQUESTS_COLLECTION);
      const docRef = await addDoc(requestsRef, loanRequest);
      
      const requestWithId = { ...loanRequest, id: docRef.id };
      
      // Update the document with the ID
      await updateDoc(doc(firebaseDB, this.LOAN_REQUESTS_COLLECTION, docRef.id), { id: docRef.id });
      
      return requestWithId;
    } catch (error) {
      console.error("Error creating loan request:", error);
      throw error;
    }
  }

  /**
   * Get loan request by ID
   */
  static async getLoanRequest(requestId: string): Promise<LoanRequest | null> {
    try {
      const requestRef = doc(firebaseDB, this.LOAN_REQUESTS_COLLECTION, requestId);
      const requestSnap = await getDoc(requestRef);

      if (requestSnap.exists()) {
        return requestSnap.data() as LoanRequest;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting loan request:", error);
      return null;
    }
  }

  /**
   * Get all open loan requests
   */
  static async getOpenLoanRequests(limitCount: number = 20): Promise<LoanRequest[]> {
    try {
      const requestsRef = collection(firebaseDB, this.LOAN_REQUESTS_COLLECTION);
      const q = query(
        requestsRef, 
        where("status", "==", "open"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => doc.data() as LoanRequest);
    } catch (error) {
      console.error("Error getting open loan requests:", error);
      return [];
    }
  }

  /**
   * Get loan requests by borrower
   */
  static async getLoanRequestsByBorrower(borrowerAddress: string): Promise<LoanRequest[]> {
    try {
      const requestsRef = collection(firebaseDB, this.LOAN_REQUESTS_COLLECTION);
      const q = query(
        requestsRef, 
        where("borrowerAddress", "==", borrowerAddress),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => doc.data() as LoanRequest);
    } catch (error) {
      console.error("Error getting loan requests by borrower:", error);
      return [];
    }
  }

  /**
   * Update loan request status
   */
  static async updateLoanRequestStatus(requestId: string, status: 'open' | 'matched' | 'cancelled'): Promise<void> {
    try {
      const requestRef = doc(firebaseDB, this.LOAN_REQUESTS_COLLECTION, requestId);
      await updateDoc(requestRef, { status });
    } catch (error) {
      console.error("Error updating loan request status:", error);
      throw error;
    }
  }

  /**
   * Delete loan request
   */
  static async deleteLoanRequest(requestId: string): Promise<void> {
    try {
      const requestRef = doc(firebaseDB, this.LOAN_REQUESTS_COLLECTION, requestId);
      await deleteDoc(requestRef);
    } catch (error) {
      console.error("Error deleting loan request:", error);
      throw error;
    }
  }

  /**
   * Create a new lending offer
   */
  static async createLendingOffer(lendingOffer: Omit<LendingOffer, 'id'>): Promise<LendingOffer> {
    try {
      const offersRef = collection(firebaseDB, this.LENDING_OFFERS_COLLECTION);
      const docRef = await addDoc(offersRef, lendingOffer);
      
      const offerWithId = { ...lendingOffer, id: docRef.id };
      
      // Update the document with the ID
      await updateDoc(doc(firebaseDB, this.LENDING_OFFERS_COLLECTION, docRef.id), { id: docRef.id });
      
      return offerWithId;
    } catch (error) {
      console.error("Error creating lending offer:", error);
      throw error;
    }
  }

  /**
   * Get lending offer by ID
   */
  static async getLendingOffer(offerId: string): Promise<LendingOffer | null> {
    try {
      const offerRef = doc(firebaseDB, this.LENDING_OFFERS_COLLECTION, offerId);
      const offerSnap = await getDoc(offerRef);

      if (offerSnap.exists()) {
        return offerSnap.data() as LendingOffer;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting lending offer:", error);
      return null;
    }
  }

  /**
   * Get all active lending offers
   */
  static async getActiveLendingOffers(limitCount: number = 20): Promise<LendingOffer[]> {
    try {
      const offersRef = collection(firebaseDB, this.LENDING_OFFERS_COLLECTION);
      const q = query(
        offersRef, 
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => doc.data() as LendingOffer);
    } catch (error) {
      console.error("Error getting active lending offers:", error);
      return [];
    }
  }

  /**
   * Get lending offers by lender
   */
  static async getLendingOffersByLender(lenderAddress: string): Promise<LendingOffer[]> {
    try {
      const offersRef = collection(firebaseDB, this.LENDING_OFFERS_COLLECTION);
      const q = query(
        offersRef, 
        where("lenderAddress", "==", lenderAddress),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => doc.data() as LendingOffer);
    } catch (error) {
      console.error("Error getting lending offers by lender:", error);
      return [];
    }
  }

  /**
   * Update lending offer status
   */
  static async updateLendingOfferStatus(offerId: string, status: 'active' | 'inactive'): Promise<void> {
    try {
      const offerRef = doc(firebaseDB, this.LENDING_OFFERS_COLLECTION, offerId);
      await updateDoc(offerRef, { status });
    } catch (error) {
      console.error("Error updating lending offer status:", error);
      throw error;
    }
  }

  /**
   * Create a lending transaction
   */
  static async createLendingTransaction(transaction: Omit<LendingTransaction, 'id'>): Promise<LendingTransaction> {
    try {
      const transactionsRef = collection(firebaseDB, this.LENDING_TRANSACTIONS_COLLECTION);
      const docRef = await addDoc(transactionsRef, transaction);
      
      const transactionWithId = { ...transaction, id: docRef.id };
      
      // Update the document with the ID
      await updateDoc(doc(firebaseDB, this.LENDING_TRANSACTIONS_COLLECTION, docRef.id), { id: docRef.id });
      
      return transactionWithId;
    } catch (error) {
      console.error("Error creating lending transaction:", error);
      throw error;
    }
  }

  /**
   * Create a borrowing transaction
   */
  static async createBorrowingTransaction(transaction: Omit<BorrowingTransaction, 'id'>): Promise<BorrowingTransaction> {
    try {
      const transactionsRef = collection(firebaseDB, this.BORROWING_TRANSACTIONS_COLLECTION);
      const docRef = await addDoc(transactionsRef, transaction);
      
      const transactionWithId = { ...transaction, id: docRef.id };
      
      // Update the document with the ID
      await updateDoc(doc(firebaseDB, this.BORROWING_TRANSACTIONS_COLLECTION, docRef.id), { id: docRef.id });
      
      return transactionWithId;
    } catch (error) {
      console.error("Error creating borrowing transaction:", error);
      throw error;
    }
  }

  /**
   * Get lending transactions by lender
   */
  static async getLendingTransactionsByLender(lenderAddress: string): Promise<LendingTransaction[]> {
    try {
      const transactionsRef = collection(firebaseDB, this.LENDING_TRANSACTIONS_COLLECTION);
      const q = query(
        transactionsRef, 
        where("lenderAddress", "==", lenderAddress),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => doc.data() as LendingTransaction);
    } catch (error) {
      console.error("Error getting lending transactions by lender:", error);
      return [];
    }
  }

  /**
   * Get borrowing transactions by borrower
   */
  static async getBorrowingTransactionsByBorrower(borrowerAddress: string): Promise<BorrowingTransaction[]> {
    try {
      const transactionsRef = collection(firebaseDB, this.BORROWING_TRANSACTIONS_COLLECTION);
      const q = query(
        transactionsRef, 
        where("borrowerAddress", "==", borrowerAddress),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => doc.data() as BorrowingTransaction);
    } catch (error) {
      console.error("Error getting borrowing transactions by borrower:", error);
      return [];
    }
  }

  /**
   * Update transaction status
   */
  static async updateTransactionStatus(
    transactionId: string, 
    status: 'pending' | 'active' | 'completed' | 'defaulted' | 'cancelled',
    type: 'lending' | 'borrowing'
  ): Promise<void> {
    try {
      const collectionName = type === 'lending' ? this.LENDING_TRANSACTIONS_COLLECTION : this.BORROWING_TRANSACTIONS_COLLECTION;
      const transactionRef = doc(firebaseDB, collectionName, transactionId);
      await updateDoc(transactionRef, { status });
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  }

  /**
   * Match loan request with lending offer
   */
  static async matchLoanRequest(
    loanRequestId: string, 
    lendingOfferId: string, 
    amount: number,
    lenderAddress: string,
    borrowerAddress: string
  ): Promise<{ lendingTransaction: LendingTransaction; borrowingTransaction: BorrowingTransaction }> {
    try {
      // Update loan request status
      await this.updateLoanRequestStatus(loanRequestId, 'matched');
      
      // Update lending offer status
      await this.updateLendingOfferStatus(lendingOfferId, 'inactive');
      
      // Create lending transaction
      const lendingTransaction = await this.createLendingTransaction({
        borrowerAddress,
        borrowerName: '', // Will be filled from user data
        amount,
        interestRate: 0, // Will be filled from offer data
        term: 0, // Will be filled from request data
        status: 'pending',
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(), // Will be calculated based on term
        lenderAddress
      });
      
      // Create borrowing transaction
      const borrowingTransaction = await this.createBorrowingTransaction({
        lenderAddress,
        lenderName: '', // Will be filled from user data
        amount,
        interestRate: 0, // Will be filled from offer data
        term: 0, // Will be filled from request data
        status: 'pending',
        createdAt: new Date().toISOString(),
        dueDate: new Date().toISOString(), // Will be calculated based on term
        borrowerAddress
      });
      
      return { lendingTransaction, borrowingTransaction };
    } catch (error) {
      console.error("Error matching loan request:", error);
      throw error;
    }
  }
} 