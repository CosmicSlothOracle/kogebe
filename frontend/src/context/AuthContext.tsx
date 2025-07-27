import React, { createContext, useContext, useEffect, useState } from 'react';
import netlifyIdentity from "netlify-identity-widget";

interface AuthState {
  token: string | null;
  user: string | null;
}

interface AuthContextValue extends AuthState {
  login: () => Promise<boolean>;
  logout: () => void;
}

const defaultCtx: AuthContextValue = {
  token: null,
  user: null,
  login: async () => false,
  logout: () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultCtx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt'));
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('user'));

  useEffect(() => {
    // Initialize Netlify Identity with proper configuration
    netlifyIdentity.init({
      APIUrl: `${window.location.origin}/.netlify/identity`
    });

    // Check for existing user on mount
    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser(currentUser.user_metadata?.full_name || currentUser.email || 'Admin');
      setToken(currentUser.token?.access_token || null);
    }

    // Listen for login events
    netlifyIdentity.on('login', (user) => {
      setUser(user.user_metadata?.full_name || user.email || 'Admin');
      setToken(user.token?.access_token || null);
    });

    // Listen for logout events
    netlifyIdentity.on('logout', () => {
      setUser(null);
      setToken(null);
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt', token);
    } else {
      localStorage.removeItem('jwt');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async () => {
    return new Promise<boolean>((resolve) => {
      netlifyIdentity.open("login");

      const handleLogin = (user: any) => {
        netlifyIdentity.close();
        setUser(user.user_metadata?.full_name || user.email || 'Admin');
        setToken(user.token?.access_token || null);
        netlifyIdentity.off('login', handleLogin);
        resolve(true);
      };

      const handleClose = () => {
        netlifyIdentity.off('login', handleLogin);
        netlifyIdentity.off('close', handleClose);
        resolve(false);
      };

      netlifyIdentity.on('login', handleLogin);
      netlifyIdentity.on('close', handleClose);
    });
  };

  const logout = () => {
    netlifyIdentity.logout();
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// Helper fetch wrapper that automatically attaches Authorization header if token exists
export async function authFetch(input: RequestInfo, init: RequestInit & { skipAuth?: boolean } = {}) {
  const { skipAuth, ...restInit } = init;
  const headers = new Headers(restInit.headers || {});
  if (!skipAuth) {
    const token = localStorage.getItem('jwt');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return fetch(input, { ...restInit, headers });
}