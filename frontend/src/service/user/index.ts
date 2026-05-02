import api from "../api";
import type { IUpdateUserDetail, IUser, IVerifiedEmployee } from "./interface";

// Get current user details
const getMe = async () => {
    const response = await api.get(`/user/me`);
    return response.data;
}

// Update user details
const updateUserDetail = async (payload: IUpdateUserDetail) => {
    const response = await api.put(`/user/update`, payload);
    return response.data;
}

// Get all non-admin users
const getAllUsers = async (): Promise<{ message: string; data: IUser[] }> => {
    const response = await api.get(`/user/all`);
    return response.data;
}

// Get all verified employees with billing and payment details
const getAllVerifiedEmployees = async (): Promise<{ message: string; data: IVerifiedEmployee[] }> => {
    const response = await api.get(`/user/verified-employees`);
    return response.data;
}

// Delete a user by ID
const deleteUser = async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
}

export {
    getMe,
    updateUserDetail,
    getAllUsers,
    getAllVerifiedEmployees,
    deleteUser
}

// Made with Bob