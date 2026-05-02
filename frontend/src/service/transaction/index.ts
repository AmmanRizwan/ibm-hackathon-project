import api from "../api";
import type { 
    ICreateTransaction, 
    IUpdateTransaction, 
    IGetAllTransactionsQuery,
    IGetUserTransactionsQuery
} from "./interface";

// Admin: Get all transactions with pagination and filters
const getAllTransactions = async (query?: IGetAllTransactionsQuery) => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.status) params.append('status', query.status);
    
    const response = await api.get(`/transaction?${params.toString()}`);
    return response.data;
}

// Admin: Get transaction by ID
const getTransactionById = async (id: string) => {
    const response = await api.get(`/transaction/${id}`);
    return response.data;
}

// Admin: Create transaction
const createTransaction = async (payload: ICreateTransaction) => {
    const response = await api.post(`/transaction`, payload);
    return response.data;
}

// Admin: Update transaction
const updateTransaction = async (id: string, payload: IUpdateTransaction) => {
    const response = await api.put(`/transaction/${id}`, payload);
    return response.data;
}

// Admin: Delete transaction
const deleteTransaction = async (id: string) => {
    const response = await api.delete(`/transaction/${id}`);
    return response.data;
}

// User: Get user's transaction by ID
const getUserTransaction = async (transactionId: string) => {
    const response = await api.get(`/transaction/user/${transactionId}`);
    return response.data;
}

// User: Get all user's transactions with pagination and filters
const getUserTransactions = async (query?: IGetUserTransactionsQuery) => {
    const params = new URLSearchParams();
    if (query?.page) params.append('page', query.page.toString());
    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.status) params.append('status', query.status);
    
    const response = await api.get(`/transaction/user?${params.toString()}`);
    return response.data;
}

export {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getUserTransaction,
    getUserTransactions
}

// Made with Bob