import {
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { getMe, logout as logoutRequest } from "../service/Auth";

export interface UserDef {
  id: string;
  email: string;
  role: "admin" | "customer";
}

interface AuthContextType {
  user: UserDef | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDef | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await getMe();

      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // Clear local auth state even if the server cookie could not be cleared.
    }

    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
