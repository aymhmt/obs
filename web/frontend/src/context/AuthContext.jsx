import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [kullanici, setKullanici] = useState(() => {
    const k = localStorage.getItem("kullanici");
    return k ? JSON.parse(k) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    api.get("/auth/me")
      .then((r) => {
        const u = r.data;
        const prof = { ...u, id: u.ogrenci_id ?? u.ogretmen_id ?? u.kullanici_id, kullanici_adi: u.kullanici_adi ?? u.ogrenci_no };
        localStorage.setItem("kullanici", JSON.stringify(prof));
        setKullanici(prof);
      })
      .catch(() => {});
  }, []);

  const login = async (kullanici_adi, sifre) => {
    const res = await api.post("/auth/login", { kullanici_adi, sifre });
    localStorage.setItem("token", res.data.token);
    const prof = { ...res.data.kullanici, id: res.data.kullanici.id };
    localStorage.setItem("kullanici", JSON.stringify(prof));
    setKullanici(prof);
    return prof;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("kullanici");
    setKullanici(null);
  };

  return (
    <AuthContext.Provider value={{ kullanici, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
