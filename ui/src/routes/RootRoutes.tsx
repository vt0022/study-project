import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import OTP from "@/pages/auth/OTP";
import MainLayout from "@/layouts/MainLayout";

function MainRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify" element={<OTP />} />
      <Route path="/m" element={<MainLayout />} />
    </Routes>
  );
}

export default MainRoutes;
