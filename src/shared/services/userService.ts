import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  deleteDoc 
} from "firebase/firestore";
import { firebaseDB } from "@/shared/config/firebase";
import { User, CreditScore } from "@/shared/types/user.types";

export class UserService {
  private static readonly COLLECTION_NAME = "users";

  /**
   * Create a new user
   */
  static async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const usersRef = collection(firebaseDB, this.COLLECTION_NAME);
      const docRef = await addDoc(usersRef, userData);
      
      return {
        ...userData,
        id: docRef.id
      } as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Get user by wallet address
   */
  static async getUserByWalletAddress(walletAddress: string): Promise<User | null> {
    try {
      const usersRef = collection(firebaseDB, this.COLLECTION_NAME);
      const q = query(usersRef, where("walletAddress", "==", walletAddress));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs[0].data() as User;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user by wallet address:", error);
      return null;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(firebaseDB, this.COLLECTION_NAME, userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as User;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  /**
   * Update user data
   */
  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(firebaseDB, this.COLLECTION_NAME, userId);
      await updateDoc(userRef, updates);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(firebaseDB, this.COLLECTION_NAME, userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  /**
   * Update user credit score
   */
  static async updateCreditScore(userId: string, creditScore: CreditScore): Promise<void> {
    try {
      const userRef = doc(firebaseDB, this.COLLECTION_NAME, userId);
      await updateDoc(userRef, { 
        creditScore: creditScore.score,
        creditScoreDetails: creditScore,
        lastCreditScoreUpdate: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating credit score:", error);
      throw error;
    }
  }

  /**
   * Get all users (with pagination)
   */
  static async getAllUsers(limit: number = 50): Promise<User[]> {
    try {
      const usersRef = collection(firebaseDB, this.COLLECTION_NAME);
      const q = query(usersRef);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => doc.data() as User).slice(0, limit);
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  /**
   * Search users by name or email
   */
  static async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const usersRef = collection(firebaseDB, this.COLLECTION_NAME);
      const nameQuery = query(usersRef, where("name", ">=", searchTerm), where("name", "<=", searchTerm + "\uf8ff"));
      const emailQuery = query(usersRef, where("email", ">=", searchTerm), where("email", "<=", searchTerm + "\uf8ff"));
      
      const [nameSnapshot, emailSnapshot] = await Promise.all([
        getDocs(nameQuery),
        getDocs(emailQuery)
      ]);

      const users = new Map<string, User>();
      
      nameSnapshot.docs.forEach(doc => {
        const user = doc.data() as User;
        users.set(user.id!, user);
      });
      
      emailSnapshot.docs.forEach(doc => {
        const user = doc.data() as User;
        users.set(user.id!, user);
      });

      return Array.from(users.values());
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }
} 