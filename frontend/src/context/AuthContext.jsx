import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  // Au chargement : si un jeton existe, on récupère le profil.
  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      // Connexion : seuls les comptes validés par un administrateur reçoivent un jeton.
      login: async (payload) => {
        const { token } = await api.login(payload);
        tokenStore.set(token);
        const me = await api.me();
        setUser(me);
        return me;
      },
      // Inscription : le compte reste en attente, aucune connexion automatique.
      register: (payload) => api.register(payload),
      logout: () => {
        tokenStore.clear();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
