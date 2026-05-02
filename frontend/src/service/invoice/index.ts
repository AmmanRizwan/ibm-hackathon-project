import api from "../api";
import type { 
    ICreateInvoice, 
    IUpdateInvoice, 
    IGetAllInvoicesQuery,
    IGetUserInvoicesQuery
} from "./interface";

// Admin: Get all invoices with pagination
const getAllInvoices = async (query?: IGetAllInvoicesQuery) => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    
    const response = await api.get(`/invoice/admin?${params.toString()}`);
    return response.data;
}

// User: Get user's invoices with pagination
const getUserInvoices = async (query?: IGetUserInvoicesQuery) => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    
    const response = await api.get(`/invoice?${params.toString()}`);
    return response.data;
}

// User: Get invoice by ID
const getInvoiceById = async (id: string) => {
    const response = await api.get(`/invoice/${id}`);
    return response.data;
}

// User: Create invoice
const createInvoice = async (payload: ICreateInvoice) => {
    const response = await api.post(`/invoice`, payload);
    return response.data;
}

// User: Update invoice
const updateInvoice = async (id: string, payload: IUpdateInvoice) => {
    const response = await api.put(`/invoice/${id}`, payload);
    return response.data;
}

// User: Delete invoice
const deleteInvoice = async (id: string) => {
    const response = await api.delete(`/invoice/${id}`);
    return response.data;
}

// Admin: Update any invoice
const adminUpdateInvoice = async (id: string, payload: IUpdateInvoice) => {
    const response = await api.put(`/invoice/admin/${id}`, payload);
    return response.data;
}

// Admin: Delete any invoice
const adminDeleteInvoice = async (id: string) => {
    const response = await api.delete(`/invoice/admin/${id}`);
    return response.data;
}

export {
    getAllInvoices,
    getUserInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    adminUpdateInvoice,
    adminDeleteInvoice
}

// Made with Bob