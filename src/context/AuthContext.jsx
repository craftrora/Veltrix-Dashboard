import { useState, useCallback } from "react";
import { AuthContext } from "./auth-context";

const STORAGE_KEY = "veltrix.session";

function readStoredSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readStoredSession());

  const login = useCallback(({ email }) => {
    const next = {
      email,
      name: email.split("@")[0].replace(/[._]/g, " "),
      role: null,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return next;
  }, []);

  const selectRole = useCallback((role) => {
    setSession((prev) => {
      const next = { ...(prev ?? {}), role };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, selectRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
