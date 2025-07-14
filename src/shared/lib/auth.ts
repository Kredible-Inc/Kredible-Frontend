import { useAuthStore } from "@/shared/stores/authStore";
import { useUserStore } from "@/shared/stores/userStore";
import { User } from "@/shared/types/user.types";
import { UserService } from "@/shared/services/userService";

// Global variable to store the resolve function
let resolveUserInfo: ((value: { name: string; email: string }) => void) | null =
  null;

// This can be executed after connecting the wallet
export const handleWalletAuth = async (walletAddress: string) => {
  try {
    // Check if user exists
    const existingUser =
      await UserService.getUserByWalletAddress(walletAddress);

    if (existingUser) {
      // User exists, do login
      useAuthStore.getState().login(existingUser);
      useUserStore.getState().setUser(existingUser);
      
      return { success: true, isNewUser: false, user: existingUser };
    }

    // Si no existe, abrir formulario modal para pedir nombre y correo
    const { name, email } = await promptUserForInfo();

    const newUser: Omit<User, "id"> = {
      walletAddress,
      name,
      email,
      createdAt: new Date().toISOString(),
      userRole: "borrower", // Default role
      lendingHistory: [],
      borrowingHistory: [],
      totalLent: 0,
      totalBorrowed: 0,
      reputation: 0,
    };

    // Create user using UserService
    const userWithId = await UserService.createUser(newUser);

    // Actualizar stores
    useAuthStore.getState().login(userWithId);
    useUserStore.getState().setUser(userWithId);
    
    return { success: true, isNewUser: true, user: userWithId };
  } catch (error) {
    console.error("Error in handleWalletAuth:", error);
    throw error;
  }
};

// Function to get user information (modal)
export const promptUserForInfo = (): Promise<{
  name: string;
  email: string;
}> => {
  return new Promise((resolve) => {
    // Save the resolve function
    resolveUserInfo = resolve;

    // Crear un evento personalizado para abrir el modal
    const event = new CustomEvent("openUserInfoModal");
    window.dispatchEvent(event);
  });
};

// Function to resolve the promise when the form is submitted
export const resolveUserInfoPromise = (userData: {
  name: string;
  email: string;
}) => {
  if (resolveUserInfo) {
    resolveUserInfo(userData);
    resolveUserInfo = null;
  }
};

// Function to update user data in Firestore
export const updateUserInFirestore = async (
  userId: string,
  updates: Partial<User>,
) => {
  try {
    await UserService.updateUser(userId, updates);
    
    // Actualizar el store local
    const currentUser = useAuthStore.getState().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      useAuthStore.getState().login(updatedUser);
      useUserStore.getState().setUser(updatedUser);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
    throw error;
  }
};

// Function to get user by wallet address
export const getUserByWalletAddress = async (
  walletAddress: string,
): Promise<User | null> => {
  try {
    return await UserService.getUserByWalletAddress(walletAddress);
  } catch (error) {
    console.error("Error getting user by wallet address:", error);
    return null;
  }
};
 