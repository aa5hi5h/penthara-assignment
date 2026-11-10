import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AuthService from "@/services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(AuthService.hasToken());

  const refreshUser = useCallback(async () => {
    try {
      setUser(await AuthService.getCurrentUser());
    } catch {
      AuthService.logout();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!AuthService.hasToken()) {
      return;
    }
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    const signedIn = await AuthService.login(email, password);
    setUser(signedIn);
    return signedIn;
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshUser }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
