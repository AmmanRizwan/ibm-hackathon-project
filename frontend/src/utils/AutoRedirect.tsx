import type { RootState } from "@/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AutoRedirect = () => {
    const { token } = useSelector((state: RootState) => state.auth);

    if (!token) {
        return <Navigate to={"/auth/login"} replace />
    }

    return <Outlet />
}

export default AutoRedirect;