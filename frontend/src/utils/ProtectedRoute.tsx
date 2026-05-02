import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const ProtectedRoute = () => {
    const { token } = useSelector((state: RootState) => state.auth);
    const localToken = localStorage.getItem("token");

    return (localToken && token) !== null ? <Outlet /> : <Navigate to={"/"} />
}

export default ProtectedRoute;