import api from "../api";
import type { 
    ICreateBillingDetail, 
    IUpdateBillingDetail, 
    IUpdateIsVerify,
    IGetAllBillingDetailsQuery
} from "./interface";

// Admin: Get all billing details with pagination
const getAllBillingDetails = async (query?: IGetAllBillingDetailsQuery) => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    
    const response = await api.get(`/billing-details?${params.toString()}`);
    return response.data;
}

// Admin: Update verification status
const updateIsVerify = async (id: string, payload: IUpdateIsVerify) => {
    const response = await api.patch(`/billing-details/${id}/verify`, payload);
    return response.data;
}

// Admin: Update billing detail
const updateBillingDetail = async (id: string, payload: IUpdateBillingDetail) => {
    const response = await api.put(`/billing-details/${id}`, payload);
    return response.data;
}

// Admin: Delete billing detail
const deleteBillingDetail = async (id: string) => {
    const response = await api.delete(`/billing-details/${id}`);
    return response.data;
}

// User: Create billing detail
const createUserBillingDetail = async (payload: ICreateBillingDetail) => {
    const response = await api.post(`/billing-details/user`, payload);
    return response.data;
}

// User: Get user's billing details
const getUserBillingDetails = async () => {
    const response = await api.get(`/billing-details/user`);
    return response.data;
}

export {
    getAllBillingDetails,
    updateIsVerify,
    updateBillingDetail,
    deleteBillingDetail,
    createUserBillingDetail,
    getUserBillingDetails
}

// Made with Bob