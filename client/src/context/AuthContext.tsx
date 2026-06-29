import { createContext, useEffect, useState } from "react";
import type { User } from "../types/auth";

type AuthState = {
  user: User | null;
  token: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialAuth(): AuthState {
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get("token");

  if (urlToken) {
    const payload = JSON.parse(atob(urlToken.split(".")[1]));
    const discordUser: User = {
      discordId: payload.discordId,
      username: payload.username,
      avatar: payload.avatar,
    };
    localStorage.setItem("karen_token", urlToken);
    localStorage.setItem("karen_user", JSON.stringify(discordUser));
    return { token: urlToken, user: discordUser };
  }

  const savedToken = localStorage.getItem("karen_token");
  const savedUser = localStorage.getItem("karen_user");

  if (savedToken && savedUser) {
    return { token: savedToken, user: JSON.parse(savedUser) };
  }

  return { token: null, user: null };
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(getInitialAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token")) {
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  function logout() {
    localStorage.removeItem("karen_token");
    localStorage.removeItem("karen_user");
    setAuth({ token: null, user: null });
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        isAuthenticated: !!auth.token,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;
