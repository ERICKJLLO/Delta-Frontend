import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar la sesion solo si el backend confirma que el token es valido.
  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      if (!api.getToken()) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await api.getMe();
        if (mounted) {
          setUser(data?.user ?? null);
        }
      } catch {
        api.logout();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(email, password) {
    try {
      const data = await api.login(email.trim().toLowerCase(), password);
      setUser(data?.user ?? null);

      if (!data?.user) {
        api.logout();
        return {
          success: false,
          error: "El servidor no devolvio los datos del usuario.",
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function register(userData) {
    try {
      const data = await api.register(userData);

      if (!data?.user) {
        api.logout();
        return {
          success: false,
          error: "El servidor no devolvio los datos de la cuenta.",
        };
      }

      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  function loginWithToken(token, userData) {
    if (!token || !userData) {
      setUser(null);
      return;
    }

    localStorage.setItem("delta_token", token);
    setUser(userData);
  }

  function logout() {
    api.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithToken,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return ctx;
}




