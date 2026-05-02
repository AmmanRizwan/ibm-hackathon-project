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
    
    const response = await api.get(`/payment-methods?${params.toString()}`);
    return response.data;
}

// Admin: Update verification status
const updateIsVerify = async (id: string, payload: IUpdateIsVerify) => {
    const response = await api.patch(`/payment-methods/${id}/verify`, payload);
    return response.data;
}

// Admin: Update payment method
const updatePaymentMethod = async (id: string, payload: IUpdatePaymentMethod) => {
    const response = await api.put(`/payment-methods/${id}`, payload);
    return response.data;
}

// Admin: Delete payment method
const deletePaymentMethod = async (id: string) => {
    const response = await api.delete(`/payment-methods/${id}`);
    return response.data;
}

// User: Create payment method
const createUserPaymentMethod = async (payload: ICreatePaymentMethod) => {
    const response = await api.post(`/payment-methods/user`, payload);
    return response.data;
}

// User: Get user's payment methods
const getUserPaymentMethods = async () => {
    const response = await api.get(`/payment-methods/user`);
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