import api from "../api";
import type { IUpdateUserDetail } from "./interface";

// Get current user details
const getMe = async () => {
    const response = await api.get(`/user/me`);
    return response.data;
}

// Update user details
const updateUserDetail = async (payload: IUpdateUserDetail) => {
    const response = await api.put(`/user/me`, payload);
    return response.data;
}

export {
    getMe,
    updateUserDetail
}

// Made with Bob