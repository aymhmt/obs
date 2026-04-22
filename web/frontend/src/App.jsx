import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";

import { Ogrenciler } from "./pages/AdminPage";
import { Ogretmenler, Dersler, KayitOnaylari} from "./pages/AdminPage";
import { OgrenciDashboard, DersSecimi, Derslerim} from "./pages/StudentPage";
import { OgretmenDashboard, OgretmenDersler } from "./pages/TeacherPage";

const PrivateRoute = ({ children, roller }) => {
  const { kullanici } = useAuth();
  if (!kullanici) return <Navigate to="/student" />;
  if (roller && !roller.includes(kullanici.rol)) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
};

const GuestRoute = ({ children }) => {
  const { kullanici } = useAuth();
  if (kullanici) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  const { kullanici } = useAuth();
  return (
    <Routes>
      <Route path="/student" element={<GuestRoute><StudentLogin /></GuestRoute>} />
      <Route path="/teacher" element={<GuestRoute><TeacherLogin /></GuestRoute>} />
      <Route path="/admin"   element={<GuestRoute><AdminLogin /></GuestRoute>} />

      <Route path="/dashboard"      element={<PrivateRoute roller={["admin","idari"]}><Dashboard /></PrivateRoute>} />
      <Route path="/ogrenciler"     element={<PrivateRoute roller={["admin","idari"]}><Ogrenciler /></PrivateRoute>} />
      <Route path="/ogretmenler"    element={<PrivateRoute roller={["admin","idari"]}><Ogretmenler /></PrivateRoute>} />
      <Route path="/dersler"        element={<PrivateRoute roller={["admin","idari"]}><Dersler /></PrivateRoute>} />
      <Route path="/kayit-onaylari" element={<PrivateRoute roller={["admin","idari"]}><KayitOnaylari /></PrivateRoute>} />


      <Route path="/ogrenci"                element={<PrivateRoute roller={["ogrenci"]}><OgrenciDashboard /></PrivateRoute>} />
      <Route path="/ogrenci/ders-secimi"    element={<PrivateRoute roller={["ogrenci"]}><DersSecimi /></PrivateRoute>} />
      <Route path="/ogrenci/derslerim"      element={<PrivateRoute roller={["ogrenci"]}><Derslerim /></PrivateRoute>} />

      <Route path="/ogretmen"               element={<PrivateRoute roller={["ogretmen"]}><OgretmenDashboard /></PrivateRoute>} />
      <Route path="/ogretmen/derslerim"     element={<PrivateRoute roller={["ogretmen"]}><OgretmenDersler /></PrivateRoute>} />

      <Route path="/" element={
        !kullanici ? <Navigate to="/student" /> :
        kullanici.rol === "ogrenci"  ? <Navigate to="/ogrenci" /> :
        kullanici.rol === "ogretmen" ? <Navigate to="/ogretmen" /> :
        <Navigate to="/dashboard" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
