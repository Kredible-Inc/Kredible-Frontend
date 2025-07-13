import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { firebaseDB } from "@/shared/config/firebase";
import { useAuthStore } from "@/shared/stores/authStore";

interface User {
  walletAddress: string;
  email?: string;
  name?: string;
  createdAt?: string;
  [key: string]: any;
}

// Variable global para almacenar la función resolve
let resolveUserInfo: ((value: { name: string; email: string }) => void) | null = null;

// Este puede ejecutarse después de conectar la wallet
export const handleWalletAuth = async (walletAddress: string) => {
  try {
    const usersRef = collection(firebaseDB, "users");
    const q = query(usersRef, where("walletAddress", "==", walletAddress));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // Usuario existe, hacer login
      const userData = snapshot.docs[0].data() as User;
      useAuthStore.getState().login(userData);
      return { success: true, isNewUser: false, user: userData };
    }

    // Si no existe, abrir formulario modal para pedir nombre y correo
    const { name, email } = await promptUserForInfo();

    const newUser: User = {
      walletAddress,
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    await addDoc(usersRef, newUser);

    useAuthStore.getState().login(newUser);
    return { success: true, isNewUser: true, user: newUser };
  } catch (error) {
    console.error("Error in handleWalletAuth:", error);
    throw error;
  }
};

// Función para obtener información del usuario (modal)
export const promptUserForInfo = (): Promise<{ name: string; email: string }> => {
  return new Promise((resolve) => {
    // Guardar la función resolve
    resolveUserInfo = resolve;
    
    // Crear un evento personalizado para abrir el modal
    const event = new CustomEvent('openUserInfoModal');
    window.dispatchEvent(event);
  });
};

// Función para resolver la promesa cuando se envía el formulario
export const resolveUserInfoPromise = (userData: { name: string; email: string }) => {
  if (resolveUserInfo) {
    resolveUserInfo(userData);
    resolveUserInfo = null;
  }
}; 