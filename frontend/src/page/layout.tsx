import Home from "../page/home";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./auth/login";
import SignUp from "./auth/signup";
import ForgotPassword from "./auth/forgot-password";
import ProtectedRoute from "@/utils/ProtectedRoute";
import Profile from "./profile";
import BillingDetail from "./billing_detail";
import PaymentMethod from "./payment_method";
import Invoice from "./invoice";
import Transaction from "./transaction";
import PermissionRoute from "@/utils/PermissionRoute";
import AdminBillingDetail from "./admin/billing_detail";
import AdminInvoice from "./admin/invoice";
import AdminPaymentMethod from "./admin/payment_method";
import AdminTransaction from "./admin/transcation";
import NavBar from "@/components/custom/navbar";
import Sidebar from "@/components/custom/sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import CreateBillingDetail from "./billing_detail/new";
import CreatePaymentMethod from "./payment_method/new";

const LayoutContent = () => {
    const location = useLocation();
    const { token } = useSelector((state: RootState) => state.auth);
    
    // Routes where sidebar and navbar should not be displayed (auth pages)
    const authRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
    const isAuthPage = authRoutes.includes(location.pathname);
    
    // Show sidebar on all pages except auth pages and home page
    const shouldShowSidebar = !isAuthPage && location.pathname !== '/';

    return (
        <>
            {!isAuthPage && <NavBar />}
            {shouldShowSidebar && <Sidebar />}
            <main className={shouldShowSidebar ? 'lg:ml-64' : ''}>
                <div>
                    <Routes>
                        <Route element={<Home />} path="/" />
                        
                        <Route element={<Login />} path="/auth/login" />
                        <Route element={<SignUp />} path="/auth/signup"/>
                        <Route element={<ForgotPassword />} path="/auth/forgot-password" />
                        
                        <Route element={<ProtectedRoute />} path="/user/*">
                        
                            <Route element={<Profile />} path="profile"/>
                            <Route element={<BillingDetail />} path="billing_detail"/>
                            <Route element={<CreateBillingDetail />} path="billing_detail/new" />
                            <Route element={<PaymentMethod />} path="payment-method"/>
                            <Route element={<CreatePaymentMethod />} path="payment-method/new"/>
                            <Route element={<Invoice />} path="invoice" />
                            <Route element={<Transaction />} path="transaction" />

                            <Route element={<PermissionRoute />} path="admin/*">
                                <Route element={<AdminBillingDetail />} path="bill" />
                                <Route element={<AdminInvoice />} path="invoice-check"/>
                                <Route element={<AdminPaymentMethod />} path="payment" />
                                <Route element={<AdminTransaction />} path="transaction" />
                            </Route>
                        
                        </Route>
                    </Routes>
                </div>
            </main>
        </>
    );
};

const Layout = () => {
    return (
        <BrowserRouter>
            <LayoutContent />
        </BrowserRouter>
    )
}

export default Layout;