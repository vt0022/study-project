import MainLayout from "@/layouts/MainLayout";
import OTP from "@/pages/auth/OTP";
import Home from "@/pages/post/Home";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route element={<ProtectedRoutes />}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="home" element={<Home />} />
                </Route>
            </Route>
            <Route element={<PublicRoutes redirect={true} />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="verify" element={<OTP />} />
            </Route>
            <Route element={<PublicRoutes />}></Route>
            <Route path="*" element={<h1>Page not found</h1>} />
        </Route>,
    ),
);

function RootRoutes() {
    return <RouterProvider router={router} />;
}

export default RootRoutes;
