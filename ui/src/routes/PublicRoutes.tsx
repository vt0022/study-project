import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

interface PublicRoutesProps {
    redirect?: boolean;
}

function PublicRoutes({ redirect = false }: PublicRoutesProps) {
    // Check if user is authenticated
    // State from redux-persist always contain _persist key (metadata)
    const { _persist, ...user } = useSelector((state: RootState) => state.user);

    const isAuthenticated = Object.keys(user).length > 0;

    return isAuthenticated && redirect ? <Navigate to="/home" /> : <Outlet />;
}

export default PublicRoutes;
