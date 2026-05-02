import { Navigate, Outlet } from "react-router-dom"

const AutoRedirect = () => {
    const token = localStorage.getItem("token");

    if (token) {
        return <Navigate to={"/user/profile"} replace />
    }

    return <Outlet />;
}

export default AutoRedirect;