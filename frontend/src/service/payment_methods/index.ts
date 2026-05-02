import api from "../api";
import type { 
    ICreatePaymentMethod, 
    IUpdatePaymentMethod, 
    IUpdateIsVerify,
    IGetAllPaymentMethodsQuery
} from "./interface";

// Admin: Get all payment methods with pagination
const getAllPaymentMethods = async (query?: IGetAllPaymentMethodsQuery) => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    
    const response = await api.get(`/payment-method/admin?${params.toString()}`);
    return response.data;
}

// Admin: Update verification status
const updateIsVerify = async (id: string, payload: IUpdateIsVerify) => {
    const response = await api.put(`/payment-method/admin/${id}/verify`, payload);
    return response.data;
}

// Admin: Update payment method
const updatePaymentMethod = async (id: string, payload: IUpdatePaymentMethod) => {
    const response = await api.put(`/payment-method/admin/${id}`, payload);
    return response.data;
}

// Admin: Delete payment method
const deletePaymentMethod = async (id: string) => {
    const response = await api.delete(`/payment-method/admin/${id}`);
    return response.data;
}

// User: Create payment method
const createUserPaymentMethod = async (payload: ICreatePaymentMethod) => {
    const response = await api.post(`/payment-method`, payload);
    return response.data;
}

// User: Get user's payment methods
const getUserPaymentMethods = async () => {
    const response = await api.get(`/payment-method`);
    return response.data;
}

export {
    getAllPaymentMethods,
    updateIsVerify,
    updatePaymentMethod,
    deletePaymentMethod,
    createUserPaymentMethod,
    getUserPaymentMethods
}

// Made with Bob