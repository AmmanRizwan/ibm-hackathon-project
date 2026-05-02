import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const PermissionRoute = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return user.role === "admin" ? <Outlet /> : <Navigate to={"/"} />
}

export default PermissionRoute;