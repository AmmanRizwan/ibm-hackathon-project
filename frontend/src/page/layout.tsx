import Home from "../page/home";
import { BrowserRouter, Routes, Route} from "react-router-dom";
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

const Layout = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Home />} path="/" />
                
                <Route element={<Login />} path="/auth/login" />
                <Route element={<SignUp />} path="/auth/signup"/>
                <Route element={<ForgotPassword />} path="/auth/forgot-password" />
                
                <Route element={<ProtectedRoute />} path="/user/*">
                
                    <Route element={<Profile />} path="profile"/>
                    <Route element={<BillingDetail />} path="billing_detail"/>
                    <Route element={<PaymentMethod />} path="payment-method"/>
                    <Route element={<Invoice />} path="/invoice" />
                    <Route element={<Transaction />} path="/transaction" />

                    <Route element={<PermissionRoute />} path="/admin/*">
                        <Route element={<AdminBillingDetail />} path="bill" />
                        <Route element={<AdminInvoice />} path="invoice-check"/>
                        <Route element={<AdminPaymentMethod />} path="payment" />
                        <Route element={<AdminTransaction />} path="transaction" />
                    </Route>
                
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Layout;