import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  name: string;
  email: string;
  id: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (params: { email: string; password: string }) => Promise<AuthResult>;
  signup: (params: {
    name: string;
    email: string;
    password: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "@auth_user";
const USERS_STORAGE_KEY = "@auth_users";

interface StoredUser {
  name: string;
  email: string;
  password: string;
  id: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStoredUsers = async (): Promise<StoredUser[]> => {
    try {
      const users = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error getting stored users:", error);
      return [];
    }
  };

  const saveStoredUsers = async (users: StoredUser[]) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      // Validate input
      if (!email || !password) {
        return {
          success: false,
          error: "Email and password are required",
        };
      }

      // Get stored users
      const users = await getStoredUsers();

      // Find user with matching credentials
      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (!foundUser) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      // Create user object without password
      const loggedInUser: User = {
        name: foundUser.name,
        email: foundUser.email,
        id: foundUser.id,
      };

      // Save to state and AsyncStorage
      setUser(loggedInUser);
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(loggedInUser),
      );

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "An unexpected error occurred during login",
      };
    }
  };

  const signup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      // Validate input
      if (!name || !email || !password) {
        return {
          success: false,
          error: "Name, email, and password are required",
        };
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          error: "Invalid email format",
        };
      }

      // Password validation (minimum 6 characters)
      if (password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      // Get stored users
      const users = await getStoredUsers();

      // Check if user already exists
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        };
      }

      // Create new user
      const newUser: StoredUser = {
        name,
        email,
        password,
        id: Date.now().toString(), // Simple ID generation
      };

      // Save to users list
      users.push(newUser);
      await saveStoredUsers(users);

      // Create user object without password
      const loggedInUser: User = {
        name: newUser.name,
        email: newUser.email,
        id: newUser.id,
      };

      // Automatically log in the user
      setUser(loggedInUser);
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(loggedInUser),
      );

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: "An unexpected error occurred during signup",
      };
    }
  };

  const logout = async (): Promise<AuthResult> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: "An unexpected error occurred during logout",
      };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
