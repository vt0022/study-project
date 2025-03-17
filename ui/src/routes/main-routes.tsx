import { Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import OTP from "@/pages/auth/OTP";

function MainRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="verify" element={<OTP />} />
    </Routes>
  );
}

export default MainRoutes;
